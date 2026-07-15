import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.ticket import Ticket
from app.schemas.ticket_schema import TicketCreate, TicketUpdate, TicketDTO
from app.utils.auth import get_current_user, require_admin
from app.models.user import User

router = APIRouter(prefix="/api/tickets", tags=["Support Tickets"])

@router.post("", response_model=TicketDTO)
def create_ticket(request: TicketCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = request.user_id or (current_user.id if current_user else None)
    ticket_id = f"TCK-{str(uuid.uuid4().int)[:3]}"
    
    new_ticket = Ticket(
        id=ticket_id,
        user_id=user_id,
        issue=request.issue.strip(),
        status="OPEN"
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return TicketDTO.model_validate(new_ticket)

@router.get("", response_model=List[TicketDTO])
def list_tickets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # If admin, return all tickets. Otherwise only user's tickets.
    if current_user and current_user.role == "admin":
        tickets = db.query(Ticket).order_by(Ticket.created_at.desc()).all()
    elif current_user:
        tickets = db.query(Ticket).filter(Ticket.user_id == current_user.id).order_by(Ticket.created_at.desc()).all()
    else:
        tickets = db.query(Ticket).order_by(Ticket.created_at.desc()).all()
    
    return [TicketDTO.model_validate(t) for t in tickets]

@router.put("/{ticket_id}", response_model=TicketDTO)
def update_ticket_status(ticket_id: str, request: TicketUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id.strip().upper()).first()
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket #{ticket_id} not found.")
    
    ticket.status = request.status.upper()
    db.commit()
    db.refresh(ticket)
    return TicketDTO.model_validate(ticket)
