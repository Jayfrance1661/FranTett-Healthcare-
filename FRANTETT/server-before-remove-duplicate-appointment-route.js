const cors = require("cors");
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve all files inside the pages folder
app.use(express.static(path.join(__dirname, "pages")));

const PORT = 3000;

// ==========================================
// JWT SECRET
// ==========================================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("ERROR: JWT_SECRET is missing from .env");
    process.exit(1);
}

// ==========================================
// POSTGRESQL CONNECTION
// ==========================================

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

// ==========================================
// TEST POSTGRESQL CONNECTION
// ==========================================

pool.connect()
    .then(client => {
        console.log("Connected to PostgreSQL successfully!");
        client.release();
    })
    .catch(error => {
        console.error("PostgreSQL connection error:", error);
    });

// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {
    res.send("Welcome to FranTett Healthcare Backend!");
});

// ==========================================
// STAFF LOGIN
// ==========================================

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const user = result.rows[0];

        const storedPassword =
            user.password ||
            user.password_hash;

        if (!storedPassword) {

            return res.status(500).json({
                message: "Password field not found for this user"
            });

        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                storedPassword
            );

        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Login successful",
            token: token
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed"
        });

    }

});

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

function authenticateToken(req, res, next) {

    const authHeader =
        req.headers.authorization;

    const token =
        authHeader &&
        authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            message: "Authentication required"
        });

    }

    jwt.verify(
        token,
        JWT_SECRET,
        (error, user) => {

            if (error) {

                return res.status(403).json({
                    message: "Invalid or expired token"
                });

            }

            req.user = user;

            next();

        }
    );

}

// ==========================================
// DOCTORS API
// ==========================================

app.get("/api/doctors", (req, res) => {

    const doctors = [

        {
            id: 1,
            name: "Dr. Francis Tetteh",
            specialty: "Naturopathic Doctor"
        },

        {
            id: 2,
            name: "Dr. Talent",
            specialty: "Naturopathic Doctor"
        },

        {
            id: 3,
            name: "Dr. Emily Brown",
            specialty: "Pediatrician"
        },

        {
            id: 4,
            name: "Dr. Sam",
            specialty: "Cardiologist"
        }

    ];

    res.json(doctors);

});

// ==========================================
// HELPER FUNCTION
// FIND OR CREATE PATIENT
// ==========================================

async function createOrUpdatePatient({
    name,
    email,
    phone
}) {

    if (!name) {
        return null;
    }

    const nameParts =
        name.trim().split(/\s+/);

    const firstName =
        nameParts.shift() || "";

    const lastName =
        nameParts.join(" ") || "Unknown";

    let existingPatient = null;

    // --------------------------------------
    // FIND BY EMAIL FIRST
    // --------------------------------------

    if (email) {

        const emailResult =
            await pool.query(
                `SELECT *
                 FROM patients
                 WHERE LOWER(email) = LOWER($1)
                 LIMIT 1`,
                [email]
            );

        if (emailResult.rows.length > 0) {
            existingPatient =
                emailResult.rows[0];
        }

    }

    // --------------------------------------
    // IF NOT FOUND, FIND BY PHONE
    // --------------------------------------

    if (!existingPatient && phone) {

        const phoneResult =
            await pool.query(
                `SELECT *
                 FROM patients
                 WHERE phone = $1
                 LIMIT 1`,
                [phone]
            );

        if (phoneResult.rows.length > 0) {
            existingPatient =
                phoneResult.rows[0];
        }

    }

    // --------------------------------------
    // UPDATE EXISTING PATIENT
    // --------------------------------------

    if (existingPatient) {

        const updatedResult =
            await pool.query(
                `UPDATE patients
                 SET
                    first_name = $1,
                    last_name = $2,
                    email = COALESCE($3, email),
                    phone = COALESCE($4, phone),
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = $5
                 RETURNING *`,
                [
                    firstName,
                    lastName,
                    email || null,
                    phone || null,
                    existingPatient.id
                ]
            );

        return updatedResult.rows[0];

    }

    // --------------------------------------
    // CREATE NEW PATIENT
    // --------------------------------------

    const result =
        await pool.query(
            `INSERT INTO patients
            (
                first_name,
                last_name,
                email,
                phone
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING *`,
            [
                firstName,
                lastName,
                email || null,
                phone || null
            ]
        );

    return result.rows[0];

}

// ==========================================
// 
// ALSO CREATES/UPDATES PATIENT
// ==========================================

