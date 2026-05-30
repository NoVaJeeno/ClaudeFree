import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config'; // Lädt Umgebungsvariablen

export class AutonomousAgent {
    constructor() {
        console.log("Agent Kern initialisiert. Bereit für lokale Befehle.");
    }

    // Führt Terminal Befehle sicher aus
    async runCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Fehler: ${error.message}`);
                    return;
                }
                resolve(stdout || stderr);
            });
        });
    }

    // Schreibt Dateien direkt ins Filesystem
    async saveTaskFile(filename: string, content: string): Promise<void> {
        const filePath = path.join(process.cwd(), '..', 'agents', filename);
        fs.writeFileSync(filePath, content);
    }

    // Git Befehle mit Zugangsdaten aus Environment
    async syncWithGitHub(message: string): Promise<string> {
        const user = process.env.GITHUB_USER;
        const token = process.env.GITHUB_TOKEN;
        const gitUrl = `https://${user}:${token}@github.com/${user}/ClaudeFree.git`;
        
        try {
            await this.runCommand(`git remote set-url origin ${gitUrl}`);
            await this.runCommand('git add .');
            await this.runCommand(`git commit -m "${message}"`);
            await this.runCommand('git push origin main');
            return "Erfolgreich auf GitHub gepusht.";
        } catch (e) {
            return `Git Sync Fehler: ${e}`;
        }
    }
}
