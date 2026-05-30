import os
from aura_direct_launcher import AuraBridge

class AiderBridge:
    def __init__(self, project_path):
        self.project_path = project_path
        
    def run_development(self, task):
        # Aider wird in der Sandbox deiner Anwendung gestartet
        cmd = f"python3 -m aider --model openai/claude-3-7-sonnet-20250219 --message '{task}'"
        os.system(f"cd {self.project_path} && {cmd}")

print("Aider Bridge v1.0 bereit.")