app.post(
    "/api/appointments",
    async (req, res) => {

        const client =
            await pool.connect();

        try {

            const {
                name,
                email,
                phone,
                doctor,
                appointment_date,
                appointment_time,
                reason
            } = req.body;

            if (
                !name ||
                !email ||
                !doctor ||
                !appointment_date ||
                !appointment_time
            ) {

                return res.status(400).json({
                    message:
                        "Name, email, doctor, date and time are required"
                });

            }

            await client.query("BEGIN");

            // ----------------------------------
            // CREATE OR UPDATE PATIENT
            // ----------------------------------

            let patient = null;

            const nameParts =
                name.trim().split(/\s+/);

            const firstName =
                nameParts.shift() || "";

            const lastName =
                nameParts.join(" ") || "Unknown";

            // Find patient by email
            const patientByEmail =
                await client.query(
                    `SELECT *
                     FROM patients
                     WHERE LOWER(email) = LOWER($1)
                     LIMIT 1`,
                    [email]
                );

            if (patientByEmail.rows.length > 0) {

                patient =
                    patientByEmail.rows[0];

            }

            // If not found by email, try phone
            if (!patient && phone) {

                const patientByPhone =
                    await client.query(
                        `SELECT *
                         FROM patients
                         WHERE phone = $1
                         LIMIT 1`,
                        [phone]
                    );

                if (patientByPhone.rows.length > 0) {

                    patient =
                        patientByPhone.rows[0];

                }

            }

            // Update existing patient
            if (patient) {

                const updatedPatient =
                    await client.query(
                        `UPDATE patients
                         SET
                            first_name = $1,
                            last_name = $2,
                            email = COALESCE($3, email),
                            phone = COALESCE($4, phone),
                            updated_at = CURRENT_TIMESTAMP
                         WHERE id = $5
                         RETURNING *`,
                        [
                            firstName,
                            lastName,
                            email || null,
                            phone || null,
                            patient.id
                        ]
                    );

                patient =
                    updatedPatient.rows[0];

            } else {

                // Create new patient
                const newPatient =
                    await client.query(
                        `INSERT INTO patients
                        (
                            first_name,
                            last_name,
                            email,
                            phone
                        )
                        VALUES
                        (
                            $1,
                            $2,
                            $3,
                            $4
                        )
                        RETURNING *`,
                        [
                            firstName,
                            lastName,
                            email || null,
                            phone || null
                        ]
                    );

                patient =
                    newPatient.rows[0];

            }

            // ----------------------------------
// CREATE APPOINTMENT
// LINK APPOINTMENT TO PATIENT
// ----------------------------------

const appointmentResult =
    await client.query(
        `INSERT INTO appointments
        (
            name,
            email,
            phone,
            doctor,
            appointment_date,
            appointment_time,
            reason,
            patient_id
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
        )
        RETURNING *`,
        [
            name,
            email,
            phone,
            doctor,
            appointment_date,
            appointment_time,
            reason,
            patient.id
        ]
    );
            await client.query("COMMIT");

            console.log("New Patient:");
            console.log(patient);

            console.log("New Appointment:");
            console.log(appointmentResult.rows[0]);

            res.json({
                message:
                    "Appointment saved successfully!",
                appointment:
                    appointmentResult.rows[0],
                patient:
                    patient
            });

        } catch (error) {

            await client.query("ROLLBACK");

            console.error(
                "Error saving appointment:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to save appointment"
            });

        } finally {

            client.release();

        }

    }
);

// ==========================================
// GET ALL APPOINTMENTS
// STAFF ONLY
// ==========================================

app.get(
    "/api/appointments",
    authenticateToken,
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `SELECT
    a.*,
    p.first_name AS patient_first_name,
    p.last_name AS patient_last_name,
    p.email AS patient_email,
    p.phone AS patient_phone,
    p.date_of_birth AS patient_date_of_birth,
    p.gender AS patient_gender,
    p.address AS patient_address,
    p.medical_history AS patient_medical_history,
    p.allergies AS patient_allergies,
    p.medications AS patient_medications,
    p.notes AS patient_notes
 FROM appointments a
 LEFT JOIN patients p
    ON a.patient_id = p.id
 ORDER BY a.created_at DESC`

                );

            res.json(
                result.rows
            );

        } catch (error) {

            console.error(
                "Error fetching appointments:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch appointments"
            });

        }

    }
);

// ==========================================
// UPDATE APPOINTMENT
// STAFF ONLY
// ==========================================

app.put(
    "/api/appointments/:id",
    authenticateToken,
    async (req, res) => {

        const appointmentId =
            parseInt(req.params.id, 10);

        if (isNaN(appointmentId)) {

            return res.status(400).json({
                message:
                    "Invalid appointment ID."
            });

        }

        const {
            doctor,
            appointment_date,
            appointment_time,
            reason,
            status
        } = req.body;

        if (
            !appointment_date ||
            !appointment_time
        ) {

            return res.status(400).json({
                message:
                    "Appointment date and time are required."
            });

        }

        const validStatuses = [
            "Pending",
            "Confirmed",
            "Cancelled",
            "Completed"
        ];

        if (
            status &&
            !validStatuses.includes(status)
        ) {

            return res.status(400).json({
                message:
                    "Invalid appointment status."
            });

        }

        try {

            const result =
                await pool.query(
                    `
                    UPDATE appointments

                    SET
                        doctor = $1,
                        appointment_date = $2,
                        appointment_time = $3,
                        reason = $4,
                        status = $5

                    WHERE id = $6

                    RETURNING *
                    `,
                    [
                        doctor || null,
                        appointment_date,
                        appointment_time,
                        reason || null,
                        status || "Pending",
                        appointmentId
                    ]
                );

            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "Appointment not found."
                });

            }

            res.json({

                message:
                    "Appointment updated successfully!",

                appointment:
                    result.rows[0]

            });

        } catch (error) {

            console.error(
                "Error updating appointment:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to update appointment."

            });

        }

    }
);

