from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.database.connection import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)  # e.g. "ORD1005"
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String, nullable=False)
    status = Column(String, default="PROCESSING", nullable=False)  # PROCESSING, SHIPPED, DELIVERED, DELAYED
    expected_delivery = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
