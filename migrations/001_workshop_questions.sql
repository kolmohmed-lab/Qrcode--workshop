CREATE TABLE IF NOT EXISTS workshop_questions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('question', 'issue')),
  subject TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS workshop_questions_created_at_idx
  ON workshop_questions (created_at DESC);
