// aura_controller.js - Verbindet die UI direkt mit AetherCore
class AuraController {
    async sendPromptToClaude(promptText) {
        console.log("Sende Prompt an Claude-Root-Kernel:", promptText);
        const response = await fetch('http://127.0.0.1:49471/agent/execute', {
            method: 'POST',
            body: JSON.stringify({
                instruction: promptText,
                security_token: "MASTER_SECRET_PHOENIX"
            }),
            headers: {'Content-Type': 'application/json'}
        });
        return await response.json();
    }
}
export const auraController = new AuraController();
