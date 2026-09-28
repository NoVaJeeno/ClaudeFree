import { NextRequest, NextResponse } from 'next/server';
import { createWorkPlan, runAgentTurns } from '../../../../lib/agent-orchestration';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = typeof body?.task === 'string' ? body.task.trim() : '';
    const requestedLines = Number.isFinite(Number(body?.requestedLines)) ? Number(body.requestedLines) : 0;
    if (!task || task.length > 20000) return NextResponse.json({ error: 'Task fehlt oder ist zu lang.', code: 'INVALID_TASK' }, { status: 400 });
    const blocks = createWorkPlan(task, requestedLines);
    if (body?.planOnly === true) return NextResponse.json({ status: 'planned', lead: 'quantum', blocks, blockLineLimit: 800 });
    const turns = await runAgentTurns(task, blocks);
    return NextResponse.json({ status: 'review_required', lead: 'quantum', synchronousOrder: ['quantum', 'forge', 'sentinel'], blocks, turns, note: 'Code- und Dateischreibaktionen werden erst nach sicheren Tool-Gates ausgeführt.' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Orchestration failed', code: 'ORCHESTRATION_FAILED' }, { status: 502 });
  }
}
