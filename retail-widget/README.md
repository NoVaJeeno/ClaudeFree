# AURA Retail Widget — JP Aring Advisory

## Ihre API-Keys

| Key | Name | Limit/Tag |
|-----|------|----------|
| `Z2xegf3fWgZ9kXFWq-1FRnwEA_IBzsjHw4UVoiJiGl0` | Website-Key | 200 |
| `vtooBub_5LQh5O9yI7bt-gr6SGP_Jk3J5HDVuvLqXfA` | Admin-Key | 1000 |
| `CHN2YG8c0W1bm80SNYwzeL8njG_0bFcWVCgExkFGfLw` | Reserve-Key | 200 |

## API-Endpunkte

- `GET /health` — Status prüfen
- `GET /api/v1/status` — Key-Status & Nutzung
- `POST /api/v1/analyze` — Retail-Analyse anfordern
- `GET /api/v1/topics` — Verfügbare Themen

## Einbindung Website

```html
<script src="aura-retail-widget.js"></script>
<script>
  AuraRetail.init({
    apiKey: 'Z2xegf3fWgZ9kXFWq-1FRnwEA_IBzsjHw4UVoiJiGl0',
    apiUrl: 'https://api.jp-aring-advisory.de/api/v1/analyze'
  });
</script>
```

## Server starten (Mac)
```bash
# Automatisch via LaunchAgent (startet bei Login)
# Manuell:
M=/Users/jeenopauloaring/Aura_Electron2
$M/brain/core/venv311/bin/python3 $M/aura2/core_system/aura2/core/retail_api_server.py
```

## Datenschutz
- Keine Nutzerinhalte werden dauerhaft gespeichert
- Nur API-Key-Hash und Zeitstempel werden geloggt
- Server läuft lokal auf Ihrem Mac (DSGVO-konform)
- Hinweis in Datenschutzerklärung: "KI-gestützte Analyse durch lokales Sprachmodell"
