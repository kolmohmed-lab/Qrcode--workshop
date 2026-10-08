import { neon } from "@neondatabase/serverless";

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

export async function ensureSchema() {
  const sql = database();
  await sql`
    CREATE TABLE IF NOT EXISTS workshop_questions (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('question', 'issue')),
      subject TEXT NOT NULL,
      details TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function createSubmission(input: {
  email: string;
  category: "question" | "issue";
  subject: string;
  details: string;
}) {
  await ensureSchema();
  const sql = database();
  const rows = await sql`
    INSERT INTO workshop_questions (email, category, subject, details)
    VALUES (${input.email}, ${input.category}, ${input.subject}, ${input.details})
    RETURNING id, created_at
  `;
  return rows[0];
}

export async function listSubmissions() {
  await ensureSchema();
  const sql = database();
  return sql`
    SELECT id, email, category, subject, details, created_at
    FROM workshop_questions
    ORDER BY created_at DESC
    LIMIT 500
  `;
}
