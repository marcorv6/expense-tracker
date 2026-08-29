import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided for import' }, { status: 400 });
    }

    // Get user categories
    const categories = (await query(
      `SELECT id, name, type FROM categories WHERE user_id = $1 OR user_id IS NULL`,
      [authUser.userId]
    )) as Array<{ id: string; name: string; type: string }>;

    let importedCount = 0;
    const now = new Date();

    for (const item of items) {
      const { date, amount, description, categoryName, type, paymentMethod, notes } = item;

      if (!date || !amount || !description) continue;

      // Find matching category or fallback to General
      let catId = categories.find(
        (c: { id: string; name: string; type: string }) =>
          c.name.toLowerCase() === (categoryName || '').toLowerCase() && c.type === (type || 'expense')
      )?.id;

      if (!catId) {
        const generalCat = categories.find((c) => c.name.toLowerCase() === 'general');
        catId = generalCat ? generalCat.id : categories[0]?.id;
      }

      // Auto pending assignment for future dates
      const txDate = new Date(date + 'T00:00:00');
      const isFuture = txDate.getTime() > now.getTime();
      const status = isFuture ? 'pending' : 'cleared';

      await query(
        `INSERT INTO transactions (user_id, category_id, type, amount, description, date, payment_method, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          authUser.userId,
          catId || null,
          type || 'expense',
          amount,
          description.trim(),
          date,
          paymentMethod || 'credit_card',
          status,
          notes || '',
        ]
      );
      importedCount++;
    }

    return NextResponse.json({
      success: true,
      importedCount,
      totalReceived: items.length,
    });
  } catch (err: unknown) {
    console.error('POST Import API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error during batch import' }, { status: 500 });
  }
}
