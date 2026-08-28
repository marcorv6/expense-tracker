import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth/jwt';
import bcrypt from 'bcryptjs';
import { isValidEmail, sanitizeString } from '@/lib/security/sanitize';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, currency } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = sanitizeString(name);

    // Check if email is registered
    const existing = await query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUsers = await query(
      `INSERT INTO users (email, password_hash, name, currency_preference)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, currency_preference AS currency, created_at`,
      [cleanEmail, passwordHash, cleanName, currency || 'USD']
    );

    const newUser = newUsers[0] as { id: string; email: string };

    // Seed default starter categories for new user
    const defaultCategories = [
      { name: 'General', type: 'expense', color: '#64748b', icon: 'tag', monthly_budget: 0 },
      { name: 'Housing & Rent', type: 'expense', color: '#6366f1', icon: 'home', monthly_budget: 2200 },
      { name: 'Food & Groceries', type: 'expense', color: '#10b981', icon: 'shopping-cart', monthly_budget: 800 },
      { name: 'Dining Out', type: 'expense', color: '#f59e0b', icon: 'utensils', monthly_budget: 400 },
      { name: 'Utilities & Internet', type: 'expense', color: '#06b6d4', icon: 'zap', monthly_budget: 300 },
      { name: 'Tech & Subscriptions', type: 'expense', color: '#8b5cf6', icon: 'laptop', monthly_budget: 250 },
      { name: 'Transportation', type: 'expense', color: '#ec4899', icon: 'car', monthly_budget: 350 },
      { name: 'Salary & Earnings', type: 'income', color: '#22c55e', icon: 'briefcase', monthly_budget: 0 },
      { name: 'Freelance Work', type: 'income', color: '#14b8a6', icon: 'code', monthly_budget: 0 },
    ];

    for (const cat of defaultCategories) {
      await query(
        `INSERT INTO categories (user_id, name, type, color, icon, monthly_budget)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newUser.id, cat.name, cat.type, cat.color, cat.icon, cat.monthly_budget]
      );
    }

    const token = signToken({ userId: newUser.id, email: newUser.email });

    return NextResponse.json({ user: newUser, token }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Registration failed' }, { status: 500 });
  }
}