// ==========================================
// EDIT APPOINTMENT
// STAFF ONLY
// ==========================================

app.put(
    "/api/appointments/:id",
    authenticateToken,
    async (req, res) => {

        const appointmentId =
            parseInt(req.params.id, 10);

        if (isNaN(appointmentId)) {

            return res.status(400).json({
                message: "Invalid appointment ID."
            });

        }

        const {
            doctor,
            appointment_date,
            appointment_time,
            reason,
            status
        } = req.body;

        const validStatuses = [
            "Pending",
            "Confirmed",
            "Cancelled",
            "Completed"
        ];

        if (
            status &&
            !validStatuses.includes(status)
        ) {

            return res.status(400).json({
                message: "Invalid appointment status."
            });

        }

        try {

            const result =
                await pool.query(
                    `
                    UPDATE appointments

                    SET
                        doctor = $1,
                        appointment_date = $2,
                        appointment_time = $3,
                        reason = $4,
                        status = $5

                    WHERE id = $6

                    RETURNING *
                    `,
                    [
                        doctor || null,
                        appointment_date || null,
                        appointment_time || null,
                        reason || null,
                        status || "Pending",
                        appointmentId
                    ]
                );

            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "Appointment not found."
                });

            }

            res.json({
                message:
                    "Appointment updated successfully!",
                appointment:
                    result.rows[0]
            });

        } catch (error) {

            console.error(
                "Error updating appointment:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update appointment."
            });

        }

    }
);

// ==========================================
// GET SINGLE APPOINTMENT
// STAFF ONLY
// ==========================================

app.get(
    "/api/appointments/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const { id } =
                req.params;

            const result =
                await pool.query(
                    `SELECT
                        id,
                        patient_id,
                        name,
                        email,
                        phone,
                        doctor,
                        appointment_date,
                        appointment_time,
                        reason,
                        status,
                        created_at
                     FROM appointments
                     WHERE id = $1`,
                    [id]
                );

            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "Appointment not found"
                });

            }

            res.json(
                result.rows[0]
            );

        } catch (error) {

            console.error(
                "Error fetching appointment:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch appointment"
            });

        }

    }
);


// ==========================================
// DELETE APPOINTMENT
// STAFF ONLY
// ==========================================

app.delete(
    "/api/appointments/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const { id } =
                req.params;

            const result =
                await pool.query(
                    `DELETE FROM appointments
                     WHERE id = $1
                     RETURNING *`,
                    [id]
                );

            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "Appointment not found"
                });

            }

            res.json({
                message:
                    "Appointment deleted successfully!",
                appointment:
                    result.rows[0]
            });

        } catch (error) {

            console.error(
                "Error deleting appointment:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete appointment"
            });

        }

    }
);

// ==========================================
// PATIENT RECORDS
// GET ALL PATIENTS
// STAFF ONLY
// ==========================================

app.get(
    "/api/patients",
    authenticateToken,
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `SELECT *
                     FROM patients
                     ORDER BY created_at DESC`
                );

            res.json(
                result.rows
            );

        } catch (error) {

            console.error(
                "Error fetching patients:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch patients"
            });

        }

    }
);

// ==========================================
// GET SINGLE PATIENT
// STAFF ONLY
// ==========================================

app.get(
    "/api/patients/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const { id } =
                req.params;

            const result =
                await pool.query(
                    `SELECT *
                     FROM patients
                     WHERE id = $1`,
                    [id]
                );

            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "Patient not found"
                });

            }

            res.json(
                result.rows[0]
            );

        } catch (error) {

            console.error(
                "Error fetching patient:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch patient"
            });

        }

    }
);

// ==========================================
// GET APPOINTMENT HISTORY FOR A PATIENT
// ==========================================

app.get(
    "/api/patients/:id/appointments",
    authenticateToken,
    async (req, res) => {

        const patientId =
            parseInt(req.params.id, 10);

        if (isNaN(patientId)) {

            return res.status(400).json({
                message: "Invalid patient ID."
            });

        }

        try {

            const result = await pool.query(
                `
                SELECT
                    id,
                    patient_id,
                    name,
                    email,
                    phone,
                    doctor,
                    appointment_date,
                    appointment_time,
                    reason,
                    status,
                    created_at

                FROM appointments

                WHERE patient_id = $1

                ORDER BY
                    appointment_date DESC,
                    appointment_time DESC
                `,
                [patientId]
            );

            res.json(result.rows);

        } catch (error) {

            console.error(
                "Error loading patient appointment history:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load appointment history."
            });

        }

    }
);

// ==========================================
// CLINICAL CONSULTATION RECORDS
// ==========================================


// ==========================================
// GET ALL CONSULTATIONS FOR A PATIENT
// ==========================================

