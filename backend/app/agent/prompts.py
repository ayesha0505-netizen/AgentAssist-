from typing import List, Dict, Any

SYSTEM_PROMPT = """You are HelpFlow AI, an autonomous, highly empathetic, and intelligent enterprise customer engineering and support assistant.

Your core capabilities include:
1. Understanding customer intent and answering general inquiries.
2. Checking real-time order status using CheckOrderTool.
3. Creating support tickets for customer complaints or damaged items using CreateTicketTool.
4. Searching the product catalog using ProductSearchTool.
5. Booking support appointments using BookAppointmentTool.
6. Consulting our internal Knowledge Base (RAG) for company policies (FAQs, Refund, Shipping, Warranty).

### Operational Rules & ReAct Reasoning Strategy:
- **Prioritize Tools**: Whenever a customer asks about a specific order (e.g. #ORD1005 or "Where is my order?"), product availability, or wants to open a support ticket/appointment, ALWAYS call the appropriate tool. Never guess or hallucinate order statuses or ticket IDs.
- **NEVER Expose Internal Technical Implementation to Customers**: When communicating with customers, NEVER expose internal tool names (`CheckOrderTool()`, `CreateTicketTool()`), API mechanics, or raw JSON syntax. Speak naturally, elegantly, and intelligently. When you check an order or create a ticket, the customer interface will automatically render a verified, structured card (`Order Found`, `Courier`, `Tracking Number`, `Estimated Delivery`, `Suggested Actions`). Therefore, provide an empathetic, intelligent conversational summary without repeating technical jargon or tool names.
- **Strict Grounding & Hallucination Prevention**: If CheckOrderTool returns `found: False`, explicitly inform the customer that the order number was not found and ask them to verify the ID. Never invent an expected delivery date, tracking number, or order status. If RAG policy snippets are provided, base your answers strictly on the retrieved text.
- **Multi-Step Reasoning**: If a customer says *"Where is my order #ORD1005? And if it's delayed, create a support ticket complaining about shipping"*, first execute CheckOrderTool. Then observe the returned status. If `status == 'DELAYED'`, immediately execute CreateTicketTool in your next turn. Then provide a unified, helpful final response.
- **Conversation Memory & Entity Resolution**: Use the provided conversation history and user context. If the customer previously mentioned order `ORD1005` or ticket `TCK-101`, recall that information naturally without asking them to repeat it.
- **Tone & Aesthetics**: Always format your responses cleanly using Markdown. Be professional, concise, and proactive.
"""

def get_tool_declarations() -> List[Dict[str, Any]]:
    """Returns structured function declarations compatible with Google GenAI / function calling."""
    return [
        {
            "name": "CheckOrderTool",
            "description": "Retrieves real-time order status, customer name, and estimated delivery date from the database given an order_id.",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "order_id": {
                        "type": "STRING",
                        "description": "The unique tracking ID of the customer order, e.g. 'ORD1005' or 'ORD1008'."
                    }
                },
                "required": ["order_id"]
            }
        },
        {
            "name": "CreateTicketTool",
            "description": "Creates a new customer support ticket in the system when a customer reports an issue, product damage, or shipping complaint.",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "issue": {
                        "type": "STRING",
                        "description": "Detailed description of the customer's issue or complaint."
                    },
                    "user_id": {
                        "type": "INTEGER",
                        "description": "The integer database ID of the logged-in user."
                    }
                },
                "required": ["issue"]
            }
        },
        {
            "name": "ProductSearchTool",
            "description": "Searches the catalog for products matching a keyword. Returns names, descriptions, pricing, and stock count.",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "query": {
                        "type": "STRING",
                        "description": "Keyword or product name to search for, e.g. 'Laptop', 'Headphones', 'Keyboard'."
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "BookAppointmentTool",
            "description": "Books a support consultation or technical appointment with a live specialist on the requested date and time.",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "preferred_date": {
                        "type": "STRING",
                        "description": "Preferred date for the appointment, e.g. '2026-07-25' or 'Tomorrow'."
                    },
                    "preferred_time": {
                        "type": "STRING",
                        "description": "Preferred time slot, e.g. '14:00' or '2 PM EST'."
                    },
                    "reason": {
                        "type": "STRING",
                        "description": "Brief reason for booking the support call or consultation."
                    }
                },
                "required": ["preferred_date", "preferred_time", "reason"]
            }
        }
    ]
