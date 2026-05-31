#!/bin/bash
# Installiere Frontend
cd frontend && npm install && npm run build
# Kopiere das Ergebnis in den Backend-Ordner
mkdir -p ../backend/out
cp -r out/* ../backend/out/
# Installiere Backend
cd ../backend && npm install
