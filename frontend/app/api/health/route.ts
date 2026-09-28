import { NextResponse } from 'next/server';
import { getProviderConfigs } from '../../../lib/provider-router';
import { AGENT_PROFILES } from '../../../lib/agent-orchestration';

export const runtime = 'nodejs';

export async function GET() {
  const providers = getProviderConfigs();
  return NextResponse.json({
    status: providers.length ? 'configured' : 'unconfigured',
    providers: providers.map(({ name, model }) => ({ name, model })),
    agents: Object.entries(AGENT_PROFILES).map(([id, profile]) => ({ id, name: profile.name, mission: profile.mission })),
    orchestration: { lead: 'quantum', sequence: ['quantum', 'forge', 'sentinel'], synchronous: true, blockLineLimit: 800 },
    tools: { allowlistedCoreHandlers: ['listFiles', 'readFile', 'writeFile', 'grep', 'gitStatus', 'gitDiff', 'runLint', 'runBuild'], codeExecutionEnabled: process.env.ENABLE_CODE_EXECUTION === 'true', workspaceWritesEnabled: process.env.ENABLE_WORKSPACE_WRITES === 'true' },
    connectors: { githubReadHandler: Boolean(process.env.GITHUB_TOKEN) },
    secretsExposedToBrowser: false,
    note: providers.some((provider) => provider.name === 'ollama')
      ? 'Ollama ist als API-Key-freier Provider konfiguriert; der Modellserver muss erreichbar sein.'
      : 'Für API-Key-freien Betrieb OLLAMA_BASE_URL setzen und den OSS-Container starten.',
  });
}
