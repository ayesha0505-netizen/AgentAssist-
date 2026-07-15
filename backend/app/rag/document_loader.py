import os
from typing import List, Dict, Any

class DocumentLoader:
    """Loads Markdown or Text files from the knowledge base folder and extracts metadata."""
    
    def __init__(self, directory_path: str):
        self.directory_path = directory_path

    def load_documents(self) -> List[Dict[str, Any]]:
        documents = []
        if not os.path.exists(self.directory_path):
            os.makedirs(self.directory_path, exist_ok=True)
            return documents

        for filename in os.listdir(self.directory_path):
            if filename.endswith(".md") or filename.endswith(".txt"):
                filepath = os.path.join(self.directory_path, filename)
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    title = filename
                    lines = content.strip().split("\n")
                    for line in lines:
                        if line.startswith("# "):
                            title = line[2:].strip()
                            break

                    documents.append({
                        "content": content,
                        "metadata": {
                            "source": filename,
                            "title": title,
                            "filepath": filepath
                        }
                    })
                except Exception as e:
                    print(f"Error loading document {filename}: {e}")
        return documents
