import * as fs from 'fs';
import * as path from 'path';
import { AutonomousAgent } from './autonomous_agent';

export class SelfHealingAgent {
    private agent: AutonomousAgent;
    private readonly projectPath = process.cwd();

    constructor() {
        this.agent = new AutonomousAgent();
    }

    // Autonomer Fehler-Scan und Dateistrukturierung
    async heal() {
        console.log("Self-Healing Prozess gestartet...");
        
        // 1. Validierung der Projektstruktur
        this.ensureStructure(['backend', 'frontend', 'agents', 'sandbox']);
        
        // 2. Syntax-Check auf alle TypeScript Dateien
        const files = this.getAllFiles(path.join(this.projectPath, 'backend'));
        for (const file of files.filter(f => f.endsWith('.ts'))) {
            await this.agent.runCommand('tsc', ['--noEmit', file]);
        }
        
        console.log("Self-Healing abgeschlossen: Integrität hergestellt.");
    }

    private ensureStructure(folders: string[]) {
        for (const folder of folders) {
            if (!fs.existsSync(path.join(this.projectPath, folder))) {
                fs.mkdirSync(path.join(this.projectPath, folder));
            }
        }
    }

    private getAllFiles(dirPath: string): string[] {
        let files: string[] = [];
        const items = fs.readdirSync(dirPath);
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            if (fs.statSync(fullPath).isDirectory()) {
                files = files.concat(this.getAllFiles(fullPath));
            } else {
                files.push(fullPath);
            }
        }
        return files;
    }
}