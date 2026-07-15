from abc import ABC, abstractmethod
from typing import Any, Dict
from pydantic import BaseModel

class BaseTool(ABC):
    """Abstract base class for all deterministic backend tools called by the AgentCoordinator."""
    name: str
    description: str
    args_schema: type[BaseModel]

    @abstractmethod
    def execute(self, arguments: Dict[str, Any], db: Any = None) -> Dict[str, Any]:
        """Execute the tool with validated arguments and return structured observation dictionary."""
        pass
