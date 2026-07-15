from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.database.connection import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String, primary_key=True, index=True)  # e.g. "TCK-101"
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    issue = Column(String, nullable=False)
    status = Column(String, default="OPEN", nullable=False)  # OPEN, IN_PROGRESS, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow)
