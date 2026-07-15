import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.chat_history import ChatHistory
from app.models.user import User

class MemoryManager:
    """Manages sliding window conversation history and extracts persistent entity context across turns."""

    def __init__(self, db: Session):
        self.db = db

    def get_sliding_window_history(self, user_id: int, window_size: int = 6) -> List[Dict[str, str]]:
        if not user_id:
            return []
        
        history_items = self.db.query(ChatHistory).filter(
            ChatHistory.user_id == user_id
        ).order_by(ChatHistory.timestamp.desc()).limit(window_size).all()

        # Reverse so they are in chronological order
        history_items.reverse()

        messages = []
        for item in history_items:
            messages.append({"role": "user", "content": item.message})
            messages.append({"role": "assistant", "content": item.response})
        return messages

    def extract_entity_context(self, user_id: Optional[int], latest_message: str) -> Dict[str, Any]:
        entities = {
            "customer_name": "Valued Customer",
            "active_order_ids": [],
            "last_ticket_id": None
        }

        if user_id:
            user = self.db.query(User).filter(User.id == user_id).first()
            if user:
                entities["customer_name"] = user.name

            # Look for recently discussed orders or tickets in recent history
            recent_turns = self.db.query(ChatHistory).filter(
                ChatHistory.user_id == user_id
            ).order_by(ChatHistory.timestamp.desc()).limit(10).all()

            order_matches = set()
            ticket_matches = []
            for turn in recent_turns:
                combined_text = f"{turn.message} {turn.response} {turn.tools_called}"
                found_orders = re.findall(r"ORD\d{4,}", combined_text.upper())
                found_tickets = re.findall(r"TCK-\d+", combined_text.upper())
                order_matches.update(found_orders)
                ticket_matches.extend(found_tickets)

            if order_matches:
                entities["active_order_ids"] = list(order_matches)
            if ticket_matches:
                entities["last_ticket_id"] = ticket_matches[0]

        # Also inspect current message for immediate mentions
        current_orders = re.findall(r"ORD\d{4,}", latest_message.upper())
        current_tickets = re.findall(r"TCK-\d+", latest_message.upper())
        if current_orders:
            entities["active_order_ids"] += [o for o in current_orders if o not in entities["active_order_ids"]]
        if current_tickets:
            entities["last_ticket_id"] = current_tickets[0]

        return entities

    def save_turn(self, user_id: Optional[int], message: str, response: str, tools_called: str = "[]") -> ChatHistory:
        turn = ChatHistory(
            user_id=user_id,
            message=message,
            response=response,
            tools_called=tools_called
        )
        self.db.add(turn)
        self.db.commit()
        self.db.refresh(turn)
        return turn
