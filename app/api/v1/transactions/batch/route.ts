import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { ids, action } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No transaction IDs provided' }, { status: 400 });
    }

    if (action === 'delete') {
      await query('DELETE FROM transactions WHERE id = ANY($1::uuid[]) AND user_id = $2', [ids, user.userId]);
    } else if (action === 'mark_cleared') {
      await query("UPDATE transactions SET status = 'cleared', updated_at = NOW() WHERE id = ANY($1::uuid[]) AND user_id = $2", [
        ids,
        user.userId,
      ]);
    } else if (action === 'mark_pending') {
      await query("UPDATE transactions SET status = 'pending', updated_at = NOW() WHERE id = ANY($1::uuid[]) AND user_id = $2", [
        ids,
        user.userId,
      ]);
    } else {
      return NextResponse.json({ error: 'Invalid batch action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, affectedCount: ids.length });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Batch operation failed' }, { status: 500 });
  }
}
