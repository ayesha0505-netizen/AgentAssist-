from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrderDTO(BaseModel):
    id: str
    user_id: Optional[int] = None
    customer_name: str
    status: str
    expected_delivery: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
