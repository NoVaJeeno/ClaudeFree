import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
const execAsync = promisify(exec);

export class AutonomousAgent {
  private logs: string[] = [];

  constructor() {
    this.logs.push(`[${new Date().toISOString()}] AutonomousAgent v1.1.0 gestartet`);
  }

  async runCommand(cmd: string): Promise<{ success: boolean; output: string; error?: string }> {
    try {
      if (!cmd || typeof cmd !== 'string') throw new Error('Ungültiger Command');
      
      this.logs.push(`[${new Date().toISOString()}] CMD: ${cmd}`);
      const { stdout, stderr } = await execAsync(cmd);
      
      return { success: true, output: stdout || stderr || 'Erfolg' };
    } catch (error: any) {
      const errorMsg = error.message || 'Ausführungsfehler';
      this.logs.push(`[${new Date().toISOString()}] FEHLER: ${errorMsg}`);
      return { success: false, output: '', error: errorMsg };
    }
  }

  async syncWithGitHub(message: string): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      if (!message) throw new Error('Commit Message fehlt');
      
      console.log(`[Agent] GitHub Sync: ${message}`);
      await execAsync('git add .');
      await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`);
      await execAsync('git push origin main');

      return { success: true, message: 'GitHub synchronisiert' };
    } catch (error: any) {
      return { success: false, message: '', error: error.message };
    }
  }
}
