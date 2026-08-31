require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

const sql = `
BEGIN;

ALTER TABLE prescriptions
ADD COLUMN IF NOT EXISTS consultation_id INTEGER;

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
`;

(async () => {

    let client;

    try {

        client = await pool.connect();

        await client.query(sql);

        console.log("");
        console.log("DATABASE MIGRATION SUCCESSFUL.");
        console.log("prescriptions.consultation_id ready.");
        console.log("vital_signs.consultation_id ready.");
        console.log("lab_requests.consultation_id ready.");
        console.log("");

    } catch (error) {

        console.error("");
        console.error("DATABASE MIGRATION FAILED.");
        console.error(error);
        console.error("");

        process.exitCode = 1;

    } finally {

        if (client) {
            client.release();
        }

        await pool.end();

    }

})();
