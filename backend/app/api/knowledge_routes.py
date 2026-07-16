import os
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.config.settings import settings
from app.rag.vector_store import get_vector_store
from app.utils.auth import require_auth
from app.models.user import User

router = APIRouter(prefix="/api/knowledge", tags=["Knowledge Base & RAG"])

@router.post("/upload")
async def upload_knowledge_doc(file: UploadFile = File(...), user: User = Depends(require_auth)):
    if not file.filename.endswith(".md") and not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .md and .txt files are allowed in the knowledge base.")

    os.makedirs(settings.KNOWLEDGE_BASE_PATH, exist_ok=True)
    filepath = os.path.join(settings.KNOWLEDGE_BASE_PATH, file.filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    # Rebuild vector store
    vs = get_vector_store()
    chunk_count = vs.build_index()

    return {
        "success": True,
        "filename": file.filename,
        "indexed_chunks": chunk_count,
        "message": f"Successfully uploaded {file.filename} and re-indexed FAISS with {chunk_count} chunks."
    }
