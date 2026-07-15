from typing import Any, Dict
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.tools.base_tool import BaseTool
from app.models.order import Order

class CheckOrderInput(BaseModel):
    order_id: str = Field(..., description="The unique tracking ID of the customer order, e.g. 'ORD1005' or 'ORD1008'.")

class CheckOrderTool(BaseTool):
    name = "CheckOrderTool"
    description = "Retrieves real-time order status, customer name, and estimated delivery date from the database given an order_id."
    args_schema = CheckOrderInput

    def execute(self, arguments: Dict[str, Any], db: Session = None) -> Dict[str, Any]:
        try:
            validated = self.args_schema(**arguments)
            order_id = validated.order_id.strip().upper()
            if not order_id.startswith("ORD"):
                if order_id.isdigit():
                    order_id = f"ORD{order_id}"
            
            if db is None:
                return {"error": "Database session not provided."}

            order = db.query(Order).filter(Order.id == order_id).first()
            if not order:
                return {
                    "found": False,
                    "order_id": order_id,
                    "message": f"Order #{order_id} could not be found in our database. Please double-check the ID."
                }

            return {
                "found": True,
                "order_id": order.id,
                "customer_name": order.customer_name,
                "status": order.status,
                "expected_delivery": order.expected_delivery
            }
        except Exception as e:
            return {"error": f"Failed to execute CheckOrderTool: {str(e)}"}
