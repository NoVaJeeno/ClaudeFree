# ClaudeFree Quantum Workspace

Die ClaudeFree-Fusion ist ein Next.js-Workspace mit deutschem Agenten-Chat, drei Agentenrollen, lokalem Memory Ledger, einer 30er Connector-Registry und einer 100+ Tool-Registry.

## Lokal starten

```bash
npm install
cp .env.example .env.local
# OPENAI_API_KEY nur in .env.local oder als Server-Environment setzen
npm run dev
```

Ohne erreichbaren Provider liefert `/api/chat` bewusst eine klare Konfigurationsmeldung und niemals eine simulierte KI-Antwort. Für echten API-key-freien Betrieb liegt im Projektstamm `docker-compose.oss.yml`: Dieser startet Ollama mit persistentem Modell-Volume und lädt `qwen3-coder:30b`. Das Modell benötigt je nach Quantisierung erhebliche RAM-/VRAM-Ressourcen; der Container gehört auf einen dauerhaft erreichbaren Rechner oder Cloud-Server, nicht in eine kleine Vercel-Funktion.

```bash
# Im Repository-Stamm, auf einem Host mit Docker und genügend Arbeitsspeicher
docker compose -f docker-compose.oss.yml up -d
# Danach für den ClaudeFree-Server setzen:
OLLAMA_BASE_URL=http://<ollama-host>:11434
OLLAMA_MODEL=qwen3-coder:30b
```

## Vercel

Das Frontend-Verzeichnis als Vercel-Projekt verwenden. Wenn das Repository-Stammverzeichnis als Vercel-Projekt verwendet wird, übernimmt die Root-Datei `../vercel.json` automatisch Installations- und Build-Pfade. Die App darf nicht als statischer Export konfiguriert werden, weil `/api/chat` und `/api/health` dynamische Server-Routen sind. Vercel liefert die Oberfläche und diese API-Routen aus; der Modellserver läuft separat. Für Cloud-Fallbacks können serverseitig `CLOUDFLARE_*`, `GROQ_API_KEY`, `OPENROUTER_API_KEY` oder `HF_TOKEN` gesetzt werden. Diese Anbieter haben kostenlose Kontingente, benötigen aber Konten/Tokens und sind nicht unbegrenzt kostenlos. Der Schlüssel wird ausschließlich serverseitig verwendet und nie an den Client ausgeliefert. `/api/health` zeigt nur Provider-Namen und Modelle, niemals Secrets.

Die Registry-Einträge sind keine erfundenen Verbindungszustände: Connectoren zeigen `SETUP REQUIRED`, bis ein echter OAuth-/API-Connector serverseitig konfiguriert ist. Dasselbe gilt für Tools, deren Ausführung noch keinen sicheren Backend-Handler besitzt.

## Fusion-Grundsätze

- keine hartcodierten Zugangsdaten;
- keine unkontrollierte Shell-Ausführung aus Chattext;
- klare Fehler bei fehlender Provider-Konfiguration;
- lokale Memory-Daten bleiben im Browserprofil, bis ein echter Persistenz-Connector eingerichtet ist;
- externe Schreibaktionen benötigen eine echte Integration und explizite Nutzeraktion.

## Multi-Agenten-Orchestrierung und Code-Pipeline

`POST /api/agents/orchestrate` erstellt einen echten synchronen Arbeitsplan. Quantum ist der Lead, Forge bearbeitet abhängige Implementierungsblöcke und Sentinel ist das abschließende Qualitäts-Gate. Bei `requestedLines: 10000` wird der Auftrag in begrenzte 800-Zeilen-Blöcke zerlegt; jeder Block trägt Abhängigkeiten und Abnahmekriterien. Mit `planOnly: true` kann der Plan ohne Modellaufruf geprüft werden. Ohne `planOnly` werden die drei Agenten nacheinander über den konfigurierten serverseitigen Provider aufgerufen.

`POST /api/tools` stellt nur allowlistete Kernhandler bereit: Dateien auflisten/lesen/schreiben, Suche, Git-Status/Diff sowie feste Lint-/Build-Befehle. `writeFile` ist standardmäßig deaktiviert (`ENABLE_WORKSPACE_WRITES=false`), ebenso Build-/Lint-Ausführung (`ENABLE_CODE_EXECUTION=false`). Pfade außerhalb von `WORKSPACE_ROOT`, `.git`, `node_modules`, `.next` und `.env` werden blockiert. Es gibt keine freie Shell aus Chattext.

`GET /api/connectors/github` ist ein echter serverseitiger Read-Connector und benötigt `GITHUB_TOKEN`; ohne Token wird kein verbundener Zustand behauptet. Weitere Connectoren müssen nach demselben Muster mit Scope-, Timeout- und Audit-Gates ergänzt werden.
