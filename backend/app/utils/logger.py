import json
from datetime import datetime
from typing import Any, Dict

def log_agent_step(step_type: str, details: Dict[str, Any]):
    """Logs structured ReAct reasoning and tool execution steps to stdout for debugging and evaluation."""
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "step_type": step_type,
        "details": details
    }
    try:
        print(f"[AGENT_LOG] {json.dumps(log_entry, default=str)}")
    except Exception:
        print(f"[AGENT_LOG] {step_type}: {details}")
