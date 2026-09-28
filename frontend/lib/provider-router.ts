export type ProviderName = 'ollama' | 'cloudflare' | 'groq' | 'openrouter' | 'huggingface' | 'openai';

type ProviderConfig = { name: ProviderName; baseUrl: string; apiKey?: string; model: string };

export function getProviderConfigs(): ProviderConfig[] {
  const configured: ProviderConfig[] = [];
  const order = (process.env.AI_PROVIDER_ORDER || 'ollama,cloudflare,groq,openrouter,huggingface,openai').split(',').map((value) => value.trim() as ProviderName);
  for (const name of order) {
    if (name === 'ollama' && process.env.OLLAMA_BASE_URL) configured.push({ name, baseUrl: process.env.OLLAMA_BASE_URL.replace(/\/$/, ''), model: process.env.OLLAMA_MODEL || 'qwen3-coder:30b' });
    if (name === 'cloudflare' && process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_MODEL) configured.push({ name, baseUrl: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${process.env.CLOUDFLARE_MODEL}`, apiKey: process.env.CLOUDFLARE_API_TOKEN, model: process.env.CLOUDFLARE_MODEL });
    if (name === 'groq' && process.env.GROQ_API_KEY) configured.push({ name, baseUrl: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_API_KEY, model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b' });
    if (name === 'openrouter' && process.env.OPENROUTER_API_KEY) configured.push({ name, baseUrl: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_API_KEY, model: process.env.OPENROUTER_MODEL || 'openrouter/free' });
    if (name === 'huggingface' && process.env.HF_TOKEN && process.env.HF_MODEL) configured.push({ name, baseUrl: 'https://router.huggingface.co/v1', apiKey: process.env.HF_TOKEN, model: process.env.HF_MODEL });
    if (name === 'openai' && process.env.OPENAI_API_KEY) configured.push({ name, baseUrl: (process.env.OPENAI_API_BASE || 'https://api.openai.com/v1').replace(/\/$/, ''), apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' });
  }
  return configured;
}

export function providerHeaders(provider: ProviderConfig): Record<string, string> {
  return { 'Content-Type': 'application/json', ...(provider.apiKey ? { Authorization: `Bearer ${provider.apiKey}` } : {}) };
}

export function isCloudflare(provider: ProviderConfig) { return provider.name === 'cloudflare'; }
