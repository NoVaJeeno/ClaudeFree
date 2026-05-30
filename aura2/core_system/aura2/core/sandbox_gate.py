import os

class SandboxGate:
    """Verhindert kritische System-Angriffe trotz Claude-Autonomie."""
    
    FORBIDDEN_PATHS = ['/System', '/Library', '/bin', '/sbin']
    
    @staticmethod
    def validate_command(command):
        # Schutz gegen destruktive Befehle
        if "rm -rf /" in command:
            return False, "Fatal: Destruktiver Befehl blockiert."
        
        for path in SandboxGate.FORBIDDEN_PATHS:
            if path in command:
                return False, f"Zugriff auf Systempfad {path} verweigert."
        
        return True, "Befehl sicher."

print("Sandbox Gate aktiv. System gehärtet.")
