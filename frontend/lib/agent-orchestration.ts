import { getProviderConfigs, isCloudflare, providerHeaders, type ProviderConfig } from './provider-router';

export type AgentId = 'quantum' | 'forge' | 'sentinel';
export type WorkBlock = { id: string; title: string; owner: AgentId; dependsOn: string[]; maxLines: number; acceptance: string[] };
export type AgentTurn = { agent: AgentId; content: string; provider: string; model: string };

export const AGENT_PROFILES: Record<AgentId, { name: string; mission: string; strengths: string[] }> = {
  quantum: { name: 'Quantum', mission: 'Lead Architect und Orchestrator', strengths: ['requirements', 'architecture', 'dependency graph', 'delegation', 'release gate'] },
  forge: { name: 'Forge', mission: 'Principal Software Engineer', strengths: ['implementation', 'tests', 'refactoring', 'build repair', 'modular code generation'] },
  sentinel: { name: 'Sentinel', mission: 'Security, Reliability und Quality Gate', strengths: ['threat modeling', 'secret scan', 'dependency review', 'lint/build review', 'regression analysis'] },
};

const BLOCK_LINE_LIMIT = 800;

export function createWorkPlan(task: string, requestedLines = 0): WorkBlock[] {
  const target = Math.max(1, Math.min(requestedLines || 1, 100000));
  const blocks: WorkBlock[] = [
    { id: 'architecture', title: `Requirements and architecture: ${task.slice(0, 120)}`, owner: 'quantum', dependsOn: [], maxLines: 0, acceptance: ['scope is explicit', 'dependencies are acyclic', 'security boundaries are documented'] },
  ];
  let previous = 'architecture';
  const implementationCount = Math.max(1, Math.ceil(target / BLOCK_LINE_LIMIT));
  for (let i = 1; i <= implementationCount; i += 1) {
    const id = `implementation-${String(i).padStart(3, '0')}`;
    blocks.push({ id, title: `Modular implementation block ${i}/${implementationCount}`, owner: 'forge', dependsOn: [previous], maxLines: BLOCK_LINE_LIMIT, acceptance: ['compiles in isolation', 'imports only declared modules', 'has focused tests', 'no secrets or unsafe paths'] });
    previous = id;
  }
  blocks.push({ id: 'quality-gate', title: 'Security, lint, typecheck, test and build gate', owner: 'sentinel', dependsOn: [previous], maxLines: 0, acceptance: ['lint passes', 'typecheck passes', 'tests pass', 'security scan passes', 'final diff is reviewable'] });
  return blocks;
}

function rolePrompt(agent: AgentId, task: string, blocks: WorkBlock[]): string {
  const profile = AGENT_PROFILES[agent];
  return `You are ${profile.name}, ${profile.mission}. Strengths: ${profile.strengths.join(', ')}.\nTask: ${task}\nWork plan: ${JSON.stringify(blocks)}\nNever claim a tool result you did not receive. Return structured, concise decisions and blockers. Keep code modular and never output more than the block limit.`;
}

async function callProvider(provider: ProviderConfig, messages: { role: string; content: string }[]) {
  const response = await fetch(isCloudflare(provider) ? provider.baseUrl : `${provider.baseUrl}/chat/completions`, {
    method: 'POST', headers: providerHeaders(provider), signal: AbortSignal.timeout(30000),
    body: JSON.stringify(isCloudflare(provider) ? { messages, max_tokens: 1600 } : { model: provider.model, temperature: 0.15, messages }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${provider.name} HTTP ${response.status}`);
  const content = isCloudflare(provider) ? data?.result?.response : data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) throw new Error(`${provider.name} returned no text`);
  return { content, provider: provider.name, model: provider.model };
}

export async function runAgentTurns(task: string, blocks: WorkBlock[]): Promise<AgentTurn[]> {
  const providers = getProviderConfigs();
  if (!providers.length) throw new Error('No configured AI provider. Configure Ollama or a server-side cloud provider.');
  const turns: AgentTurn[] = [];
  let context = '';
  for (const agent of ['quantum', 'forge', 'sentinel'] as AgentId[]) {
    const response = await callProvider(providers[0], [{ role: 'system', content: rolePrompt(agent, task, blocks) }, { role: 'user', content: `Previous agent context:\n${context || '(none)'}\nProduce your stage result for the next agent.` }]);
    turns.push({ agent, ...response });
    context = response.content.slice(-12000);
  }
  return turns;
}
