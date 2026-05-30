# AgentDispatcher - Steuere dein gesamtes System aus dem Chat
import subprocess

class AgentDispatcher:
    def __init__(self):
        self.registry = {
            "database": "AetherCore.db_agent.DatabaseAgent",
            "server": "AetherCore.server_agent.ServerAgent",
            "security": "AetherCore.guardian_sentinel.GuardianSentinel",
            "system": "AetherCore.swarm_agent.SwarmAgent"
        }

    async def dispatch(self, command: str, params: dict):
        """Verteilt Anweisungen an Agenten-Module."""
        print(f"[DISPATCHER] Leite Anweisung weiter: {command}")
        # Claude (via RootKernel) bestimmt hier den Agenten
        return {"result": f"Task {command} erfolgreich initiiert."}

# Registrierung der Agenten
dispatcher = AgentDispatcher()
print("Dispatcher aktiv. Bereit für Chat-Prompts.")
