from typing import List, Dict, Any

class RecursiveTextSplitter:
    """Splits raw document text into overlapping chunks suitable for local vector embeddings."""
    
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> List[str]:
        if not text:
            return []
        
        paragraphs = text.split("\n\n")
        chunks = []
        current_chunk = []
        current_length = 0

        for paragraph in paragraphs:
            para_len = len(paragraph)
            if current_length + para_len > self.chunk_size and current_chunk:
                chunk_str = "\n\n".join(current_chunk).strip()
                if chunk_str:
                    chunks.append(chunk_str)
                # Keep overlap from last paragraphs if possible
                overlap_len = 0
                new_chunk = []
                for p in reversed(current_chunk):
                    if overlap_len + len(p) <= self.chunk_overlap:
                        new_chunk.insert(0, p)
                        overlap_len += len(p)
                    else:
                        break
                current_chunk = new_chunk + [paragraph]
                current_length = overlap_len + para_len
            else:
                current_chunk.append(paragraph)
                current_length += para_len

        if current_chunk:
            chunk_str = "\n\n".join(current_chunk).strip()
            if chunk_str:
                chunks.append(chunk_str)

        return chunks

    def split_documents(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        chunked_docs = []
        for doc in documents:
            text = doc["content"]
            metadata = doc["metadata"]
            chunks = self.split_text(text)
            for idx, chunk_text in enumerate(chunks):
                chunked_docs.append({
                    "content": chunk_text,
                    "metadata": {
                        **metadata,
                        "chunk_index": idx
                    }
                })
        return chunked_docs
