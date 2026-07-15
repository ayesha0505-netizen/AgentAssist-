from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.chat_schema import ChatRequest, ChatResponse, ChatHistoryItem
from app.agent.coordinator import AgentCoordinator
from app.models.chat_history import ChatHistory
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/chat", tags=["Agent Chat"])

@router.post("", response_model=ChatResponse)
def chat_with_agent(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = request.user_id or (current_user.id if current_user else None)
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    coordinator = AgentCoordinator(db)
    result = coordinator.process_chat(message=request.message, user_id=user_id)
    
    return ChatResponse(
        response=result.get("response", ""),
        tools_used=result.get("tools_used", [])
    )

@router.get("/history", response_model=List[ChatHistoryItem])
def get_chat_history(user_id: int = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user and current_user.role != "admin" and user_id and user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view another user's chat history.")
    
    target_id = user_id or (current_user.id if current_user else None)
    if not target_id:
        return []
    
    turns = db.query(ChatHistory).filter(ChatHistory.user_id == target_id).order_by(ChatHistory.timestamp.asc()).all()
    return [ChatHistoryItem.model_validate(t) for t in turns]
