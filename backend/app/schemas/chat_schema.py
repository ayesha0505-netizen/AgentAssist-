from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class ToolExecutionMeta(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]
    result: Any

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    tools_used: List[ToolExecutionMeta] = []
    timestamp: datetime = datetime.utcnow()

class ChatHistoryItem(BaseModel):
    id: int
    user_id: Optional[int] = None
    message: str
    response: str
    tools_called: str
    timestamp: datetime

    class Config:
        from_attributes = True
