import json
import traceback
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.config.settings import settings
from app.agent.prompts import SYSTEM_PROMPT, get_tool_declarations
from app.agent.memory import MemoryManager
from app.rag.vector_store import get_vector_store
from app.tools.order_tool import CheckOrderTool
from app.tools.ticket_tool import CreateTicketTool
from app.tools.product_tool import ProductSearchTool
from app.tools.booking_tool import BookAppointmentTool
from app.utils.logger import log_agent_step

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


class AgentCoordinator:
    """Manages the ReAct reasoning loop, RAG retrieval, and deterministic tool dispatching."""

    def __init__(self, db: Session):
        self.db = db
        self.memory = MemoryManager(db)
        self.vector_store = get_vector_store()
        self.tools_map = {
            "CheckOrderTool": CheckOrderTool(),
            "CreateTicketTool": CreateTicketTool(),
            "ProductSearchTool": ProductSearchTool(),
            "BookAppointmentTool": BookAppointmentTool()
        }
        self.client = None
        if GENAI_AVAILABLE and settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def _execute_tool(self, tool_name: str, arguments: Dict[str, Any], user_id: Optional[int]) -> Dict[str, Any]:
        log_agent_step("TOOL_EXECUTION_START", {"tool_name": tool_name, "arguments": arguments})
        tool = self.tools_map.get(tool_name)
        if not tool:
            res = {"error": f"Tool '{tool_name}' is not registered."}
            log_agent_step("TOOL_EXECUTION_ERROR", res)
            return res

        # Auto-inject user_id if tool accepts it and not provided
        if tool_name == "CreateTicketTool" and not arguments.get("user_id") and user_id:
            arguments["user_id"] = user_id

        result = tool.execute(arguments, db=self.db)
        log_agent_step("TOOL_EXECUTION_SUCCESS", {"tool_name": tool_name, "result": result})
        return result

    def _should_query_rag(self, message: str) -> bool:
        keywords = [
            "policy", "refund", "return", "shipping", "delivery time", "warranty", "guarantee",
            "hours", "contact", "phone", "email", "faq", "question", "who are you", "what is your",
            "money back", "exchange", "restock", "fee", "broken", "damage", "replace", "cost", "support"
        ]
        lower_msg = message.lower()
        return any(kw in lower_msg for kw in keywords)

    def process_chat(self, message: str, user_id: Optional[int] = None) -> Dict[str, Any]:
        log_agent_step("USER_INPUT", {"user_id": user_id, "message": message})
        
        # 1. Extract context and history
        history = self.memory.get_sliding_window_history(user_id=user_id, window_size=6)
        entities = self.memory.extract_entity_context(user_id=user_id, latest_message=message)
        
        # 2. Check if RAG context is needed or beneficial
        rag_context = ""
        if self._should_query_rag(message) or "why" in message.lower() or "how" in message.lower():
            log_agent_step("RAG_QUERY_START", {"query": message})
            retrieved = self.vector_store.similarity_search(message, k=3, threshold=0.68)
            if retrieved:
                snippets = []
                for idx, doc in enumerate(retrieved):
                    snippets.append(f"[Document {idx+1} - {doc['metadata'].get('title', 'Policy')}]:\n{doc['content']}")
                rag_context = "\n\n".join(snippets)
                log_agent_step("RAG_QUERY_SUCCESS", {"retrieved_chunks": len(retrieved)})
            else:
                log_agent_step("RAG_QUERY_EMPTY", {"message": "No high-confidence snippets found."})

        # 3. Construct System Prompt & Instructions
        context_prompt = f"{SYSTEM_PROMPT}\n\n### Current User Context:\n"
        context_prompt += f"- Customer Name: {entities.get('customer_name')}\n"
        if entities.get("active_order_ids"):
            context_prompt += f"- Known/Mentioned Order IDs: {', '.join(entities.get('active_order_ids'))}\n"
        if entities.get("last_ticket_id"):
            context_prompt += f"- Last Known Ticket ID: {entities.get('last_ticket_id')}\n"
        
        if rag_context:
            context_prompt += f"\n### Retrieved Knowledge Base (RAG) Snippets:\n{rag_context}\n"

        # Check if Gemini API is configured and available
        if not GENAI_AVAILABLE or not self.client:
            log_agent_step("LLM_FALLBACK_MODE", {"reason": "No GEMINI_API_KEY configured or google-genai missing."})
            return self._fallback_local_processing(message, user_id, entities, rag_context)

        # 4. ReAct Loop using Gemini Function Calling
        tools_executed = []
        try:
            # Build conversation turns compatible with genai SDK
            contents = []
            for item in history:
                contents.append(
                    types.Content(
                        role="user" if item["role"] == "user" else "model",
                        parts=[types.Part.from_text(text=item["content"])]
                    )
                )
            # Add latest user message
            contents.append(types.Content(role="user", parts=[types.Part.from_text(text=message)]))

            # Configure tool declarations
            tool_objs = []
            for decl in get_tool_declarations():
                tool_objs.append(types.FunctionDeclaration(
                    name=decl["name"],
                    description=decl["description"],
                    parameters=types.Schema(
                        type=types.Type.OBJECT,
                        properties={
                            k: types.Schema(type=types.Type.STRING if v["type"] == "STRING" else types.Type.INTEGER, description=v["description"])
                            for k, v in decl["parameters"]["properties"].items()
                        },
                        required=decl["parameters"]["required"]
                    )
                ))
            
            config = types.GenerateContentConfig(
                system_instruction=context_prompt,
                temperature=0.3,
                tools=[types.Tool(function_declarations=tool_objs)]
            )

            # Max reasoning turns = 4 to avoid infinite loops
            for step in range(4):
                log_agent_step("LLM_GENERATE_START", {"step": step + 1})
                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=contents,
                    config=config
                )

                if not response.candidates or not response.candidates[0].content.parts:
                    break

                part = response.candidates[0].content.parts[0]
                
                # Check if model requested a function call
                if part.function_call:
                    func_call = part.function_call
                    tool_name = func_call.name
                    args = dict(func_call.args) if func_call.args else {}
                    
                    log_agent_step("LLM_TOOL_CALL_REQUEST", {"tool_name": tool_name, "arguments": args})
                    
                    # Execute requested tool
                    tool_res = self._execute_tool(tool_name, args, user_id)
                    tools_executed.append({
                        "tool_name": tool_name,
                        "arguments": args,
                        "result": tool_res
                    })

                    # Append model's function call turn and observation to contents
                    contents.append(response.candidates[0].content)
                    contents.append(
                        types.Content(
                            role="user",
                            parts=[types.Part.from_function_response(
                                name=tool_name,
                                response={"result": tool_res}
                            )]
                        )
                    )
                else:
                    # Model produced text answer directly
                    final_text = part.text
                    log_agent_step("LLM_FINAL_ANSWER", {"response": final_text})
                    
                    # Persist turn into database
                    self.memory.save_turn(
                        user_id=user_id,
                        message=message,
                        response=final_text,
                        tools_called=json.dumps(tools_executed)
                    )
                    return {
                        "response": final_text,
                        "tools_used": tools_executed
                    }

            # If loop exited without final text, synthesize fallback
            fallback_resp = "I have checked the requested information using our internal tools and documented your request. How else may I assist you today?"
            self.memory.save_turn(user_id=user_id, message=message, response=fallback_resp, tools_called=json.dumps(tools_executed))
            return {"response": fallback_resp, "tools_used": tools_executed}

        except Exception as e:
            log_agent_step("LLM_REASONING_EXCEPTION", {"error": str(e), "trace": traceback.format_exc()})
            return self._fallback_local_processing(message, user_id, entities, rag_context, tools_executed, error_msg=str(e))

    def _fallback_local_processing(self, message: str, user_id: Optional[int], entities: Dict[str, Any], rag_context: str, tools_executed: List[Dict[str, Any]] = None, error_msg: str = None) -> Dict[str, Any]:
        """Provides robust fallback tool execution and policy answers if Gemini API is unconfigured or unavailable."""
        if tools_executed is None:
            tools_executed = []
        
        lower_msg = message.lower()
        response_lines = []
        
        if error_msg:
            response_lines.append(f"*Note: Running in local Agentic Fallback Mode (`{error_msg.split(':')[0]}`).*")

        # Check for order lookup directly
        order_id_matches = [w for w in message.upper().replace("#", "").split() if w.startswith("ORD") and len(w) >= 4]
        if not order_id_matches and entities.get("active_order_ids") and ("where" in lower_msg or "status" in lower_msg or "order" in lower_msg):
            order_id_matches = entities.get("active_order_ids")

        if order_id_matches:
            for oid in order_id_matches:
                res = self._execute_tool("CheckOrderTool", {"order_id": oid}, user_id)
                tools_executed.append({"tool_name": "CheckOrderTool", "arguments": {"order_id": oid}, "result": res})
                if res.get("found"):
                    response_lines.append(f"### Order Status for `#{res['order_id']}`:\n- **Customer**: {res['customer_name']}\n- **Current Status**: **`{res['status']}`**\n- **Expected Delivery**: {res['expected_delivery']}")
                    if res['status'] == 'DELAYED':
                        # Check if customer asked to open ticket on delay
                        if "ticket" in lower_msg or "complaint" in lower_msg or "issue" in lower_msg:
                            t_res = self._execute_tool("CreateTicketTool", {"issue": f"Order {oid} is DELAYED.", "user_id": user_id}, user_id)
                            tools_executed.append({"tool_name": "CreateTicketTool", "arguments": {"issue": f"Order {oid} is DELAYED."}, "result": t_res})
                            response_lines.append(f"\n> [!NOTE]\n> Since your order is delayed, I have proactively opened support ticket **`#{t_res['ticket_id']}`** to expedite resolution.")

        # Check for ticket creation request
        elif "ticket" in lower_msg or "complaint" in lower_msg or "broken" in lower_msg or "damaged" in lower_msg:
            issue_desc = message
            t_res = self._execute_tool("CreateTicketTool", {"issue": issue_desc, "user_id": user_id}, user_id)
            tools_executed.append({"tool_name": "CreateTicketTool", "arguments": {"issue": issue_desc}, "result": t_res})
            response_lines.append(f"I have created a support ticket to address this issue right away.\n\n### Ticket Confirmation:\n- **Ticket ID**: **`{t_res['ticket_id']}`**\n- **Status**: `{t_res['status']}`\n- **Issue Logged**: *{t_res['issue']}*")

        # Check for product search
        elif "search" in lower_msg or "product" in lower_msg or "laptop" in lower_msg or "price" in lower_msg:
            query_word = message.split()[-1] if len(message.split()) > 1 else "Laptop"
            p_res = self._execute_tool("ProductSearchTool", {"query": query_word}, user_id)
            tools_executed.append({"tool_name": "ProductSearchTool", "arguments": {"query": query_word}, "result": p_res})
            if p_res.get("found"):
                response_lines.append(f"### Product Search Results for '{query_word}':")
                for prod in p_res["products"]:
                    response_lines.append(f"- **{prod['name']}** — `${prod['price']:.2f}` ({prod['stock']} in stock)\n  *{prod['description']}*")
            else:
                response_lines.append(f"I searched our catalog for '{query_word}' but found no matching items.")

        # Check for RAG context
        elif rag_context:
            response_lines.append("### Retrieved Policy Information:")
            response_lines.append(rag_context.strip())

        if not response_lines:
            response_lines.append(f"Hello {entities.get('customer_name', 'there')}! I am AgentAssist AI. You can ask me to check your order status (`#ORD1005`), search products, create support tickets, or answer questions about our shipping and return policies!")

        final_text = "\n\n".join(response_lines)
        self.memory.save_turn(user_id=user_id, message=message, response=final_text, tools_called=json.dumps(tools_executed))
        return {"response": final_text, "tools_used": tools_executed}
