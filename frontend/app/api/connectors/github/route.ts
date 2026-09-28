import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
const apiBase = 'https://api.github.com';

function headers() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not configured on the server.');
  return { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' };
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const owner = url.searchParams.get('owner');
    const repo = url.searchParams.get('repo');
    const filePath = url.searchParams.get('path');
    if (!owner || !repo || !filePath || !/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) return NextResponse.json({ error: 'owner, repo and path are required.', code: 'INVALID_GITHUB_REQUEST' }, { status: 400 });
    const response = await fetch(`${apiBase}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${filePath.split('/').map(encodeURIComponent).join('/')}`, { headers: headers(), signal: AbortSignal.timeout(20000) });
    const data = await response.json().catch(() => null);
    if (!response.ok) return NextResponse.json({ error: data?.message || `GitHub HTTP ${response.status}`, code: 'GITHUB_ERROR' }, { status: 502 });
    return NextResponse.json({ connector: 'github', owner, repo, path: filePath, type: data?.type, sha: data?.sha, contentBase64: data?.content || null });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'GitHub connector failed', code: 'GITHUB_CONNECTOR_FAILED' }, { status: 502 }); }
}
