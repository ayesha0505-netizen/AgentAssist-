import os
import pickle
import numpy as np
from typing import List, Dict, Any, Optional
from app.config.settings import settings
from app.rag.document_loader import DocumentLoader
from app.rag.text_splitter import RecursiveTextSplitter

try:
    import faiss
    from sentence_transformers import SentenceTransformer
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False


class VectorStore:
    """FAISS-backed local vector index using SentenceTransformers for exact k-NN semantic retrieval."""
    
    def __init__(self, index_dir: str = settings.VECTOR_STORE_PATH):
        self.index_dir = index_dir
        self.index_path = os.path.join(index_dir, "index.faiss")
        self.meta_path = os.path.join(index_dir, "index.pkl")
        self.model_name = "all-MiniLM-L6-v2"
        self.model = None
        self.index = None
        self.chunk_metadata: List[Dict[str, Any]] = []

    def _ensure_model(self):
        if not FAISS_AVAILABLE:
            raise RuntimeError("FAISS or SentenceTransformers library not installed.")
        if self.model is None:
            self.model = SentenceTransformer(self.model_name)

    def build_index(self, knowledge_base_dir: str = settings.KNOWLEDGE_BASE_PATH) -> int:
        if not FAISS_AVAILABLE:
            print("Warning: FAISS not available. Skipping vector store build.")
            return 0

        self._ensure_model()
        loader = DocumentLoader(knowledge_base_dir)
        raw_docs = loader.load_documents()
        if not raw_docs:
            print(f"No documents found in {knowledge_base_dir} to index.")
            return 0

        splitter = RecursiveTextSplitter(chunk_size=500, chunk_overlap=50)
        chunked_docs = splitter.split_documents(raw_docs)
        if not chunked_docs:
            return 0

        texts = [doc["content"] for doc in chunked_docs]
        embeddings = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)

        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dimension)  # Inner Product on normalized vectors = Cosine Similarity
        self.index.add(embeddings)
        self.chunk_metadata = chunked_docs

        os.makedirs(self.index_dir, exist_ok=True)
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "wb") as f:
            pickle.dump(self.chunk_metadata, f)

        print(f"Successfully built FAISS index with {len(texts)} chunks across {len(raw_docs)} documents.")
        return len(texts)

    def load_index(self) -> bool:
        if not FAISS_AVAILABLE or not os.path.exists(self.index_path) or not os.path.exists(self.meta_path):
            return False

        try:
            self._ensure_model()
            self.index = faiss.read_index(self.index_path)
            with open(self.meta_path, "rb") as f:
                self.chunk_metadata = pickle.load(f)
            return True
        except Exception as e:
            print(f"Error loading FAISS index: {e}")
            return False

    def similarity_search(self, query: str, k: int = settings.RAG_TOP_K, threshold: float = settings.RAG_SIMILARITY_THRESHOLD) -> List[Dict[str, Any]]:
        if not FAISS_AVAILABLE:
            return []

        if self.index is None or not self.chunk_metadata:
            loaded = self.load_index()
            if not loaded:
                print("FAISS index not loaded or empty. Attempting auto-build...")
                self.build_index()
                if self.index is None:
                    return []

        self._ensure_model()
        query_vec = self.model.encode([query], convert_to_numpy=True, normalize_embeddings=True)
        scores, indices = self.index.search(query_vec, k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx != -1 and idx < len(self.chunk_metadata):
                # Cosine similarity score (normalized inner product)
                if float(score) >= threshold:
                    doc_item = self.chunk_metadata[idx].copy()
                    doc_item["similarity_score"] = float(score)
                    results.append(doc_item)

        return results


# Global singleton vector store instance
_vector_store_instance: Optional[VectorStore] = None

def get_vector_store() -> VectorStore:
    global _vector_store_instance
    if _vector_store_instance is None:
        _vector_store_instance = VectorStore()
    return _vector_store_instance
