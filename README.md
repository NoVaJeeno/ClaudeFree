# ClaudeFree Backend

Dies ist das sichere Backend für das ClaudeFree Projekt.

## Sicherheitsanforderungen & Installation

### 1. API Absicherung
Alle Endpoints sind durch einen API-Key geschützt.
- Setze in deiner `.env` Datei:
  `API_KEY=dein_sehr_sicherer_key`

### 2. Whitelist-Architektur
Der `AutonomousAgent` erlaubt nur spezifische Befehle:
- `git`
- `tsc`
- `npm`

Um Befehle über `/api/exec` auszuführen, sende einen JSON-Body:
```json
{
  "command": "git",
  "args": ["status"]
}
```

### 3. Installation
```bash
cd backend
npm install
npm start
```

### 4. Security Status
- Integritäts-Checks sind für alle Backend-Dateien aktiv.
- Docker-Ausführungen sind shell-injection-sicher.
- API-Schutz ist obligatorisch.
