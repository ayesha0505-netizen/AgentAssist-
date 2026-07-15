from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth_router, chat_router, order_router, ticket_router, product_router, knowledge_router
from app.database.init_db import init_db
from app.rag.vector_store import get_vector_store

app = FastAPI(
    title="AgentAssist AI Backend API",
    description="Agentic Customer Support System with Gemini ReAct Loop, RAG (FAISS), and Tool Calling.",
    version="1.0.0"
)

# Configure CORS for React frontend (Vite default is 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(order_router)
app.include_router(ticket_router)
app.include_router(product_router)
app.include_router(knowledge_router)

@app.on_event("startup")
def on_startup():
    print("Starting up AgentAssist AI Backend...")
    # Initialize SQLite tables and seed data
    init_db()
    # Build or load local FAISS index
    try:
        vs = get_vector_store()
        vs.build_index()
    except Exception as e:
        print(f"Note: Vector store auto-build encountered an issue during startup: {e}")

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "AgentAssist AI Backend",
        "version": "1.0.0",
        "agentic_loop": "active"
    }
