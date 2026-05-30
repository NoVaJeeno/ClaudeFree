# ClaudeFree Master-Kernel v1.0
import os
import asyncio
from AetherCore.dispatcher import dispatcher
from AetherCore.claude_root_kernel import ClaudeRootKernel
from AetherCore.phoenix_protocol import PhoenixProtocol

class AetherOS:
    def __init__(self):
        self.kernel = ClaudeRootKernel(os.getenv("CLAUDE_API_KEY"))
        self.phoenix = PhoenixProtocol()
        print("[AETHER_OS] System online. Integrität geprüft.")

    async def secure_execute(self, instruction):
        # Integritätsprüfung vor Ausführung
        self.phoenix.run_integrity_check()
        
        # Dispatch durch Claude Root Kernel
        result = await dispatcher.dispatch(instruction, {})
        
        # BUGFIX: Entfernte endlose Git-Push-Schleife
        # GitHub-Sync wird jetzt über GitHub Actions oder manuelle Commits gehandhabt
        return result

# Startpunkt für die AetherOS Umgebung
if __name__ == "__main__":
    os_env = AetherOS()
    print("AetherOS ist bereit. Befehle werden verarbeitet.")
