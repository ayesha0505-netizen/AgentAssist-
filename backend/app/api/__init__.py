from app.api.auth_routes import router as auth_router
from app.api.chat_routes import router as chat_router
from app.api.order_routes import router as order_router
from app.api.ticket_routes import router as ticket_router
from app.api.product_routes import router as product_router
from app.api.knowledge_routes import router as knowledge_router

__all__ = ["auth_router", "chat_router", "order_router", "ticket_router", "product_router", "knowledge_router"]
