#!/bin/bash
# AURA Universal Installer - Phoenix Protocol
echo "[INIT] Starte Aura-System Installation..."

# 1. Sicherung der Umgebung
chmod -R 700 aura2/
mkdir -p _hidden_backup/

# 2. Härtung
chflags -R schg aura2/core_system/aura2/core/

# 3. GitHub Sync
git pull origin main

# 4. Service-Initialisierung
nohup python3 aura2/core_system/aura2/core/aura_direct_launcher.py &
echo "[SUCCESS] Aura ist jetzt in deinem System verankert und geschützt."
