import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';

if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    try {
      process.loadEnvFile(envPath);
    } catch {
      // Fallback
    }
  }
}

const connectionString = process.env.DATABASE_URL;

// PostgreSQL connection pool instance for Neon serverless
const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
    })
  : null;

let isSchemaInitialized = false;

const INIT_SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    currency_preference VARCHAR(10) NOT NULL DEFAULT 'USD',
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income')),
    color VARCHAR(30) NOT NULL DEFAULT '#3b82f6',
    icon VARCHAR(50) DEFAULT 'wallet',
    monthly_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_category_name UNIQUE (user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income')),
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255) NOT NULL,
    notes TEXT,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'credit_card',
    status VARCHAR(20) NOT NULL DEFAULT 'cleared' CHECK (status IN ('cleared', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
`;

async function ensureSchemaInitialized(client: PoolClient) {
  if (isSchemaInitialized) return;
  try {
    await client.query(INIT_SCHEMA_SQL);
    isSchemaInitialized = true;
  } catch (err) {
    console.warn('Auto schema init warning:', (err as Error).message);
  }
}

export async function query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]> {
  if (!pool) {
    throw new Error('DATABASE_URL is missing. Operating in offline client mode.');
  }
  const client = await pool.connect();
  try {
    await ensureSchemaInitialized(client);
    const res = await client.query(text, params);
    return res.rows as T[];
  } finally {
    client.release();
  }
}

export async function getClient(): Promise<PoolClient> {
  if (!pool) {
    throw new Error('DATABASE_URL is missing. Operating in offline client mode.');
  }
  const client = await pool.connect();
  await ensureSchemaInitialized(client);
  return client;
}

export default pool;
