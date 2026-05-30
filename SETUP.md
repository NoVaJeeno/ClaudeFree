# ClaudeFree - Setup & Start

## 🚀 Installation

### Voraussetzungen
- Node.js 18+ installiert
- npm oder yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend läuft dann auf: `http://localhost:3000`

### Frontend Setup (in neuem Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend läuft dann auf Port 3001 (Next.js übernimmt automatisch nächsten Port)

---

## 📋 Fehlerbehebung

### Fehler: "MODULE_NOT_FOUND: AutonomousAgent"
✓ **BEHOBEN** - `backend/agents/autonomous_agent.ts` wurde erstellt

### Fehler: "Cannot find module '@hono/node-server'"
✓ **BEHOBEN** - `backend/package.json` wurde aktualisiert mit allen Dependencies

### Fehler: "next: command not found"
**Lösung:**
```bash
cd frontend
npm install
npm run dev
```

### Frontend verbindet sich nicht mit Backend
**Prüfe:**
- Backend läuft auf `http://localhost:3000`
- Frontend `.env.local` hat richtige URL
- Keine Firewall-Blöcke

---

## 📝 Verfügbare Scripts

### Backend
- `npm run start` - Production
- `npm run dev` - Entwicklung mit Auto-Reload
- `npm run build` - TypeScript kompilieren

### Frontend
- `npm run dev` - Entwicklung
- `npm run build` - Build für Production
- `npm run start` - Production starten

---

## ✅ Status nach Fix

Alle kritischen Fehler wurden behoben:
- ✓ AutonomousAgent-Klasse erstellt
- ✓ Fehlende Dependencies hinzugefügt
- ✓ TypeScript-Konfigurationen erstellt
- ✓ Frontend UI implementiert
- ✓ Socket.io-Verbindung konfiguriert
- ✓ .gitignore hinzugefügt

Die App sollte jetzt vollständig lauffähig sein!
