-- Connect to the DB in psql:
-- \c nd_screening

-- 1) A demo session (adjust date/place if you like)
INSERT INTO sessions (initiation_date, initiation_place)
VALUES (CURRENT_DATE, 'Demo Camp')
RETURNING session_id
\gset

-- 2) Upsert applicant for token 216 (from your mockData)
INSERT INTO applicant (
  session_id, screening_token, category,
  name, father_name, age_years, marital_status, occupation,
  country, state, area, phone, uid
)
VALUES (
  :session_id, '216', 'MALE',
  'RAVINDER SHARMA', 'SURESH SHARMA', 26, 'MARRIED', 'Business',
  'India', 'Maharashtra', 'Jangoan', '9868123456 / 9892498765', '123456987023'
)
ON CONFLICT (screening_token) DO UPDATE SET
  session_id = EXCLUDED.session_id,
  category   = EXCLUDED.category,
  name       = EXCLUDED.name,
  father_name= EXCLUDED.father_name,
  age_years  = EXCLUDED.age_years,
  marital_status = EXCLUDED.marital_status,
  occupation = EXCLUDED.occupation,
  country    = EXCLUDED.country,
  state      = EXCLUDED.state,
  area       = EXCLUDED.area,
  phone      = EXCLUDED.phone,
  uid        = EXCLUDED.uid
RETURNING applicant_id
\gset

-- 3) Load questions (from your questions.js)
--    We use question code identical to your label (e.g., 'A/I', 'BS', ...)

-- Helper upsert function for a question
-- (psql-friendly CTEs; safe to re-run)
-- A/I
WITH up_q AS (
  INSERT INTO questions (code, label_en, label_hi, sort_order)
  VALUES ('A/I','A/I','A/I',1)
  ON CONFLICT (code) DO UPDATE
    SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order
  RETURNING id
)
INSERT INTO question_options (question_id, value_code, label_en, label_hi, sort_order)
SELECT id, v.code, v.en, v.hi, v.ord FROM up_q q
CROSS JOIN (VALUES
  ('YES','Yes','हाँ',1),
  ('NO','No','नहीं',2)
) AS v(code,en,hi,ord)
ON CONFLICT (question_id, value_code) DO UPDATE
  SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order;

-- BS
WITH up_q AS (
  INSERT INTO questions (code, label_en, label_hi, sort_order)
  VALUES ('BS','BS','BS',2)
  ON CONFLICT (code) DO UPDATE
    SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order
  RETURNING id
)
INSERT INTO question_options (question_id, value_code, label_en, label_hi, sort_order)
SELECT id, v.code, v.en, v.hi, v.ord FROM up_q q
CROSS JOIN (VALUES
  ('LT_3','Less Than 3','3 से कम',1),
  ('GT_3','Greater Than 3','3 से अधिक',2)
) AS v(code,en,hi,ord)
ON CONFLICT (question_id, value_code) DO UPDATE
  SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order;

-- LS
WITH up_q AS (
  INSERT INTO questions (code, label_en, label_hi, sort_order)
  VALUES ('LS','LS','LS',3)
  ON CONFLICT (code) DO UPDATE
    SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order
  RETURNING id
)
INSERT INTO question_options (question_id, value_code, label_en, label_hi, sort_order)
SELECT id, v.code, v.en, v.hi, v.ord FROM up_q q
CROSS JOIN (VALUES
  ('LT_12M','Less Than 12 months','12 महीने से कम',1),
  ('GT_12M','Greater Than 12 months','12 महीने से अधिक',2)
) AS v(code,en,hi,ord)
ON CONFLICT (question_id, value_code) DO UPDATE
  SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order;

-- N/V
WITH up_q AS (
  INSERT INTO questions (code, label_en, label_hi, sort_order)
  VALUES ('N/V','N/V','N/V',4)
  ON CONFLICT (code) DO UPDATE
    SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order
  RETURNING id
)
INSERT INTO question_options (question_id, value_code, label_en, label_hi, sort_order)
SELECT id, v.code, v.en, v.hi, v.ord FROM up_q q
CROSS JOIN (VALUES
  ('LT_12M','Less Than 12 months','12 महीने से कम',1),
  ('GT_12M','Greater Than 12 months','12 महीने से अधिक',2)
) AS v(code,en,hi,ord)
ON CONFLICT (question_id, value_code) DO UPDATE
  SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order;

