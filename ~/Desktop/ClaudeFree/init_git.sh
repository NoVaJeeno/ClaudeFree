#!/bin/bash
echo "Initialisiere Git für NovaJeeno..."

cd ~/Desktop/ClaudeFree

# Git Konfiguration
git init
git config user.name "NoVaJeeno"
git config user.email "NoVaJeeno@users.noreply.github.com"
git remote add origin https://github.com/NoVaJeeno/ClaudeFree.git
git add .
git commit -m "Initialer Import durch Agent"
git branch -M main
git push -u origin main

echo "System läuft."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
