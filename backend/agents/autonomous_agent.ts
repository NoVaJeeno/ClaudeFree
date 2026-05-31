import { execFile } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
import crypto from 'crypto';

export class AutonomousAgent {
    private readonly vaultPath = path.join(process.cwd(), 'data_vault', 'secrets');
    
    // Command Whitelist
    private readonly ALLOWED_COMMANDS: Record<string, string> = {
        'git': '/usr/bin/git',
        'tsc': '/usr/local/bin/tsc',
        'npm': '/usr/local/bin/npm'
    };

    constructor() {
        if (!fs.existsSync(this.vaultPath)) {
            fs.mkdirSync(this.vaultPath, { recursive: true });
        }
    }

    async runCommand(command: string, args: string[]): Promise<string> {
        if (!this.ALLOWED_COMMANDS[command]) {
            throw new Error("Command not allowed");
        }

        return new Promise((resolve, reject) => {
            // ExecFile verhindert Shell-Injection
            execFile(this.ALLOWED_COMMANDS[command], args, { cwd: process.cwd() }, (error, stdout, stderr) => {
                if (error) {
                    reject(stderr || error.message);
                    return;
                }
                resolve(stdout);
            });
        });
    }
}
