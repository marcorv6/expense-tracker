import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth/jwt';
import bcrypt from 'bcryptjs';
import { isValidEmail } from '@/lib/security/sanitize';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, isDemo } = body;

    // Recruiter Demo Guest mode sign-in
    if (isDemo) {
      const demoUser = {
        id: 'demo-user-123',
        email: 'recruiter@demo.com',
        name: 'Alex Vance (Demo Guest)',
        currency: 'USD',
        createdAt: new Date().toISOString(),
      };
      const token = signToken({ userId: demoUser.id, email: demoUser.email });
      return NextResponse.json({ user: demoUser, token });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Query DB for user
    const users = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const userRow = users[0] as { id: string; email: string; password_hash: string; name: string; currency_preference?: string; avatar_url?: string; created_at: string };
    const passwordMatch = await bcrypt.compare(password, userRow.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      currency: userRow.currency_preference || 'USD',
      avatarUrl: userRow.avatar_url,
      createdAt: userRow.created_at,
    };

    const token = signToken({ userId: user.id, email: user.email });

    return NextResponse.json({ user, token });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Authentication failed' }, { status: 500 });
  }
}