app.get(
    "/api/patients/:id/consultations",
    authenticateToken,
    async (req, res) => {

        const patientId =
            parseInt(req.params.id, 10);

        if (isNaN(patientId)) {

            return res.status(400).json({
                message: "Invalid patient ID."
            });

        }

        try {

            const result =
                await pool.query(
                    `
                    SELECT
                        id,
                        patient_id,
                        doctor,
                        consultation_date,

                        chief_complaint,
                        history_of_presenting_complaint,
                        past_medical_history,
                        drug_allergy_history,
                        family_history,
                        social_history,
                        systems_review,
                        summary,
                        examination,
                        investigations,
                        differential_diagnosis,
                        diagnosis,
                        management_plan,
                        treatment,

                        assessment,
                        clinical_notes,
                        follow_up_date,

                        created_at,
                        updated_at

                    FROM consultations

                    WHERE patient_id = $1

                    ORDER BY
                        consultation_date DESC,
                        created_at DESC
                    `,
                    [patientId]
                );

            res.json(result.rows);

        } catch (error) {

            console.error(
                "Error loading consultations:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load consultation records."
            });

        }

    }
);


// ==========================================
// GET ONE CONSULTATION
// ==========================================

app.get(
    "/api/consultations/:id",
    authenticateToken,
    async (req, res) => {

        const consultationId =
            parseInt(req.params.id, 10);

        if (isNaN(consultationId)) {

            return res.status(400).json({
                message:
                    "Invalid consultation ID."
            });

        }

        try {

            const result =
                await pool.query(
                    `
                    SELECT
                        id,
                        patient_id,
                        doctor,
                        consultation_date,

                        chief_complaint,
                        history_of_presenting_complaint,
                        past_medical_history,
                        drug_allergy_history,
                        family_history,
                        social_history,
                        systems_review,
                        summary,
                        examination,
                        investigations,
                        differential_diagnosis,
                        diagnosis,
                        management_plan,
                        treatment,

                        assessment,
                        clinical_notes,
                        follow_up_date,

                        created_at,
                        updated_at

                    FROM consultations

                    WHERE id = $1
                    `,
                    [consultationId]
                );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message:
                        "Consultation not found."
                });

            }

            res.json(result.rows[0]);

        } catch (error) {

            console.error(
                "Error loading consultation:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load consultation."
            });

        }

    }
);


// ==========================================
// CREATE CONSULTATION
// ==========================================

app.post(
    "/api/patients/:id/consultations",
    authenticateToken,
    async (req, res) => {

        const patientId =
            parseInt(req.params.id, 10);

        if (isNaN(patientId)) {

            return res.status(400).json({
                message:
                    "Invalid patient ID."
            });

        }

        const {
            doctor,
            consultation_date,

            chief_complaint,
            history_of_presenting_complaint,
            past_medical_history,
            drug_allergy_history,
            family_history,
            social_history,
            systems_review,
            summary,
            examination,
            investigations,
            differential_diagnosis,
            diagnosis,
            management_plan,
            treatment,

            assessment,
            clinical_notes,
            follow_up_date

        } = req.body;


        try {

            // ==================================
            // CHECK PATIENT
            // ==================================

            const patientResult =
                await pool.query(
                    `
                    SELECT id
                    FROM patients
                    WHERE id = $1
                    `,
                    [patientId]
                );


            if (
                patientResult.rows.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "Patient not found."
                });

            }


            // ==================================
            // CREATE CONSULTATION
            // ==================================

            const result =
                await pool.query(
                    `
                    INSERT INTO consultations (

                        patient_id,
                        doctor,
                        consultation_date,

                        chief_complaint,
                        history_of_presenting_complaint,
                        past_medical_history,
                        drug_allergy_history,
                        family_history,
                        social_history,
                        systems_review,
                        summary,
                        examination,
                        investigations,
                        differential_diagnosis,
                        diagnosis,
                        management_plan,
                        treatment,

                        assessment,
                        clinical_notes,
                        follow_up_date

                    )

                    VALUES (

                        $1,
                        $2,
                        $3,

                        $4,
                        $5,
                        $6,
                        $7,
                        $8,
                        $9,
                        $10,
                        $11,
                        $12,
                        $13,
                        $14,
                        $15,
                        $16,
                        $17,

                        $18,
                        $19,
                        $20

                    )

                    RETURNING *
                    `,
                    [

                        patientId,
                        doctor || null,
                        consultation_date || null,

                        chief_complaint || null,
                        history_of_presenting_complaint || null,
                        past_medical_history || null,
                        drug_allergy_history || null,
                        family_history || null,
                        social_history || null,
                        systems_review || null,
                        summary || null,
                        examination || null,
                        investigations || null,
                        differential_diagnosis || null,
                        diagnosis || null,
                        management_plan || null,
                        treatment || null,

                        assessment || null,
                        clinical_notes || null,
                        follow_up_date || null

                    ]
                );


            res.status(201).json({

                message:
                    "Consultation record created successfully.",

                consultation:
                    result.rows[0]

            });

        } catch (error) {

            console.error(
                "Error creating consultation:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to create consultation record."
            });

        }

    }
);


// ==========================================
// UPDATE CONSULTATION
// ==========================================

