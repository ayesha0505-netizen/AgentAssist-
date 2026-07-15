import uuid
from typing import Any, Dict
from pydantic import BaseModel, Field
from app.tools.base_tool import BaseTool

class BookAppointmentInput(BaseModel):
    preferred_date: str = Field(..., description="Preferred date for the appointment, e.g. '2026-07-25' or 'Tomorrow'.")
    preferred_time: str = Field(..., description="Preferred time slot, e.g. '14:00' or '2 PM EST'.")
    reason: str = Field(..., description="Brief reason for booking the support call or consultation.")

class BookAppointmentTool(BaseTool):
    name = "BookAppointmentTool"
    description = "Books a mock appointment or technical consultation with a live specialist on the requested date and time."
    args_schema = BookAppointmentInput

    def execute(self, arguments: Dict[str, Any], db: Any = None) -> Dict[str, Any]:
        try:
            validated = self.args_schema(**arguments)
            booking_id = f"APT-{uuid.uuid4().hex[:6].upper()}"
            
            return {
                "success": True,
                "booking_id": booking_id,
                "confirmed_date": validated.preferred_date,
                "confirmed_time": validated.preferred_time,
                "reason": validated.reason,
                "message": f"Successfully booked technical support appointment #{booking_id} for {validated.preferred_date} at {validated.preferred_time}."
            }
        except Exception as e:
            return {"error": f"Failed to execute BookAppointmentTool: {str(e)}"}
