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
            `SELECT
                id,
                email,
                password,
                role,
                full_name,
                phone,
                status
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const user = result.rows[0];

        // ==========================================
        // CHECK ACCOUNT STATUS
        // ==========================================

        if (user.status !== "Active") {

            return res.status(403).json({
                message: "Your account is not active. Please contact an administrator."
            });

        }

        // ==========================================
        // CHECK PASSWORD
        // ==========================================

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

        // ==========================================
        // USER ROLE
        // ==========================================

        const role =
            user.role || "Staff";

        const isAdmin =
            role === "Admin";

        // ==========================================
        // USER NAME
        // ==========================================

        const fullName =
            user.full_name ||
            user.email.split("@")[0];

        // ==========================================
        // CREATE JWT
        // ==========================================

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: role,
                full_name: fullName,
                isAdmin: isAdmin
            },
            JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        // ==========================================
        // LOGIN RESPONSE
        // ==========================================

        res.json({

            message: "Login successful",

            token: token,

            user: {
                id: user.id,
                email: user.email,
                full_name: fullName,
                role: role,
                phone: user.phone,
                status: user.status,
                isAdmin: isAdmin
            }

        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed"
        });

    }

});

// ==========================================

// ==========================================
// STAFF REGISTRATION REQUEST
// ==========================================

app.post("/api/staff/register", async (req, res) => {

    try {

        const {
            full_name,
            email,
            phone,
            role,
            password
        } = req.body;


        // Validate required fields
        if (
            !full_name ||
            !email ||
            !role ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Full name, email, role and password are required."
            });

        }


        // Validate password
        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters."
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        // Check existing staff account
        const existingUser =
            await pool.query(
                "SELECT id FROM users WHERE LOWER(email) = $1",
                [normalizedEmail]
            );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                message:
                    "A staff account with this email already exists."
            });

        }


        // Check existing registration request
        const existingRequest =
            await pool.query(
                `SELECT id, status
                 FROM staff_registration_requests
                 WHERE LOWER(email) = $1`,
                [normalizedEmail]
            );


        if (existingRequest.rows.length > 0) {

            const request =
                existingRequest.rows[0];


            if (request.status === "Pending") {

                return res.status(409).json({
                    message:
                        "A registration request for this email is already pending approval."
                });

            }


            if (request.status === "Approved") {

                return res.status(409).json({
                    message:
                        "This staff registration has already been approved."
                });

            }


            // Rejected request can be submitted again.
            await pool.query(
                `DELETE FROM staff_registration_requests
                 WHERE id = $1`,
                [request.id]
            );

        }


        // Hash password before storing it
        const hashedPassword =
            await bcrypt.hash(password, 12);


        // Create pending registration
        await pool.query(
            `INSERT INTO staff_registration_requests
            (
                full_name,
                email,
                phone,
                role,
                password,
                status
            )
            VALUES
            ($1, $2, $3, $4, $5, 'Pending')`,
            [
                full_name.trim(),
                normalizedEmail,
                phone ? phone.trim() : null,
                role.trim(),
                hashedPassword
            ]
        );


        res.status(201).json({

            message:
                "Registration submitted successfully. Your account is awaiting administrator approval."

        });


    } catch (error) {

        console.error(
            "Staff registration error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to submit staff registration."

        });

    }

});


// ==========================================
// PATIENT REGISTRATION
// ==========================================
// ==========================================


// ==========================================
// STAFF REGISTRATION APPROVAL MANAGEMENT
// ADMIN ONLY
// ==========================================

// GET ALL STAFF REGISTRATION REQUESTS

app.get(
    "/api/staff/registration-requests",
    authenticateToken,
    requireAdmin,
    async (req, res) => {

        try {

            const result = await pool.query(`
                SELECT
                    id,
                    full_name,
                    email,
                    phone,
                    role,
                    status,
                    created_at,
                    reviewed_at
                FROM staff_registration_requests
                ORDER BY created_at DESC
            `);

            res.json(result.rows);

        } catch (error) {

            console.error(
                "Get staff registration requests error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load staff registration requests."
            });

        }

    }
);


// APPROVE STAFF REGISTRATION REQUEST

app.put(
    "/api/staff/registration-requests/:id/approve",
    authenticateToken,
    requireAdmin,
    async (req, res) => {

        const requestId =
            parseInt(req.params.id, 10);

        if (isNaN(requestId)) {

            return res.status(400).json({
                message:
                    "Invalid registration request ID."
            });

        }

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            const requestResult =
                await client.query(
                    `
                    SELECT *
                    FROM staff_registration_requests
                    WHERE id = $1
                    FOR UPDATE
                    `,
                    [requestId]
                );

            if (requestResult.rows.length === 0) {

                await client.query("ROLLBACK");

                return res.status(404).json({
                    message:
                        "Registration request not found."
                });

            }

            const request =
                requestResult.rows[0];

            if (request.status !== "Pending") {

                await client.query("ROLLBACK");

                return res.status(400).json({
                    message:
                        `This request has already been ${request.status.toLowerCase()}.`
                });

            }

            const existingUser =
                await client.query(
                    `
                    SELECT id
                    FROM users
                    WHERE LOWER(email) = LOWER($1)
                    `,
                    [request.email]
                );

            if (existingUser.rows.length > 0) {

                await client.query("ROLLBACK");

                return res.status(409).json({
                    message:
                        "A staff account with this email already exists."
                });

            }

            await client.query(
                `
                INSERT INTO users
                    (email, password, role)
                VALUES
                    ($1, $2, $3)
                `,
                [
                    request.email.toLowerCase(),
                    request.password,
                    request.role
                ]
            );

            await client.query(
                `
                UPDATE staff_registration_requests
                SET
                    status = 'Approved',
                    reviewed_at = CURRENT_TIMESTAMP
                WHERE id = $1
                `,
                [requestId]
            );

            await client.query("COMMIT");

            res.json({
                message:
                    "Staff registration approved successfully."
            });

        } catch (error) {

            await client.query("ROLLBACK");

            console.error(
                "Approve staff registration error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to approve staff registration."
            });

        } finally {

            client.release();

        }

    }
);


// REJECT STAFF REGISTRATION REQUEST

app.put(
    "/api/staff/registration-requests/:id/reject",
    authenticateToken,
    requireAdmin,
    async (req, res) => {

        const requestId =
            parseInt(req.params.id, 10);

        if (isNaN(requestId)) {

            return res.status(400).json({
                message:
                    "Invalid registration request ID."
            });

        }

        try {

            const result = await pool.query(
                `
                UPDATE staff_registration_requests
                SET
                    status = 'Rejected',
                    reviewed_at = CURRENT_TIMESTAMP
                WHERE id = $1
                  AND status = 'Pending'
                RETURNING
                    id,
                    full_name,
                    email,
                    role,
                    status,
                    reviewed_at
                `,
                [requestId]
            );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message:
                        "Pending registration request not found."
                });

            }

            res.json({
                message:
                    "Staff registration rejected successfully.",
                request: result.rows[0]
            });

        } catch (error) {

            console.error(
                "Reject staff registration error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to reject staff registration."
            });

        }

    }
);

app.post("/api/patient/register", async (req, res) => {

    try {

        const {
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            gender,
            address,
            password
        } = req.body;

        if (
            !first_name ||
            !last_name ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "First name, last name, email and password are required."
            });

        }

        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters."
            });

        }

        const normalizedEmail =
            email.trim().toLowerCase();

        // Check whether this email already has an account
        const existingAccount =
            await pool.query(
                `
                SELECT id
                FROM patient_accounts
                WHERE LOWER(email) = LOWER($1)
                LIMIT 1
                `,
                [normalizedEmail]
            );

        if (existingAccount.rows.length > 0) {

            return res.status(409).json({
                message:
                    "An account with this email already exists."
            });

        }

        // Check whether this email already belongs
        // to an existing patient record
        const existingPatient =
            await pool.query(
                `
                SELECT *
                FROM patients
                WHERE LOWER(email) = LOWER($1)
                LIMIT 1
                `,
                [normalizedEmail]
            );

        let patient;

        if (existingPatient.rows.length > 0) {

            patient =
                existingPatient.rows[0];

        } else {

            const patientResult =
                await pool.query(
                    `
                    INSERT INTO patients
                    (
                        first_name,
                        last_name,
                        email,
                        phone,
                        date_of_birth,
                        gender,
                        address
                    )
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *
                    `,
                    [
                        first_name.trim(),
                        last_name.trim(),
                        normalizedEmail,
                        phone?.trim() || null,
                        date_of_birth || null,
                        gender || null,
                        address?.trim() || null
                    ]
                );

            patient =
                patientResult.rows[0];

        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 12);

        // Create patient account
        await pool.query(
            `
            INSERT INTO patient_accounts
            (
                patient_id,
                email,
                password
            )
            VALUES
            ($1, $2, $3)
            `,
            [
                patient.id,
                normalizedEmail,
                hashedPassword
            ]
        );

        // Create patient JWT
        const token =
            jwt.sign(
                {
                    id: patient.id,
                    account_type: "patient",
                    email: normalizedEmail
                },
                JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );

        res.status(201).json({

            message:
                "Patient account created successfully.",

            token,

            patient: {
                id: patient.id,
                first_name: patient.first_name,
                last_name: patient.last_name,
                email: patient.email
            }

        });

    } catch (error) {

        console.error(
            "Patient registration error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to create patient account."
        });

    }

});

// ==========================================
// PATIENT LOGIN
// ==========================================

app.post("/api/patient/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required."
            });

        }

        const normalizedEmail =
            email.trim().toLowerCase();

        const result =
            await pool.query(
                `
                SELECT
                    pa.id AS account_id,
                    pa.patient_id,
                    pa.email,
                    pa.password,
                    p.first_name,
                    p.last_name

                FROM patient_accounts pa

                INNER JOIN patients p
                    ON pa.patient_id = p.id

                WHERE LOWER(pa.email) = LOWER($1)

                LIMIT 1
                `,
                [normalizedEmail]
            );

        if (result.rows.length === 0) {

            return res.status(401).json({
                message:
                    "Invalid email or password."
            });

        }

        const account =
            result.rows[0];

        const passwordMatch =
            await bcrypt.compare(
                password,
                account.password
            );

        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    "Invalid email or password."
            });

        }

        const token =
            jwt.sign(
                {
                    id: account.patient_id,
                    account_id: account.account_id,
                    account_type: "patient",
                    email: account.email
                },
                JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );

        res.json({

            message:
                "Patient login successful.",

            token,

            patient: {
                id: account.patient_id,
                first_name: account.first_name,
                last_name: account.last_name,
                email: account.email
            }

        });

    } catch (error) {

        console.error(
            "Patient login error:",
            error
        );

        res.status(500).json({
            message:
                "Patient login failed."
        });

    }

});

app.get(
    "/api/patient/dashboard",
    authenticatePatient,
    async (req, res) => {

        try {

            const patientId = req.patient.id;

            console.log("PATIENT DASHBOARD ID:", patientId);

            const result = await pool.query(
                `
                SELECT *
                FROM patients
                WHERE id = $1
                `,
                [patientId]
            );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message: "Patient not found."
                });

            }

            res.json({
                patient: result.rows[0]
            });

        } catch (error) {

            console.error(
                "Patient dashboard error:",
                error
            );

            res.status(500).json({
                message: "Failed to load dashboard."
            });

        }

    }
);
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
// ADMIN-ONLY ACCESS
// ==========================================

function requireAdmin(req, res, next) {

    if (!req.user || req.user.isAdmin !== true) {

        return res.status(403).json({
            message: "Administrator access required."
        });

    }

    next();
}
function authenticatePatient(
    req,
    res,
    next
) {

    const authHeader =
        req.headers.authorization;

    const token =
        authHeader &&
        authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            message:
                "Authentication required."
        });

    }

    jwt.verify(
        token,
        JWT_SECRET,
        (error, user) => {

            if (error) {

                return res.status(403).json({
                    message:
                        "Invalid or expired token."
                });

            }

            if (
                user.account_type !==
                "patient"
            ) {

                return res.status(403).json({
                    message:
                        "Patient access only."
                });

            }

            req.patient = user;

            next();

        }
    );

}

// ==========================================
// DOCTORS API
// ==========================================

// GET ALL DOCTORS
app.get("/api/doctors", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                name,
                specialty,
                email,
                phone,
                license_number,
                status,
                created_at
            FROM doctors
            ORDER BY id ASC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error("Get doctors error:", error);

        res.status(500).json({
            message: "Failed to load doctors"
        });

    }

});


// ==========================================
// GET ONE DOCTOR
// ==========================================

app.get("/api/doctors/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                id,
                name,
                specialty,
                email,
                phone,
                license_number,
                status,
                created_at
            FROM doctors
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Doctor not found"
            });

        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error("Get doctor error:", error);

        res.status(500).json({
            message: "Failed to load doctor"
        });

    }

});


// ==========================================
// ADD DOCTOR
// ==========================================

app.post("/api/doctors", async (req, res) => {

    try {

        const {
            name,
            specialty,
            email,
            phone,
            license_number,
            status
        } = req.body;

        if (!name || !name.trim()) {

            return res.status(400).json({
                message: "Doctor name is required"
            });

        }

        const finalStatus =
            status && status.trim()
                ? status.trim()
                : "Active";

        const result = await pool.query(
            `
            INSERT INTO doctors
            (
                name,
                specialty,
                email,
                phone,
                license_number,
                status
            )
            VALUES
            ($1, $2, $3, $4, $5, $6)
            RETURNING
                id,
                name,
                specialty,
                email,
                phone,
                license_number,
                status,
                created_at
            `,
            [
                name.trim(),
                specialty?.trim() || null,
                email?.trim() || null,
                phone?.trim() || null,
                license_number?.trim() || null,
                finalStatus
            ]
        );

        res.status(201).json({
            message: "Doctor added successfully",
            doctor: result.rows[0]
        });

    } catch (error) {

        console.error("Add doctor error:", error);

        res.status(500).json({
            message: "Failed to add doctor"
        });

    }

});


// ==========================================
// UPDATE DOCTOR
// ==========================================

app.put("/api/doctors/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            specialty,
            email,
            phone,
            license_number,
            status
        } = req.body;

        if (!name || !name.trim()) {

            return res.status(400).json({
                message: "Doctor name is required"
            });

        }

        const result = await pool.query(
            `
            UPDATE doctors
            SET
                name = $1,
                specialty = $2,
                email = $3,
                phone = $4,
                license_number = $5,
                status = $6
            WHERE id = $7
            RETURNING
                id,
                name,
                specialty,
                email,
                phone,
                license_number,
                status,
                created_at
            `,
            [
                name.trim(),
                specialty?.trim() || null,
                email?.trim() || null,
                phone?.trim() || null,
                license_number?.trim() || null,
                status?.trim() || "Active",
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Doctor not found"
            });

        }

        res.json({
            message: "Doctor updated successfully",
            doctor: result.rows[0]
        });

    } catch (error) {

        console.error("Update doctor error:", error);

        res.status(500).json({
            message: "Failed to update doctor"
        });

    }

});


// ==========================================
// ACTIVATE / DEACTIVATE DOCTOR
// ==========================================

app.patch("/api/doctors/:id/status", async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;

        if (!status) {

            return res.status(400).json({
                message: "Status is required"
            });

        }

        const result = await pool.query(
            `
            UPDATE doctors
            SET status = $1
            WHERE id = $2
            RETURNING
                id,
                name,
                specialty,
                email,
                phone,
                license_number,
                status,
                created_at
            `,
            [
                status,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Doctor not found"
            });

        }

        res.json({
            message: "Doctor status updated successfully",
            doctor: result.rows[0]
        });

    } catch (error) {

        console.error("Doctor status error:", error);

        res.status(500).json({
            message: "Failed to update doctor status"
        });

    }

});


// ==========================================
// DELETE DOCTOR
// ==========================================

app.delete("/api/doctors/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM doctors
            WHERE id = $1
            RETURNING id, name
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Doctor not found"
            });

        }

        res.json({
            message: "Doctor deleted successfully",
            doctor: result.rows[0]
        });

    } catch (error) {

        console.error("Delete doctor error:", error);

        res.status(500).json({
            message: "Failed to delete doctor"
        });

    }

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

            if (client) {
    client.release();
}
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
            patient_name,
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

            const client =
                await pool.connect();

            try {

                await client.query("BEGIN");

                const appointmentResult =
                    await client.query(
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
                    appointmentResult.rows.length === 0
                ) {

                    await client.query("ROLLBACK");

                    return res.status(404).json({
                        message:
                            "Appointment not found."
                    });

                }

                const appointment =
                    appointmentResult.rows[0];

                /*
                 * Update patient name when supplied.
                 */
                if (
                    typeof patient_name === "string" &&
                    patient_name.trim()
                ) {

                    const nameParts =
                        patient_name
                            .trim()
                            .split(/\s+/);

                    const firstName =
                        nameParts.shift();

                    const lastName =
                        nameParts.join(" ");

                    /*
                     * Update the linked patient record.
                     */
                    if (appointment.patient_id) {

                        await client.query(
                            `
                            UPDATE patients

                            SET
                                first_name = $1,
                                last_name = $2

                            WHERE id = $3
                            `,
                            [
                                firstName,
                                lastName || null,
                                appointment.patient_id
                            ]
                        );

                    }

                    /*
                     * Update the appointment's displayed name.
                     */
                    await client.query(
                        `
                        UPDATE appointments

                        SET name = $1

                        WHERE id = $2
                        `,
                        [
                            patient_name.trim(),
                            appointmentId
                        ]
                    );

                    appointment.name =
                        patient_name.trim();

                }

                await client.query("COMMIT");

                res.json({
                    message:
                        "Appointment updated successfully!",
                    appointment:
                        appointment
                });

            } catch (error) {

                await client.query("ROLLBACK");

                throw error;

            } finally {

                if (client) {
    client.release();
}

            }

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
// UPDATE APPOINTMENT STATUS
// STAFF ONLY
// ==========================================

app.put(
    "/api/appointments/:id/status",
    authenticateToken,
    async (req, res) => {

        const appointmentId =
            parseInt(req.params.id, 10);

        const { status } =
            req.body;

        if (isNaN(appointmentId)) {

            return res.status(400).json({
                message:
                    "Invalid appointment ID."
            });

        }

        const validStatuses = [
            "Pending",
            "Confirmed",
            "Cancelled",
            "Completed"
        ];

        if (
            !status ||
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
                        status = $1

                    WHERE id = $2

                    RETURNING *
                    `,
                    [
                        status,
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
                    "Appointment status updated successfully!",
                appointment:
                    result.rows[0]
            });

        } catch (error) {

            console.error(
                "Error updating appointment status:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update appointment status."
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

        let client;

try {

    client = await pool.connect();

    const patientId = parseInt(req.params.id, 10);

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


// DELETE PATIENT ACCOUNT

await client.query(
`
DELETE FROM patient_accounts
WHERE patient_id = $1
`,
[patientId]
);

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

            // DELETE PRESCRIPTIONS

await client.query(
`
DELETE FROM prescriptions
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

            if (client) {
    client.release();
}

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

           if (client) {
    client.release();
}

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

            if (client) {
    client.release();
}

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
// CONTACT MESSAGES
// ==========================================

app.post(
    "/api/contact",
    async (req, res) => {

        try {

            const {
                name,
                email,
                subject,
                message
            } = req.body;

            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                return res.status(400).json({
                    message:
                        "Name, email, subject and message are required."
                });

            }

            const result =
                await pool.query(
                    `
                    INSERT INTO contact_messages
                    (
                        name,
                        email,
                        subject,
                        message
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4
                    )
                    RETURNING *
                    `,
                    [
                        name.trim(),
                        email.trim(),
                        subject.trim(),
                        message.trim()
                    ]
                );

            res.status(201).json({

                message:
                    "Your message has been received successfully.",

                contact:
                    result.rows[0]

            });

        } catch (error) {

            console.error(
                "Error saving contact message:",
                error
            );

            res.status(500).json({

                message:
                    "Unable to send your message. Please try again."

            });

        }

    }
);

// ==========================================
// STAFF CONTACT MESSAGE MANAGEMENT
// ==========================================

// GET ALL CONTACT MESSAGES
app.get(
    "/api/contact",
    authenticateToken,
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `
                    SELECT
                        id,
                        name,
                        email,
                        subject,
                        message,
                        status,
                        created_at
                    FROM contact_messages
                    ORDER BY created_at DESC
                    `
                );

            res.json({
                messages: result.rows
            });

        } catch (error) {

            console.error(
                "Error loading contact messages:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to load contact messages."
            });

        }

    }
);


// GET SINGLE CONTACT MESSAGE
app.get(
    "/api/contact/:id",
    authenticateToken,
    async (req, res) => {

        const contactId =
            parseInt(req.params.id, 10);

        if (isNaN(contactId)) {

            return res.status(400).json({
                message:
                    "Invalid contact message ID."
            });

        }

        try {

            const result =
                await pool.query(
                    `
                    SELECT
                        id,
                        name,
                        email,
                        subject,
                        message,
                        status,
                        created_at
                    FROM contact_messages
                    WHERE id = $1
                    `,
                    [contactId]
                );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message:
                        "Contact message not found."
                });

            }

            res.json({
                contact: result.rows[0]
            });

        } catch (error) {

            console.error(
                "Error loading contact message:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to load contact message."
            });

        }

    }
);

// UPDATE CONTACT MESSAGE STATUS
app.patch(
    "/api/contact/:id/status",
    authenticateToken,
    async (req, res) => {

        const contactId =
            parseInt(req.params.id, 10);

        const { status } = req.body;

        const allowedStatuses = [
            "New",
            "Read",
            "Replied"
        ];

        if (isNaN(contactId)) {

            return res.status(400).json({
                message:
                    "Invalid contact message ID."
            });

        }

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message:
                    "Invalid status."
            });

        }

        try {

            const result =
                await pool.query(
                    `
                    UPDATE contact_messages

                    SET status = $1

                    WHERE id = $2

                    RETURNING *
                    `,
                    [
                        status,
                        contactId
                    ]
                );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message:
                        "Contact message not found."
                });

            }

            res.json({

                message:
                    "Contact message status updated successfully.",

                contact:
                    result.rows[0]

            });

        } catch (error) {

            console.error(
                "Error updating contact message status:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to update contact message status."
            });

        }

    }
);


// DELETE CONTACT MESSAGE
app.delete(
    "/api/contact/:id",
    authenticateToken,
    async (req, res) => {

        const contactId =
            parseInt(req.params.id, 10);

        if (isNaN(contactId)) {

            return res.status(400).json({
                message:
                    "Invalid contact message ID."
            });

        }

        try {

            const result =
                await pool.query(
                    `
                    DELETE FROM contact_messages

                    WHERE id = $1

                    RETURNING *
                    `,
                    [contactId]
                );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message:
                        "Contact message not found."
                });

            }

            res.json({

                message:
                    "Contact message deleted successfully.",

                contact:
                    result.rows[0]

            });

        } catch (error) {

            console.error(
                "Error deleting contact message:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to delete contact message."
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





