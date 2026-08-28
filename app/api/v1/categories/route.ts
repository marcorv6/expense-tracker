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

    const rows = await query(
      `SELECT c.id, c.user_id AS "userId", c.name, c.type, c.color, c.icon,
              c.monthly_budget AS "monthlyBudget",
              COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'expense'), 0) AS "spentThisMonth"
       FROM categories c
       LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = c.user_id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY c.name ASC`,
      [user.userId]
    );

    return NextResponse.json(rows);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, color, icon, monthlyBudget } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Category name and type are required' }, { status: 400 });
    }

    const rows = await query(
      `INSERT INTO categories (user_id, name, type, color, icon, monthly_budget)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id AS "userId", name, type, color, icon, monthly_budget AS "monthlyBudget"`,
      [
        user.userId,
        sanitizeString(name),
        type,
        color || '#3b82f6',
        icon || 'wallet',
        monthlyBudget || 0.0,
      ]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to create category' }, { status: 500 });
  }
}
