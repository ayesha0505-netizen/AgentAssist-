from typing import Any, Dict
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.tools.base_tool import BaseTool
from app.models.product import Product

class ProductSearchInput(BaseModel):
    query: str = Field(..., description="Keyword or product name to search for, e.g. 'Laptop', 'Headphones', 'Keyboard'.")

class ProductSearchTool(BaseTool):
    name = "ProductSearchTool"
    description = "Searches the catalog for products matching a keyword. Returns names, descriptions, pricing, and stock count."
    args_schema = ProductSearchInput

    def execute(self, arguments: Dict[str, Any], db: Session = None) -> Dict[str, Any]:
        try:
            validated = self.args_schema(**arguments)
            if db is None:
                return {"error": "Database session not provided."}

            clean_query = validated.query.strip().lower()
            if clean_query in ["all", "products", "catalog", "list", "items", "everything", ""]:
                products = db.query(Product).limit(10).all()
            else:
                keyword = f"%{validated.query}%"
                products = db.query(Product).filter(
                    (Product.name.ilike(keyword)) | (Product.description.ilike(keyword))
                ).limit(6).all()

            if not products:
                return {
                    "found": False,
                    "query": validated.query,
                    "products": [],
                    "message": f"No products found matching '{validated.query}'."
                }

            result_list = [
                {
                    "id": p.id,
                    "name": p.name,
                    "description": p.description,
                    "price": p.price,
                    "stock": p.stock
                }
                for p in products
            ]

            return {
                "found": True,
                "query": validated.query,
                "products": result_list
            }
        except Exception as e:
            return {"error": f"Failed to execute ProductSearchTool: {str(e)}"}
