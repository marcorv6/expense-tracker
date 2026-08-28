import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';

interface TransactionRow {
  id: string;
  date: string;
  type: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
}

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    const rows = await query<TransactionRow>(
      `SELECT t.id, t.date, t.type, t.description, c.name AS category, t.amount, t.currency, t.payment_method, t.status
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1
       ORDER BY t.date DESC`,
      [user.userId]
    );

    if (format === 'json') {
      return new NextResponse(JSON.stringify(rows, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename=spendflow-export-${new Date().toISOString().slice(0, 10)}.json`,
        },
      });
    }

    const headers = ['ID', 'Date', 'Type', 'Description', 'Category', 'Amount', 'Currency', 'Payment Method', 'Status'];
    const csvRows = rows.map((t) => [
      t.id,
      t.date,
      t.type,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.amount,
      t.currency,
      t.payment_method,
      t.status,
    ]);
    const csvString = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvString, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=spendflow-export-${new Date().toISOString().slice(0, 10)}.csv`,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Export failed' }, { status: 500 });
  }
}
