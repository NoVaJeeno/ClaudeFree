import { NextRequest, NextResponse } from 'next/server';
import { getProviderConfigs, isCloudflare, providerHeaders } from '../../../lib/provider-router';

export const runtime = 'nodejs';

const MAX_MESSAGES = 40;
const MAX_CONTENT = 12000;

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

function isMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return ['user', 'assistant', 'system'].includes(String(item.role)) && typeof item.content === 'string';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages.filter(isMessage) : [];
    if (!messages.length || messages.length > MAX_MESSAGES || messages.some((m) => m.content.length > MAX_CONTENT)) {
      return NextResponse.json({ error: 'Ungültige Nachrichten. Bitte kürze den Verlauf oder die Nachricht.' }, { status: 400 });
    }

    const providers = getProviderConfigs();
    if (!providers.length) {
      return NextResponse.json({
        error: 'Kein KI-Provider konfiguriert. Für API-Key-freien Betrieb starte Ollama im OSS-Container und setze OLLAMA_BASE_URL; Cloud-Provider benötigen ihre serverseitigen Zugangsdaten. Kein Schlüssel wird im Browser gespeichert.',
        code: 'AI_PROVIDER_NOT_CONFIGURED',
      }, { status: 503 });
    }

    const requestMessages = [{ role: 'system', content: 'Du bist Quantum, ein souveräner Senior-Experten-Agent für ClaudeFree. Antworte auf Deutsch, präzise und transparent. Behaupte niemals, ein Tool, Connector oder Zugriff ausgeführt zu haben, wenn kein echtes Ergebnis vorliegt. Externe Schreibaktionen benötigen eine sichere Integration.' }, ...messages];
    const failures: string[] = [];
    for (const provider of providers) {
      try {
        const response = await fetch(isCloudflare(provider) ? provider.baseUrl : `${provider.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: providerHeaders(provider),
          body: JSON.stringify(isCloudflare(provider) ? { messages: requestMessages, max_tokens: 1200 } : { model: provider.model, temperature: 0.25, messages: requestMessages }),
          signal: AbortSignal.timeout(30000),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) { failures.push(`${provider.name}: HTTP ${response.status}`); continue; }
        const content = isCloudflare(provider) ? data?.result?.response : data?.choices?.[0]?.message?.content;
        if (typeof content === 'string' && content.trim()) return NextResponse.json({ message: { role: 'assistant', content }, provider: provider.name, model: provider.model });
        failures.push(`${provider.name}: leere Antwort`);
      } catch (error) { failures.push(`${provider.name}: ${error instanceof Error ? error.message : 'Verbindungsfehler'}`); }
    }
    return NextResponse.json({ error: `Alle konfigurierten KI-Provider sind fehlgeschlagen: ${failures.join('; ')}`, code: 'AI_ALL_PROVIDERS_FAILED' }, { status: 502 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Serverfehler.';
    return NextResponse.json({ error: `Chat konnte nicht verarbeitet werden: ${message}`, code: 'CHAT_REQUEST_FAILED' }, { status: 500 });
  }
}
