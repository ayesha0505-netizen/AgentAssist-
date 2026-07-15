from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.order import Order
from app.schemas.order_schema import OrderDTO

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.get("/{order_id}", response_model=OrderDTO)
def get_order(order_id: str, db: Session = Depends(get_db)):
    oid = order_id.strip().upper()
    order = db.query(Order).filter(Order.id == oid).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order #{oid} not found.")
    return OrderDTO.model_validate(order)
