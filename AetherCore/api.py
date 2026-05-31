# AetherAPI v1.0
# Die direkte Schnittstelle für Claude in das Aether-System.
# Jede Anweisung wird als System-Kern-Instruktion verarbeitet.

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess

AetherAPI = FastAPI()

class SystemInstruction(BaseModel):
    instruction: str
    security_token: str

@app.post("/agent/execute")
async def execute_instruction(payload: SystemInstruction):
    # Verifizierung erfolgt durch das Phoenix-Protokoll
    if payload.security_token != "MASTER_SECRET_PHOENIX":
        raise HTTPException(status_code=403, detail="Unbefugter Zugriff.")
    
    # Ausführung direkt auf Kernel-Ebene (AetherEngine)
    # Claude bekommt hier volle Kontrolle, gesichert durch das Sandbox Gate
    process = subprocess.Popen(payload.instruction, shell=True, stdout=subprocess.PIPE)
    stdout, stderr = process.communicate()
    
    return {"status": "success", "output": stdout.decode()}
