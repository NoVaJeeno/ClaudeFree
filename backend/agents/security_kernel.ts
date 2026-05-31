import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';

export class SecurityKernel {
    private readonly vaultPath = path.join(process.cwd(), 'data_vault', 'secrets');
    private readonly integrityManifest = path.join(process.cwd(), 'backend', 'manifest.hash');

    // Sicherer API-Sync: Generiert Manifest vom iPhone aus
    async syncManifest(): Promise<string> {
        try {
            const hash = this.generateDirHash(path.join(process.cwd(), 'backend'));
            fs.writeFileSync(this.integrityManifest, hash);
            return hash;
        } catch (error) {
            console.error("Fehler bei Manifest Sync:", error);
            throw error;
        }
    }

    async deadManSwitchTrigger() {
        console.warn("SCHUTZ-MODUS: Dead Man Switch aktiviert.");
        try {
            if (fs.existsSync(this.vaultPath)) {
                fs.rmSync(this.vaultPath, { recursive: true, force: true });
            }
        } catch (error) {
            console.error("Fehler beim Dead Man Switch:", error);
        }
    }

    async verifySystemIntegrity(): Promise<boolean> {
        try {
            const currentHash = this.generateDirHash(path.join(process.cwd(), 'backend'));
            const savedHash = fs.existsSync(this.integrityManifest) ? fs.readFileSync(this.integrityManifest, 'utf-8') : '';
            
            if (currentHash !== savedHash && savedHash !== '') {
                return false;
            }
            return true;
        } catch (error) {
            console.error("Fehler bei Integritätsprüfung:", error);
            return false;
        }
    }

    private generateDirHash(dir: string): string {
        const files = fs.readdirSync(dir).sort();
        const hash = crypto.createHash('sha256');
        for (const file of files) {
            const filePath = path.join(dir, file);
            // Sicherheits-Prüfung: Nur Dateien hashen, bei Verzeichnissen Fehlertoleranz
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                hash.update(fs.readFileSync(filePath));
            }
        }
        return hash.digest('hex');
    }
}