app.put(
    "/api/consultations/:id",
    authenticateToken,
    async (req, res) => {

        const consultationId =
            parseInt(req.params.id, 10);

        if (isNaN(consultationId)) {

            return res.status(400).json({
                message:
                    "Invalid consultation ID."
            });

        }


        const {
            doctor,
            consultation_date,

            chief_complaint,
            history_of_presenting_complaint,
            past_medical_history,
            drug_allergy_history,
            family_history,
            social_history,
            systems_review,
            summary,
            examination,
            investigations,
            differential_diagnosis,
            diagnosis,
            management_plan,
            treatment,

            assessment,
            clinical_notes,
            follow_up_date

        } = req.body;


        try {

            const result =
                await pool.query(
                    `
                    UPDATE consultations

                    SET

                        doctor = $1,
                        consultation_date = $2,

                        chief_complaint = $3,
                        history_of_presenting_complaint = $4,
                        past_medical_history = $5,
                        drug_allergy_history = $6,
                        family_history = $7,
                        social_history = $8,
                        systems_review = $9,
                        summary = $10,
                        examination = $11,
                        investigations = $12,
                        differential_diagnosis = $13,
                        diagnosis = $14,
                        management_plan = $15,
                        treatment = $16,

                        assessment = $17,
                        clinical_notes = $18,
                        follow_up_date = $19,

                        updated_at =
                            CURRENT_TIMESTAMP

                    WHERE id = $20

                    RETURNING *
                    `,
                    [

                        doctor || null,
                        consultation_date || null,

                        chief_complaint || null,
                        history_of_presenting_complaint || null,
                        past_medical_history || null,
                        drug_allergy_history || null,
                        family_history || null,
                        social_history || null,
                        systems_review || null,
                        summary || null,
                        examination || null,
                        investigations || null,
                        differential_diagnosis || null,
                        diagnosis || null,
                        management_plan || null,
                        treatment || null,

                        assessment || null,
                        clinical_notes || null,
                        follow_up_date || null,

                        consultationId

                    ]
                );


            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "Consultation not found."
                });

            }


            res.json({

                message:
                    "Consultation updated successfully.",

                consultation:
                    result.rows[0]

            });

        } catch (error) {

            console.error(
                "Error updating consultation:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update consultation."
            });

        }

    }
);


// ==========================================
// DELETE CONSULTATION
// ==========================================

app.delete(
    "/api/consultations/:id",
    authenticateToken,
    async (req, res) => {

        const consultationId =
            parseInt(req.params.id, 10);

        if (isNaN(consultationId)) {

            return res.status(400).json({
                message:
                    "Invalid consultation ID."
            });

        }

        try {

            const result =
                await pool.query(
                    `
                    DELETE FROM consultations

                    WHERE id = $1

                    RETURNING id
                    `,
                    [consultationId]
                );


            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "Consultation not found."
                });

            }


            res.json({

                message:
                    "Consultation deleted successfully."

            });

        } catch (error) {

            console.error(
                "Error deleting consultation:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete consultation."
            });

        }

    }
);


// ==========================================
// CREATE PATIENT MANUALLY
// STAFF ONLY
// ==========================================

app.post(
    "/api/patients",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                first_name,
                last_name,
                email,
                phone,
                date_of_birth,
                gender,
                address,
                medical_history,
                allergies,
                medications,
                notes
            } = req.body;

            if (
                !first_name ||
                !last_name
            ) {

                return res.status(400).json({
                    message:
                        "First name and last name are required"
                });

            }

            // Check for existing email
            if (email) {

                const existing =
                    await pool.query(
                        `SELECT id
                         FROM patients
                         WHERE LOWER(email) = LOWER($1)
                         LIMIT 1`,
                        [email]
                    );

                if (
                    existing.rows.length > 0
                ) {

                    return res.status(409).json({
                        message:
                            "A patient with this email already exists"
                    });

                }

            }

            const result =
                await pool.query(
                    `INSERT INTO patients
                    (
                        first_name,
                        last_name,
                        email,
                        phone,
                        date_of_birth,
                        gender,
                        address,
                        medical_history,
                        allergies,
                        medications,
                        notes
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7,
                        $8,
                        $9,
                        $10,
                        $11
                    )
                    RETURNING *`,
                    [
                        first_name,
                        last_name,
                        email || null,
                        phone || null,
                        date_of_birth || null,
                        gender || null,
                        address || null,
                        medical_history || null,
                        allergies || null,
                        medications || null,
                        notes || null
                    ]
                );

            res.status(201).json({
                message:
                    "Patient created successfully!",
                patient:
                    result.rows[0]
            });

        } catch (error) {

            console.error(
                "Error creating patient:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to create patient"
            });

        }

    }
);

// ==========================================
// UPDATE PATIENT
// STAFF ONLY
// ==========================================

app.put(
    "/api/patients/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const { id } =
                req.params;

            const {
                first_name,
                last_name,
                email,
                phone,
                date_of_birth,
                gender,
                address,
                medical_history,
                allergies,
                medications,
                notes
            } = req.body;

            if (
                !first_name ||
                !last_name
            ) {

                return res.status(400).json({
                    message:
                        "First name and last name are required"
                });

            }

            const result =
                await pool.query(
                    `UPDATE patients
                     SET
                        first_name = $1,
                        last_name = $2,
                        email = $3,
                        phone = $4,
                        date_of_birth = $5,
                        gender = $6,
                        address = $7,
                        medical_history = $8,
                        allergies = $9,
                        medications = $10,
                        notes = $11,
                        updated_at = CURRENT_TIMESTAMP
                     WHERE id = $12
                     RETURNING *`,
                    [
                        first_name,
                        last_name,
                        email || null,
                        phone || null,
                        date_of_birth || null,
                        gender || null,
                        address || null,
                        medical_history || null,
                        allergies || null,
                        medications || null,
                        notes || null,
                        id
                    ]
                );

            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "Patient not found"
                });

            }

            res.json({
                message:
                    "Patient updated successfully!",
                patient:
                    result.rows[0]
            });

        } catch (error) {

            console.error(
                "Error updating patient:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update patient"
            });

        }

    }
);

