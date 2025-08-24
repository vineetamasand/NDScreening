--  docker run -d --name strange_bohr -e "POSTGRES_PASSWORD=nd-123" -e "POSTGRES_USER=postgres" -e "POSTGRES_DB=nd_screening" -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16

-- Create the database (run in a superuser / existing DB)
CREATE DATABASE nd_screening;

-- Connect to it (psql)
\c nd_screening

-- Optional but useful for name search later:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =========================
-- Enum types
-- =========================
CREATE TYPE role_type            AS ENUM ('SCREENER_LEVEL_1','SENIOR_SCREENER','HOD','HI','READ_ONLY','DATA_ENTRY');
CREATE TYPE category_type        AS ENUM ('MALE','FEMALE','COUPLE');
CREATE TYPE marital_type         AS ENUM ('SINGLE','MARRIED','DIVORCED','WIDOWED');
CREATE TYPE stage_type           AS ENUM ('SL1','SENIOR','HOD','FINAL','HI');
CREATE TYPE perq_decision_type   AS ENUM ('OK','NOT_OK');
-- decision can be NULL when undecided; only APPROVE | WAIT values allowed
CREATE TYPE final_decision_type  AS ENUM ('APPROVE','WAIT');
CREATE TYPE age_verif_type       AS ENUM ('OK','VERIFIED');
CREATE TYPE dob_doc_type         AS ENUM ('AADHAR','PASSPORT','BIRTH_CERTIFICATE');

-- =========================
-- Users / Roles
-- =========================
CREATE TABLE roles (
  id    SERIAL PRIMARY KEY,
  code  role_type UNIQUE NOT NULL
);

CREATE TABLE users (
  id             BIGSERIAL PRIMARY KEY,
  screener_code  TEXT UNIQUE NOT NULL,     -- e.g., SS001
  password_hash  TEXT NOT NULL,            -- store a hash (bcrypt/argon2), not plaintext
  display_name   TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id  INT    NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  PRIMARY KEY (user_id, role_id)
);

-- =========================
-- Sessions (per your spec)
-- =========================
CREATE TABLE sessions (
  session_id        BIGSERIAL PRIMARY KEY,
  initiation_date   DATE,
  initiation_place  TEXT
);

-- =========================
-- Applicant (consolidated)
-- =========================
CREATE TABLE applicant (
  applicant_id     BIGSERIAL PRIMARY KEY,
  session_id       BIGINT REFERENCES sessions(session_id) ON DELETE SET NULL,

  screening_token  TEXT UNIQUE NOT NULL,        -- Token#
  category         category_type NOT NULL,      -- MALE/FEMALE/COUPLE

  -- Person/profile fields
  name             TEXT NOT NULL,
  father_name      TEXT,
  age_years        INT,
  marital_status   marital_type,
  occupation       TEXT,

  -- Geo/contact
  country          TEXT,
  state            TEXT,
  area             TEXT,
  phone            TEXT,
  uid              TEXT,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes
CREATE INDEX idx_applicant_token ON applicant (screening_token);

-- =========================
-- Question bank
-- =========================
CREATE TABLE questions (
  id          BIGSERIAL PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,     -- e.g., 'A/I','BS',...
  label_en    TEXT NOT NULL,
  label_hi    TEXT NOT NULL,
  sort_order  INT NOT NULL
);

CREATE TABLE question_options (
  id           BIGSERIAL PRIMARY KEY,
  question_id  BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  value_code   TEXT NOT NULL,           -- e.g., 'YES','NO','LT_3','GT_3',...
  label_en     TEXT NOT NULL,
  label_hi     TEXT NOT NULL,
  sort_order   INT NOT NULL,
  UNIQUE (question_id, value_code)
);

-- =========================
-- Answers per applicant/question
-- =========================
CREATE TABLE answers (
  id                BIGSERIAL PRIMARY KEY,
  applicant_id      BIGINT NOT NULL REFERENCES applicant(applicant_id) ON DELETE CASCADE,
  question_id       BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_id         BIGINT     REFERENCES question_options(id) ON DELETE SET NULL,
  answer_text       TEXT,                 -- cached resolved text (defensive)
  comment_text      TEXT,
  perq_decision     perq_decision_type,   -- OK / NOT_OK
  summary_override  perq_decision_type,   -- OK / NOT_OK / NULL
  answered_by       BIGINT REFERENCES users(id),
  answered_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (applicant_id, question_id)
);

CREATE INDEX idx_answers_app_q ON answers (applicant_id, question_id);

-- =========================
-- Final decisions (per stage)
-- =========================
CREATE TABLE final_decisions (
  id                BIGSERIAL PRIMARY KEY,
  applicant_id      BIGINT NOT NULL REFERENCES applicant(applicant_id) ON DELETE CASCADE,
  stage             stage_type NOT NULL,          -- SL1 / SENIOR / HOD / FINAL / HI
  decision          final_decision_type,          -- APPROVE / WAIT / NULL (undecided)
  reason_text       TEXT,
  age_verified      age_verif_type,
  dob_document      dob_doc_type,
  additional_notes  TEXT,
  decided_by        BIGINT REFERENCES users(id),
  decided_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_final_app_stage ON final_decisions (applicant_id, stage);

-- =========================
-- Status history (audit)
-- =========================
CREATE TABLE status_history (
  id             BIGSERIAL PRIMARY KEY,
  applicant_id   BIGINT NOT NULL REFERENCES applicant(applicant_id) ON DELETE CASCADE,
  from_stage     stage_type,
  to_stage       stage_type,
  status         final_decision_type,    -- APPROVE / WAIT / NULL
  changed_by     BIGINT REFERENCES users(id),
  changed_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
