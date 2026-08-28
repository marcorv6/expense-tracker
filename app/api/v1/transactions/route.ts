import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';
import { sanitizeString } from '@/lib/security/sanitize';

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'ASC' : 'DESC';

    let sql = `
      SELECT t.id, t.user_id AS "userId", t.category_id AS "categoryId",
             c.name AS "categoryName", c.color AS "categoryColor", c.icon AS "categoryIcon",
             t.type, t.amount, t.currency, t.date, t.description, t.notes,
             t.payment_method AS "paymentMethod", t.status, t.created_at AS "createdAt", t.updated_at AS "updatedAt"
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;
    const params: unknown[] = [user.userId];

    if (type && type !== 'all') {
      params.push(type);
      sql += ` AND t.type = $${params.length}`;
    }

    if (categoryId) {
      params.push(categoryId);
      sql += ` AND t.category_id = $${params.length}`;
    }

    if (status) {
      params.push(status);
      sql += ` AND t.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND (LOWER(t.description) LIKE $${params.length} OR LOWER(t.notes) LIKE $${params.length})`;
    }

    if (sortBy === 'amount') {
      sql += ` ORDER BY t.amount ${sortOrder}`;
    } else if (sortBy === 'description') {
      sql += ` ORDER BY t.description ${sortOrder}`;
    } else {
      sql += ` ORDER BY t.date ${sortOrder}`;
    }

    const rows = await query(sql, params);
    return NextResponse.json({ data: rows, total: rows.length });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { categoryId, type, amount, currency, date, description, notes, paymentMethod, status } = body;

    if (!type || !amount || !description || !categoryId) {
      return NextResponse.json({ error: 'Type, amount, category, and description are required' }, { status: 400 });
    }

    const rows = await query(
      `INSERT INTO transactions (user_id, category_id, type, amount, currency, date, description, notes, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, user_id AS "userId", category_id AS "categoryId", type, amount, currency, date, description, notes, payment_method AS "paymentMethod", status, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [
        user.userId,
        categoryId,
        type,
        amount,
        currency || 'USD',
        date || new Date().toISOString(),
        sanitizeString(description),
        notes ? sanitizeString(notes) : null,
        paymentMethod || 'credit_card',
        status || 'cleared',
      ]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to create transaction' }, { status: 500 });
  }
}
