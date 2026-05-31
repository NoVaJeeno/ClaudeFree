import json
import os
# Hier wird das Rork SDK geladen
from rork import ClaudeClient 

class PhoenixAgent:
    def __init__(self, db_path='./agents_db.json'):
        self.db_path = db_path
        # Initialisierung mit API Key aus Umgebungsvariablen
        self.client = ClaudeClient(api_key=os.getenv("ANTHROPIC_API_KEY"))

    def fetch_pending_tasks(self):
        if not os.path.exists(self.db_path):
            return []
        try:
            with open(self.db_path, 'r') as f:
                return json.load(f)
        except:
            return []

    def execute_task(self, task):
        print(f"[PHOENIX] AI Task: {task.get('task')}")
        # Aufruf über Rork SDK
        response = self.client.generate(prompt=task.get('task'))
        print(f"[PHOENIX] Agent Response: {response}")
        return response

if __name__ == "__main__":
    phoenix = PhoenixAgent()
    tasks = phoenix.fetch_pending_tasks()
    for task in tasks:
        phoenix.execute_task(task)