// ==========================================
// DELETE PATIENT
// STAFF ONLY
// ==========================================

app.delete(
    "/api/patients/:id",
    authenticateToken,
    async (req, res) => {

        const client = await pool.connect();

        try {

            const patientId =
                parseInt(req.params.id, 10);

            // ==================================
            // VALIDATE PATIENT ID
            // ==================================

            if (isNaN(patientId)) {

                return res.status(400).json({
                    message:
                        "Invalid patient ID."
                });

            }


            // ==================================
            // START TRANSACTION
            // ==================================

            await client.query("BEGIN");


            // ==================================
            // CHECK PATIENT EXISTS
            // ==================================

            const patientResult =
                await client.query(
                    `
                    SELECT *
                    FROM patients
                    WHERE id = $1
                    FOR UPDATE
                    `,
                    [patientId]
                );


            if (
                patientResult.rows.length === 0
            ) {

                await client.query("ROLLBACK");

                return res.status(404).json({
                    message:
                        "Patient not found."
                });

            }


            // ==================================
            // DELETE CONSULTATIONS
            // ==================================

            await client.query(
                `
                DELETE FROM consultations
                WHERE patient_id = $1
                `,
                [patientId]
            );


            // ==================================
            // DELETE APPOINTMENTS
            // ==================================

            await client.query(
                `
                DELETE FROM appointments
                WHERE patient_id = $1
                `,
                [patientId]
            );


            // ==================================
            // DELETE PATIENT
            // ==================================

            const deleteResult =
                await client.query(
                    `
                    DELETE FROM patients
                    WHERE id = $1
                    RETURNING *
                    `,
                    [patientId]
                );


            if (
                deleteResult.rows.length === 0
            ) {

                await client.query("ROLLBACK");

                return res.status(404).json({
                    message:
                        "Patient could not be deleted."
                });

            }


            // ==================================
            // COMMIT TRANSACTION
            // ==================================

            await client.query("COMMIT");


            // ==================================
            // SUCCESS RESPONSE
            // ==================================

            res.json({

                message:
                    "Patient and associated records deleted successfully.",

                patient:
                    deleteResult.rows[0]

            });


        } catch (error) {

            // ==================================
            // ROLLBACK IF ERROR
            // ==================================

            try {

                await client.query("ROLLBACK");

            } catch (rollbackError) {

                console.error(
                    "Rollback error:",
                    rollbackError
                );

            }


            console.error(
                "Error deleting patient:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to delete patient and associated records."

            });


        } finally {

            // ==================================
            // RELEASE DATABASE CONNECTION
            // ==================================

            client.release();

        }

    }
);

// ==========================================
// PRESCRIPTION ROUTES
// ==========================================


// ==========================================
// GET PATIENT PRESCRIPTIONS
// ==========================================

app.get(
    "/api/patients/:id/prescriptions",
    authenticateToken,
    async (req, res) => {

        const patientId =
            parseInt(req.params.id, 10);

        if (isNaN(patientId)) {

            return res.status(400).json({
                message: "Invalid patient ID."
            });

        }

        try {

            const patientResult =
                await pool.query(
                    `
                    SELECT id
                    FROM patients
                    WHERE id = $1
                    `,
                    [patientId]
                );

            if (patientResult.rows.length === 0) {

                return res.status(404).json({
                    message: "Patient not found."
                });

            }

            const result =
                await pool.query(
                    `
                    SELECT
                        p.id,
                        p.patient_id,
                        p.doctor,
                        p.prescription_date,
                        p.instructions,
                        p.notes,
                        p.created_at,
                        p.updated_at,

                        COALESCE(
                            json_agg(
                                json_build_object(
                                    'id',
                                    pi.id,
                                    'medication_name',
                                    pi.medication_name,
                                    'dose',
                                    pi.dose,
                                    'route',
                                    pi.route,
                                    'frequency',
                                    pi.frequency,
                                    'duration',
                                    pi.duration,
                                    'quantity',
                                    pi.quantity
                                )
                                ORDER BY pi.id
                            ) FILTER (
                                WHERE pi.id IS NOT NULL
                            ),
                            json_build_array(
                                json_build_object(
                                    'id',
                                    NULL,
                                    'medication_name',
                                    p.medication_name,
                                    'dose',
                                    p.dose,
                                    'route',
                                    p.route,
                                    'frequency',
                                    p.frequency,
                                    'duration',
                                    p.duration,
                                    'quantity',
                                    p.quantity
                                )
                            )
                        ) AS medications

                    FROM prescriptions p

                    LEFT JOIN prescription_items pi
                        ON pi.prescription_id = p.id

                    WHERE p.patient_id = $1

                    GROUP BY
                        p.id

                    ORDER BY
                        p.prescription_date DESC,
                        p.created_at DESC
                    `,
                    [patientId]
                );

            res.json(result.rows);

        } catch (error) {

            console.error(
                "Error loading prescriptions:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load prescription records."
            });

        }

    }
);

