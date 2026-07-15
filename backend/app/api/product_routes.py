from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.product import Product
from app.schemas.product_schema import ProductDTO

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[ProductDTO])
def list_products(query: str = None, db: Session = Depends(get_db)):
    if query:
        kw = f"%{query}%"
        products = db.query(Product).filter((Product.name.ilike(kw)) | (Product.description.ilike(kw))).all()
    else:
        products = db.query(Product).all()
    return [ProductDTO.model_validate(p) for p in products]
