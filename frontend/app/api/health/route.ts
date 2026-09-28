import { NextResponse } from 'next/server';
import { getProviderConfigs } from '../../../lib/provider-router';

export const runtime = 'nodejs';

export async function GET() {
  const providers = getProviderConfigs();
  return NextResponse.json({
    status: providers.length ? 'configured' : 'unconfigured',
    providers: providers.map(({ name, model }) => ({ name, model })),
    secretsExposedToBrowser: false,
    note: providers.some((provider) => provider.name === 'ollama')
      ? 'Ollama ist als API-Key-freier Provider konfiguriert; der Modellserver muss erreichbar sein.'
      : 'Für API-Key-freien Betrieb OLLAMA_BASE_URL setzen und den OSS-Container starten.',
  });
}
