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

export async function query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]> {
  if (!pool) {
    throw new Error('DATABASE_URL is missing. Operating in offline client mode.');
  }
  const client = await pool.connect();
  try {
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
  return await pool.connect();
}

export default pool;
