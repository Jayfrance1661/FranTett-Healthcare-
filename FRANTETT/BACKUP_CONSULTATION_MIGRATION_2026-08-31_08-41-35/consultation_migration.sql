BEGIN;

-- ==========================================================
-- PRESCRIPTIONS -> CONSULTATIONS
-- ==========================================================

ALTER TABLE prescriptions
ADD COLUMN IF NOT EXISTS consultation_id INTEGER;

-- Add foreign key only if it does not already exist.
DO $$
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'prescriptions_consultation_id_fkey'
    ) THEN

        ALTER TABLE prescriptions
        ADD CONSTRAINT prescriptions_consultation_id_fkey
        FOREIGN KEY (consultation_id)
        REFERENCES consultations(id)
        ON DELETE SET NULL;

    END IF;

END
$$;

CREATE INDEX IF NOT EXISTS
idx_prescriptions_consultation_id
ON prescriptions(consultation_id);

-- ==========================================================
-- EXISTING VITAL SIGNS / LAB REQUEST RELATIONSHIPS
-- ==========================================================

ALTER TABLE vital_signs
ADD COLUMN IF NOT EXISTS consultation_id INTEGER;

ALTER TABLE lab_requests
ADD COLUMN IF NOT EXISTS consultation_id INTEGER;

CREATE INDEX IF NOT EXISTS
idx_vital_signs_consultation_id
ON vital_signs(consultation_id);

CREATE INDEX IF NOT EXISTS
idx_lab_requests_consultation_id
ON lab_requests(consultation_id);

COMMIT;