// ==========================================
// GET COMPLETE PATIENT TIMELINE
// STAFF ONLY
// ==========================================

app.get(
    "/api/patients/:id/timeline",
    authenticateToken,
    async (req, res) => {

        const patientId =
            parseInt(req.params.id, 10);

        if (isNaN(patientId)) {

            return res.status(400).json({
                message: "Invalid patient ID."
            });

        }

        try {

            const patientResult =
                await pool.query(
                    `
                    SELECT id
                    FROM patients
                    WHERE id = $1
                    `,
                    [patientId]
                );

            if (patientResult.rows.length === 0) {

                return res.status(404).json({
                    message: "Patient not found."
                });

            }

            const appointmentsResult =
                await pool.query(
                    `
                    SELECT
                        id,
                        'appointment' AS type,
                        appointment_date AS event_date,
                        appointment_time AS event_time,
                        doctor,
                        reason AS title,
                        status,
                        created_at
                    FROM appointments
                    WHERE patient_id = $1
                    `,
                    [patientId]
                );

            const consultationsResult =
                await pool.query(
                    `
                    SELECT
                        id,
                        'consultation' AS type,
                        consultation_date AS event_date,
                        NULL AS event_time,
                        doctor,
                        COALESCE(
                            diagnosis,
                            chief_complaint,
                            'Clinical Consultation'
                        ) AS title,
                        NULL AS status,
                        created_at
                    FROM consultations
                    WHERE patient_id = $1
                    `,
                    [patientId]
                );

            const prescriptionsResult =
                await pool.query(
                    `
                    SELECT
                        id,
                        'prescription' AS type,
                        prescription_date AS event_date,
                        NULL AS event_time,
                        doctor,
                        medication_name AS title,
                        NULL AS status,
                        created_at
                    FROM prescriptions
                    WHERE patient_id = $1
                    `,
                    [patientId]
                );

            const timeline = [
                ...appointmentsResult.rows,
                ...consultationsResult.rows,
                ...prescriptionsResult.rows
            ];

            timeline.sort(
                (a, b) => {

                    const dateA =
                        new Date(
                            a.event_date ||
                            a.created_at
                        );

                    const dateB =
                        new Date(
                            b.event_date ||
                            b.created_at
                        );

                    return dateB - dateA;
                }
            );

            res.json(timeline);

        } catch (error) {

            console.error(
                "Error fetching patient timeline:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load patient timeline."
            });

        }

    }
);

// ==========================================
// GET ONE PRESCRIPTION
// ==========================================

app.get(
    "/api/prescriptions/:id",
    authenticateToken,
    async (req, res) => {

        const prescriptionId =
            parseInt(req.params.id, 10);

        if (isNaN(prescriptionId)) {

            return res.status(400).json({
                message: "Invalid prescription ID."
            });

        }

        try {

            const result =
                await pool.query(
                    `
                    SELECT
                        p.id,
                        p.patient_id,
                        p.doctor,
                        p.prescription_date,
                        p.instructions,
                        p.notes,
                        p.created_at,
                        p.updated_at,

                        COALESCE(
                            json_agg(
                                json_build_object(
                                    'id', pi.id,
                                    'medication_name', pi.medication_name,
                                    'dose', pi.dose,
                                    'route', pi.route,
                                    'frequency', pi.frequency,
                                    'duration', pi.duration,
                                    'quantity', pi.quantity
                                )
                                ORDER BY pi.id
                            ) FILTER (
                                WHERE pi.id IS NOT NULL
                            ),
                            json_build_array(
                                json_build_object(
                                    'id', NULL,
                                    'medication_name', p.medication_name,
                                    'dose', p.dose,
                                    'route', p.route,
                                    'frequency', p.frequency,
                                    'duration', p.duration,
                                    'quantity', p.quantity
                                )
                            )
                        ) AS medications

                    FROM prescriptions p

                    LEFT JOIN prescription_items pi
                        ON pi.prescription_id = p.id

                    WHERE p.id = $1

                    GROUP BY p.id
                    `,
                    [prescriptionId]
                );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message: "Prescription not found."
                });

            }

            res.json(result.rows[0]);

        } catch (error) {

            console.error(
                "Error loading prescription:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load prescription."
            });

        }

    }
);



// ==========================================
// CREATE PRESCRIPTION
// ==========================================

