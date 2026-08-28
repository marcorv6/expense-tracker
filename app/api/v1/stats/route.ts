import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const incomeRows = await query<{ total: string }>(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE user_id = $1 AND type = 'income'`,
      [user.userId]
    );

    const expenseRows = await query<{ total: string }>(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE user_id = $1 AND type = 'expense'`,
      [user.userId]
    );

    const pendingRows = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM transactions WHERE user_id = $1 AND status = 'pending'`,
      [user.userId]
    );

    const monthlyIncome = parseFloat(incomeRows[0]?.total || '0');
    const monthlyExpenses = parseFloat(expenseRows[0]?.total || '0');
    const netSavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (netSavings / monthlyIncome) * 100 : 0;
    const pendingTransactionsCount = parseInt(pendingRows[0]?.count || '0', 10);

    const categoryRows = await query<{ categoryId: string; name: string; color: string; type: 'expense' | 'income'; monthlyBudget: string; total: string }>(
      `SELECT c.id AS "categoryId", c.name, c.color, c.type, c.monthly_budget AS "monthlyBudget",
              COALESCE(SUM(t.amount), 0) AS total
       FROM categories c
       LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = c.user_id
       WHERE c.user_id = $1 AND c.type = 'expense'
       GROUP BY c.id
       ORDER BY total DESC`,
      [user.userId]
    );

    const categoryBreakdown = categoryRows.map((cat) => {
      const tot = parseFloat(cat.total || '0');
      const pct = monthlyExpenses > 0 ? (tot / monthlyExpenses) * 100 : 0;
      return {
        ...cat,
        total: tot,
        monthlyBudget: parseFloat(cat.monthlyBudget || '0'),
        percentage: Number(pct.toFixed(1)),
      };
    });

    return NextResponse.json({
      totalBalance: 15000.00 + netSavings,
      monthlyIncome,
      monthlyExpenses,
      netSavings,
      savingsRate: Number(savingsRate.toFixed(1)),
      pendingTransactionsCount,
      categoryBreakdown,
      monthlyTrends: [
        { month: 'Apr', income: 6200, expense: 2800 },
        { month: 'May', income: 7100, expense: 3100 },
        { month: 'Jun', income: 6800, expense: 2950 },
        { month: 'Jul', income: 7400, expense: 3050 },
        { month: 'Aug', income: monthlyIncome, expense: monthlyExpenses },
      ],
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch financial stats' }, { status: 500 });
  }
}
