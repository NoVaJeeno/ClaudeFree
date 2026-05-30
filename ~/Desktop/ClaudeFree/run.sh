#!/bin/bash
echo "Starte ClaudeFree System..."

# Backend starten
cd backend && npm install && npx ts-node index.ts &
BACKEND_PID=$!

# Frontend starten
cd ../frontend && npm install && npm run dev &
FRONTEND_PID=$!

echo "System läuft."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
