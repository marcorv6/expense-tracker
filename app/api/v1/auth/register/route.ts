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

    const newUser = newUsers[0];
    const token = signToken({ userId: (newUser as { id: string; email: string }).id, email: (newUser as { id: string; email: string }).email });

    return NextResponse.json({ user: newUser, token }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Registration failed' }, { status: 500 });
  }
}
