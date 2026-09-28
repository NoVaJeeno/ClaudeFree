import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
const execFileAsync = promisify(execFile);
const workspaceRoot = path.resolve(process.env.WORKSPACE_ROOT || process.cwd());
const allowedActions = new Set(['listFiles', 'readFile', 'writeFile', 'grep', 'gitStatus', 'gitDiff', 'runLint', 'runBuild']);

function safePath(input: unknown) {
  if (typeof input !== 'string' || input.includes('\0')) throw new Error('Invalid path');
  const resolved = path.resolve(workspaceRoot, input);
  if (resolved !== workspaceRoot && !resolved.startsWith(`${workspaceRoot}${path.sep}`)) throw new Error('Path escapes workspace');
  return resolved;
}

function assertWritable(file: string) {
  const relative = path.relative(workspaceRoot, file);
  if (/(^|[\\/])(?:\.git|node_modules|\.next)(?:[\\/]|$)/.test(relative) || /(^|[\\/])\.env(?:\.|$)/.test(relative)) throw new Error('Protected path');
  if (file === workspaceRoot) throw new Error('A file path is required');
}

async function walk(dir: string, results: string[], depth = 0): Promise<void> {
  if (depth > 6 || results.length >= 500) return;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', 'dist'].includes(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    const relative = path.relative(workspaceRoot, absolute);
    if (entry.isDirectory()) await walk(absolute, results, depth + 1); else results.push(relative);
  }
}

async function fixedCommand(command: string, args: string[]) {
  if (process.env.ENABLE_CODE_EXECUTION !== 'true') throw new Error('Code execution is disabled; set ENABLE_CODE_EXECUTION=true on the server after sandbox review.');
  const result = await execFileAsync(command, args, { cwd: workspaceRoot, timeout: 120000, maxBuffer: 2_000_000 });
  return { stdout: result.stdout.slice(-100000), stderr: result.stderr.slice(-100000) };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = typeof body?.action === 'string' ? body.action : '';
    if (!allowedActions.has(action)) return NextResponse.json({ error: 'Tool is not allowlisted', code: 'TOOL_NOT_ALLOWED' }, { status: 403 });
    if (action === 'listFiles') { const files: string[] = []; await walk(workspaceRoot, files); return NextResponse.json({ action, files }); }
    if (action === 'readFile') { const file = safePath(body.path); const stat = await fs.stat(file); if (!stat.isFile() || stat.size > 1_000_000) throw new Error('File missing or too large'); return NextResponse.json({ action, path: path.relative(workspaceRoot, file), content: await fs.readFile(file, 'utf8') }); }
    if (action === 'writeFile') { if (process.env.ENABLE_WORKSPACE_WRITES !== 'true') throw new Error('Workspace writes are disabled; set ENABLE_WORKSPACE_WRITES=true after review.'); const file = safePath(body.path); assertWritable(file); if (typeof body.content !== 'string' || body.content.length > 2_000_000) throw new Error('Content missing or too large'); await fs.mkdir(path.dirname(file), { recursive: true }); const temp = `${file}.tmp-${process.pid}`; await fs.writeFile(temp, body.content, { encoding: 'utf8', mode: 0o600 }); await fs.rename(temp, file); return NextResponse.json({ action, path: path.relative(workspaceRoot, file), bytes: Buffer.byteLength(body.content) }); }
    if (action === 'grep') { const query = typeof body.query === 'string' ? body.query : ''; if (!query || query.length > 200) throw new Error('Invalid query'); const files: string[] = []; await walk(workspaceRoot, files); const matches: { file: string; line: number; text: string }[] = []; for (const relative of files) { if (matches.length >= 500) break; try { const lines = (await fs.readFile(path.join(workspaceRoot, relative), 'utf8')).split('\n'); lines.forEach((text, line) => { if (matches.length < 500 && text.includes(query)) matches.push({ file: relative, line: line + 1, text: text.slice(0, 500) }); }); } catch { /* binary/unreadable file */ } } return NextResponse.json({ action, matches }); }
    if (action === 'gitStatus') return NextResponse.json({ action, ...(await fixedCommand('git', ['status', '--short'])) });
    if (action === 'gitDiff') return NextResponse.json({ action, ...(await fixedCommand('git', ['diff', '--', '.'])) });
    if (action === 'runLint') return NextResponse.json({ action, ...(await fixedCommand('npm', ['run', 'lint'])) });
    return NextResponse.json({ action, ...(await fixedCommand('npm', ['run', 'build'])) });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Tool failed', code: 'TOOL_FAILED' }, { status: 400 }); }
}
