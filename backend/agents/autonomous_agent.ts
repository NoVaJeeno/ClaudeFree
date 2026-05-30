import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export class AutonomousAgent {
  private logs: string[] = [];

  constructor() {
    this.logs.push('AutonomousAgent initialisiert');
  }

  async runCommand(cmd: string): Promise<{ success: boolean; output: string; error?: string }> {
    try {
      if (!cmd || typeof cmd !== 'string') {
        throw new Error('Ungültiges Command-Format');
      }

      console.log(`[Agent] Command ausgeführt: ${cmd}`);
      this.logs.push(`[${new Date().toISOString()}] CMD: ${cmd}`);

      // Echte Command-Ausführung
      const { stdout, stderr } = await execAsync(cmd);
      
      return {
        success: true,
        output: stdout || stderr || 'Befehl ausgeführt (kein Output)',
      };
    } catch (error: any) {
      const errorMsg = error.message || 'Ausführungsfehler';
      console.error(`[Agent] Fehler bei Command: ${errorMsg}`);
      return {
        success: false,
        output: '',
        error: errorMsg,
      };
    }
  }

  async syncWithGitHub(message: string): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      if (!message || typeof message !== 'string') {
        throw new Error('Ungültige Nachricht');
      }

      console.log(`[Agent] GitHub Sync: ${message}`);
      this.logs.push(`[${new Date().toISOString()}] GITHUB_SYNC: ${message}`);

      // Echte Git-Operationen
      await execAsync('git add .');
      await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`);
      await execAsync('git push origin main');

      return {
        success: true,
        message: `GitHub synchronisiert: "${message}"`,
      };
    } catch (error: any) {
      const errorMsg = error.message || 'GitHub Sync Fehler';
      return {
        success: false,
        message: '',
        error: errorMsg,
      };
    }
  }

  getLogs(): string[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}
