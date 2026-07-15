from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    issue: str
    user_id: Optional[int] = None

class TicketUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        upper_v = v.strip().upper()
        if upper_v not in ["OPEN", "IN_PROGRESS", "RESOLVED"]:
            raise ValueError("Status must be one of: OPEN, IN_PROGRESS, RESOLVED")
        return upper_v

class TicketDTO(BaseModel):
    id: str
    user_id: Optional[int] = None
    issue: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