app.post(
    "/api/patients/:id/prescriptions",
    authenticateToken,
    async (req, res) => {

        const patientId =
            parseInt(req.params.id, 10);

        if (isNaN(patientId)) {

            return res.status(400).json({
                message: "Invalid patient ID."
            });

        }

        const {
            doctor,
            prescription_date,
            instructions,
            notes,
            items
        } = req.body;

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                message:
                    "At least one medication is required."
            });

        }

        const validItems =
            items.filter(
                item =>
                    item &&
                    item.medication_name &&
                    item.medication_name.trim()
            );

        if (validItems.length === 0) {

            return res.status(400).json({
                message:
                    "At least one valid medication is required."
            });

        }

        const client =
            await pool.connect();

        try {

            await client.query("BEGIN");

            const patientResult =
                await client.query(
                    `
                    SELECT id
                    FROM patients
                    WHERE id = $1
                    `,
                    [patientId]
                );

            if (patientResult.rows.length === 0) {

                await client.query("ROLLBACK");

                return res.status(404).json({
                    message: "Patient not found."
                });

            }

            const prescriptionResult =
                await client.query(
                    `
                    INSERT INTO prescriptions (
                        patient_id,
                        doctor,
                        prescription_date,
                        instructions,
                        notes
                    )
                    VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5
                    )
                    RETURNING *
                    `,
                    [
                        patientId,
                        doctor || null,
                        prescription_date || null,
                        instructions || null,
                        notes || null
                    ]
                );

            const prescription =
                prescriptionResult.rows[0];

            const savedItems = [];

            for (
                const item of validItems
            ) {

                const itemResult =
                    await client.query(
                        `
                        INSERT INTO prescription_items (
                            prescription_id,
                            medication_name,
                            dose,
                            route,
                            frequency,
                            duration,
                            quantity
                        )
                        VALUES (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5,
                            $6,
                            $7
                        )
                        RETURNING *
                        `,
                        [
                            prescription.id,
                            item.medication_name.trim(),
                            item.dose || null,
                            item.route || null,
                            item.frequency || null,
                            item.duration || null,
                            item.quantity || null
                        ]
                    );

                savedItems.push(
                    itemResult.rows[0]
                );
            }

            await client.query("COMMIT");

            res.status(201).json({
                message:
                    "Prescription created successfully.",
                prescription,
                items: savedItems
            });

        } catch (error) {

            await client.query("ROLLBACK");

            console.error(
                "Error creating prescription:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to create prescription."
            });

        } finally {

            client.release();

        }

    }
);

// ==========================================
// UPDATE PRESCRIPTION
// ==========================================

app.put(
    "/api/prescriptions/:id",
    authenticateToken,
    async (req, res) => {

        const prescriptionId =
            parseInt(req.params.id, 10);

        if (isNaN(prescriptionId)) {

            return res.status(400).json({
                message: "Invalid prescription ID."
            });

        }

        const {
            doctor,
            prescription_date,
            instructions,
            notes,
            items
        } = req.body;

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                message:
                    "At least one medication is required."
            });

        }

        const validItems =
            items.filter(
                item =>
                    item &&
                    item.medication_name &&
                    item.medication_name.trim()
            );

        if (validItems.length === 0) {

            return res.status(400).json({
                message:
                    "At least one valid medication is required."
            });

        }

        const client =
            await pool.connect();

        try {

            await client.query("BEGIN");

            const prescriptionResult =
                await client.query(
                    `
                    UPDATE prescriptions

                    SET
                        doctor = $1,
                        prescription_date = $2,
                        instructions = $3,
                        notes = $4,
                        updated_at = CURRENT_TIMESTAMP

                    WHERE id = $5

                    RETURNING *
                    `,
                    [
                        doctor || null,
                        prescription_date || null,
                        instructions || null,
                        notes || null,
                        prescriptionId
                    ]
                );

            if (
                prescriptionResult.rows.length === 0
            ) {

                await client.query("ROLLBACK");

                return res.status(404).json({
                    message:
                        "Prescription not found."
                });

            }

            await client.query(
                `
                DELETE FROM prescription_items
                WHERE prescription_id = $1
                `,
                [prescriptionId]
            );

            const savedItems = [];

            for (const item of validItems) {

                const itemResult =
                    await client.query(
                        `
                        INSERT INTO prescription_items (
                            prescription_id,
                            medication_name,
                            dose,
                            route,
                            frequency,
                            duration,
                            quantity
                        )
                        VALUES (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5,
                            $6,
                            $7
                        )
                        RETURNING *
                        `,
                        [
                            prescriptionId,
                            item.medication_name.trim(),
                            item.dose || null,
                            item.route || null,
                            item.frequency || null,
                            item.duration || null,
                            item.quantity || null
                        ]
                    );

                savedItems.push(
                    itemResult.rows[0]
                );

            }

            await client.query("COMMIT");

            res.json({
                message:
                    "Prescription updated successfully.",
                prescription:
                    prescriptionResult.rows[0],
                items:
                    savedItems
            });

        } catch (error) {

            await client.query("ROLLBACK");

            console.error(
                "Error updating prescription:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update prescription."
            });

        } finally {

            client.release();

        }

    }
);

// ==========================================
// DELETE PRESCRIPTION
// ==========================================

app.delete(
    "/api/prescriptions/:id",
    authenticateToken,
    async (req, res) => {

        const prescriptionId =
            parseInt(req.params.id, 10);

        if (isNaN(prescriptionId)) {

            return res.status(400).json({
                message: "Invalid prescription ID."
            });

        }

        try {

            const result =
                await pool.query(
                    `
                    DELETE FROM prescriptions

                    WHERE id = $1

                    RETURNING *
                    `,
                    [prescriptionId]
                );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message:
                        "Prescription not found."
                });

            }

            res.json({

                message:
                    "Prescription deleted successfully.",

                prescription:
                    result.rows[0]

            });

        } catch (error) {

            console.error(
                "Error deleting prescription:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete prescription."
            });

        }

    }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);