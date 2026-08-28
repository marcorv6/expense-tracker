/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL environment variable is missing.');
    console.error('Please set DATABASE_URL in .env.local or your environment variables.');
    process.exit(1);
  }

  console.log('🚀 Connecting to Neon PostgreSQL database...');

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to Neon database successfully.');

    const schemaPath = path.resolve(process.cwd(), 'database/schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Error: schema.sql not found at ${schemaPath}`);
      process.exit(1);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Running database/schema.sql migrations...');

    await client.query(schemaSql);
    console.log('🎉 Database schema migration completed successfully!');
    console.log('Tables created: users, categories, transactions, tags, transaction_tags');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
