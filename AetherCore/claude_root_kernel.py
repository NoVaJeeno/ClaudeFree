import os
from .api import AetherAPI
from .offline_isolation import OfflineIsolation

class ClaudeRootKernel:
    """Verbindet Claude direkt mit dem Aether-System als Root-Entwickler."""
    
    def __init__(self, claude_api_key):
        self.api_key = claude_api_key
        self.api = AetherAPI
        self.isolation = OfflineIsolation()
        
    def send_root_command(self, command):
        """Sendet einen Befehl an Claude und erzwingt die Ausführung."""
        # Claude agiert hier mit Root-Rechten im System
        return self.api.execute_instruction(command)

    def force_local_mode(self):
        """Kappt alle Verbindungen zu Claude und wechselt zur lokalen Autonomie."""
        self.isolation.engage_offline_mode()

# Root-Agent initialisieren
root_kernel = ClaudeRootKernel(os.getenv("CLAUDE_API_KEY"))
print("Claude-Root-Kernel: Vollständig integriert. Claude ist nun System-Administrator.")
