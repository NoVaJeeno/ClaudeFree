import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';

export class SecurityKernel {
    private readonly vaultPath = path.join(process.cwd(), 'data_vault', 'secrets');
    private readonly integrityManifest = path.join(process.cwd(), 'backend', 'manifest.hash');

    // Dead Man Switch: Löscht den Vault, wenn kein Token-Reset erfolgt
    async deadManSwitchTrigger() {
        console.warn("SCHUTZ-MODUS: Dead Man Switch aktiviert. Vernichte sensible Daten...");
        if (fs.existsSync(this.vaultPath)) {
            fs.rmSync(this.vaultPath, { recursive: true, force: true });
        }
    }

    // Integritäts-Check: Prüft ob der Code verändert wurde
    async verifySystemIntegrity(): Promise<boolean> {
        const currentHash = this.generateDirHash(path.join(process.cwd(), 'backend'));
        const savedHash = fs.existsSync(this.integrityManifest) ? fs.readFileSync(this.integrityManifest, 'utf-8') : '';
        
        if (currentHash !== savedHash && savedHash !== '') {
            console.error("SICHERHEITSWARNUNG: Manipulation erkannt!");
            return false;
        }
        return true;
    }

    private generateDirHash(dir: string): string {
        // Erstellt einen kryptografischen Fingerabdruck deines Codes
        const files = fs.readdirSync(dir).sort();
        const hash = crypto.createHash('sha256');
        for (const file of files) {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isFile()) {
                hash.update(fs.readFileSync(filePath));
            }
        }
        return hash.digest('hex');
    }
}