-- A/D
WITH up_q AS (
  INSERT INTO questions (code, label_en, label_hi, sort_order)
  VALUES ('A/D','A/D','A/D',5)
  ON CONFLICT (code) DO UPDATE
    SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order
  RETURNING id
)
INSERT INTO question_options (question_id, value_code, label_en, label_hi, sort_order)
SELECT id, v.code, v.en, v.hi, v.ord FROM up_q q
CROSS JOIN (VALUES
  ('LT_12M','Less Than 12 months','12 महीने से कम',1),
  ('GT_12M','Greater Than 12 months','12 महीने से अधिक',2)
) AS v(code,en,hi,ord)
ON CONFLICT (question_id, value_code) DO UPDATE
  SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order;

-- S/T
WITH up_q AS (
  INSERT INTO questions (code, label_en, label_hi, sort_order)
  VALUES ('S/T','S/T','S/T',6)
  ON CONFLICT (code) DO UPDATE
    SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order
  RETURNING id
)
INSERT INTO question_options (question_id, value_code, label_en, label_hi, sort_order)
SELECT id, v.code, v.en, v.hi, v.ord FROM up_q q
CROSS JOIN (VALUES
  ('LT_12M','Less Than 12 months','12 महीने से कम',1),
  ('GT_12M','Greater Than 12 months','12 महीने से अधिक',2)
) AS v(code,en,hi,ord)
ON CONFLICT (question_id, value_code) DO UPDATE
  SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order;

-- B
WITH up_q AS (
  INSERT INTO questions (code, label_en, label_hi, sort_order)
  VALUES ('B','B','B',7)
  ON CONFLICT (code) DO UPDATE
    SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order
  RETURNING id
)
INSERT INTO question_options (question_id, value_code, label_en, label_hi, sort_order)
SELECT id, v.code, v.en, v.hi, v.ord FROM up_q q
CROSS JOIN (VALUES
  ('NONE','None','कोई नहीं',1),
  ('LT_2','Less than 2','2 से कम',2),
  ('GT_2','More than 2','2 से अधिक',3)
) AS v(code,en,hi,ord)
ON CONFLICT (question_id, value_code) DO UPDATE
  SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order;

-- Occ
WITH up_q AS (
  INSERT INTO questions (code, label_en, label_hi, sort_order)
  VALUES ('Occ','Occ','पेशा',8)
  ON CONFLICT (code) DO UPDATE
    SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order
  RETURNING id
)
INSERT INTO question_options (question_id, value_code, label_en, label_hi, sort_order)
SELECT id, v.code, v.en, v.hi, v.ord FROM up_q q
CROSS JOIN (VALUES
  ('BUSINESS','Business','व्यवसाय',1),
  ('MILITARY','Military','सैन्य',2),
  ('SERVICE','Service','सेवा',3),
  ('OTHER','Other','अन्य',4)
) AS v(code,en,hi,ord)
ON CONFLICT (question_id, value_code) DO UPDATE
  SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order;

-- AIM
WITH up_q AS (
  INSERT INTO questions (code, label_en, label_hi, sort_order)
  VALUES ('AIM','AIM','AIM',9)
  ON CONFLICT (code) DO UPDATE
    SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order
  RETURNING id
)
INSERT INTO question_options (question_id, value_code, label_en, label_hi, sort_order)
SELECT id, v.code, v.en, v.hi, v.ord FROM up_q q
CROSS JOIN (VALUES
  ('CLEAR','Clear','स्पष्ट',1),
  ('NOT_CLEAR','Not Clear','स्पष्ट नहीं',2)
) AS v(code,en,hi,ord)
ON CONFLICT (question_id, value_code) DO UPDATE
  SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order;

-- Desire
WITH up_q AS (
  INSERT INTO questions (code, label_en, label_hi, sort_order)
  VALUES ('Desire','Desire','आकांक्षा',10)
  ON CONFLICT (code) DO UPDATE
    SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order
  RETURNING id
)
INSERT INTO question_options (question_id, value_code, label_en, label_hi, sort_order)
SELECT id, v.code, v.en, v.hi, v.ord FROM up_q q
CROSS JOIN (VALUES
  ('CASUAL','Casual','सामान्य',1),
  ('SERIOUS','Serious','गंभीर',2)
) AS v(code,en,hi,ord)
ON CONFLICT (question_id, value_code) DO UPDATE
  SET label_en=EXCLUDED.label_en, label_hi=EXCLUDED.label_hi, sort_order=EXCLUDED.sort_order;

-- 4) (Optional) Preview what was loaded
-- Applicant 216
TABLE applicant WHERE screening_token = '216';

-- Question bank overview
SELECT q.code, q.label_en, o.value_code, o.label_en
FROM questions q
JOIN question_options o ON o.question_id = q.id
ORDER BY q.sort_order, o.sort_order;
