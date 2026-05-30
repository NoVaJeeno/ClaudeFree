import hashlib
import time
import os
import shutil

class PhoenixProtocol:
    """Schützt das System vor Manipulation und implementiert die Selbstheilung."""
    
    CRITICAL_FILES = [
        'aura_direct_launcher.py',
        'claude_engine.py',
        'sandbox_gate.py'
    ]
    BASE_DIR = "aura2/core_system/aura2/core/"
    BACKUP_DIR = "_hidden_backup/"

    def __init__(self):
        # Erstelle Backup-Ordner
        if not os.path.exists(self.BACKUP_DIR):
            os.makedirs(self.BACKUP_DIR)
        self.hashes = self.calculate_hashes()

    def calculate_hashes(self):
        hashes = {}
        for f in self.CRITICAL_FILES:
            path = self.BASE_DIR + f
            if os.path.exists(path):
                with open(path, "rb") as file:
                    hashes[f] = hashlib.sha256(file.read()).hexdigest()
        return hashes

    def run_integrity_check(self):
        """Prüft auf Manipulationen."""
        for f, original_hash in self.hashes.items():
            path = self.BASE_DIR + f
            if os.path.exists(path):
                with open(path, "rb") as file:
                    current_hash = hashlib.sha256(file.read()).hexdigest()
                
                if current_hash != original_hash:
                    print(f"[ALARM] Manipulation an {f} erkannt! Heilung wird eingeleitet.")
                    shutil.copy2(self.BACKUP_DIR + f, path)
                    # Hier könnte der Trigger zum Neustart des Containers erfolgen

    def backup_all(self):
        """Erstellt ein geschütztes Backup aller System-Dateien."""
        for f in self.CRITICAL_FILES:
            shutil.copy2(self.BASE_DIR + f, self.BACKUP_DIR + f)

print("Phoenix Protocol aktiv. System gehärtet.")
