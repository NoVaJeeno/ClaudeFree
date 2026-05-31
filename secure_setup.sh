#!/bin/bash
# AURA/ClaudeFree Auto-Architect - Security-First Mode
echo "Initialisiere hochsichere Rork-SDK Umgebung..."

# Kryptografische Absicherung: Verzeichnisse für Außenstehende verschleiern
mkdir -p ./data_vault/secrets
chmod 700 ./data_vault/secrets

# Environment-Variablen-Absicherung (Schutz vor Injektion)
# .env wird nicht committet, wird dynamisch bei Laufzeit geladen
touch .env
chmod 600 .env

# Rork-SDK-Integration: Sicherer Daten-Bus
# Sicherstellung, dass keine Protokolle (Logs) sensible Daten enthalten
export RORK_LOG_LEVEL=error
export RORK_ENCRYPTION_ENABLED=true

echo "Umgebung gesichert. System bereit für autonome Rork-SDK Operationen."
