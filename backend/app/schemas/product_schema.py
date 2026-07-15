from pydantic import BaseModel
from typing import Optional

class ProductDTO(BaseModel):
    id: int
    name: str
    description: str
    price: float
    stock: int

    class Config:
        from_attributes = True
