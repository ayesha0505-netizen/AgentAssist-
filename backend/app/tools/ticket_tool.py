import uuid
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.tools.base_tool import BaseTool
from app.models.ticket import Ticket

class CreateTicketInput(BaseModel):
    issue: str = Field(..., description="Detailed description of the customer's issue or complaint.")
    user_id: Optional[int] = Field(None, description="The integer database ID of the logged-in user.")

class CreateTicketTool(BaseTool):
    name = "CreateTicketTool"
    description = "Creates a new customer support ticket in the system when a customer reports an issue, product damage, or shipping complaint."
    args_schema = CreateTicketInput

    def execute(self, arguments: Dict[str, Any], db: Session = None) -> Dict[str, Any]:
        try:
            validated = self.args_schema(**arguments)
            if db is None:
                return {"error": "Database session not provided."}

            # Generate unique ticket ID like TCK-8F3B2A
            ticket_id = f"TCK-{uuid.uuid4().hex[:6].upper()}"

            new_ticket = Ticket(
                id=ticket_id,
                user_id=validated.user_id,
                issue=validated.issue,
                status="OPEN"
            )
            db.add(new_ticket)
            db.commit()
            db.refresh(new_ticket)

            return {
                "success": True,
                "ticket_id": new_ticket.id,
                "status": new_ticket.status,
                "issue": new_ticket.issue,
                "message": f"Successfully created support ticket #{new_ticket.id}. Our team has been notified."
            }
        except Exception as e:
            if db:
                db.rollback()
            return {"error": f"Failed to execute CreateTicketTool: {str(e)}"}
