import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';
import { sanitizeString } from '@/lib/security/sanitize';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const rows = await query(
      `SELECT t.id, t.user_id AS "userId", t.category_id AS "categoryId",
              c.name AS "categoryName", c.color AS "categoryColor", c.icon AS "categoryIcon",
              t.type, t.amount, t.currency, t.date, t.description, t.notes,
              t.payment_method AS "paymentMethod", t.status, t.created_at AS "createdAt", t.updated_at AS "updatedAt"
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [id, user.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch transaction' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { categoryId, type, amount, currency, date, description, notes, paymentMethod, status } = body;

    const rows = await query(
      `UPDATE transactions
       SET category_id = $1, type = $2, amount = $3, currency = $4, date = $5,
           description = $6, notes = $7, payment_method = $8, status = $9, updated_at = NOW()
       WHERE id = $10 AND user_id = $11
       RETURNING id, user_id AS "userId", category_id AS "categoryId", type, amount, currency, date, description, notes, payment_method AS "paymentMethod", status, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [
        categoryId,
        type,
        amount,
        currency || 'USD',
        date,
        sanitizeString(description),
        notes ? sanitizeString(notes) : null,
        paymentMethod || 'credit_card',
        status || 'cleared',
        id,
        user.userId,
      ]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const rows = await query('DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id', [id, user.userId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to delete transaction' }, { status: 500 });
  }
}
