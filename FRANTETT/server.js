const cors = require("cors");
const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "frantett_healthcare",
    password: "Success1661",
    port: 5432
});

app.use(cors());
app.use(express.json());

const PORT = 3000;


// Test PostgreSQL connection
pool.query("SELECT NOW()", function (err, result) {
    if (err) {
        console.error("PostgreSQL connection failed:", err.message);
    } else {
        console.log("PostgreSQL connected successfully:", result.rows[0]);
    }
});


// Home page
app.get("/", function (req, res) {
    res.send("Welcome to FranTett Healthcare Backend!");
});


// Doctors API
app.get("/api/doctors", async function (req, res) {
    try {
        const result = await pool.query(
            "SELECT * FROM doctors ORDER BY id"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching doctors:", error);

        res.status(500).json({
            message: "Failed to fetch doctors"
        });
    }
});


// Create appointment
app.post("/api/appointments", async function (req, res) {

    const name = req.body.name;
    const email = req.body.email;
    const date = req.body.date;
    const time = req.body.time;
    const phone = req.body.phone;
    const doctor = req.body.doctor;

    try {

        const doctorResult = await pool.query(
            "SELECT id FROM doctors WHERE name = $1",
            [doctor]
        );

        if (doctorResult.rows.length === 0) {

            return res.status(400).json({
                message: "Doctor not found"
            });

        }

        const doctorId = doctorResult.rows[0].id;

        const result = await pool.query(
            "INSERT INTO appointments " +
"(patient_name, patient_email, phone, doctor_id, appointment_date, appointment_time, status) " +
"VALUES ($1, $2, $3, $4, $5, $6, $7) " +
"RETURNING *",
           [
    name,
    email,
    phone,
    doctorId,
    date,
    time,
    "Pending"
]
        );

        console.log("New Appointment:");
        console.log(result.rows[0]);

        res.json({
            message: "Appointment saved successfully!",
            appointment: result.rows[0]
        });

    } catch (error) {

        console.error("Error saving appointment:", error);

        res.status(500).json({
            message: "Failed to save appointment"
        });

    }
});


// Get all appointments
app.get("/api/appointments", async function (req, res) {

    try {

        const result = await pool.query(
            "SELECT " +
            "appointments.id, " +
            "appointments.patient_name, " +
            "appointments.patient_email, " +
            "appointments.phone, " +
            "appointments.appointment_date, " +
            "appointments.status, " +
            "doctors.name AS doctor, " +
            "doctors.specialty " +
            "FROM appointments " +
            "JOIN doctors ON appointments.doctor_id = doctors.id " +
            "ORDER BY appointments.id DESC"
        );

        res.json(result.rows);

    } catch (error) {

        console.error("Error fetching appointments:", error);

        res.status(500).json({
            message: "Failed to fetch appointments"
        });

    }
});


// Update appointment status
app.patch("/api/appointments/:id", async function (req, res) {

    const id = Number(req.params.id);
    const status = req.body.status;

    try {

        const result = await pool.query(
            "UPDATE appointments " +
            "SET status = $1 " +
            "WHERE id = $2 " +
            "RETURNING *",
            [
                status,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Appointment not found"
            });

        }

        res.json({
            message: "Appointment status updated successfully!",
            appointment: result.rows[0]
        });

    } catch (error) {

        console.error("Error updating appointment:", error);

        res.status(500).json({
            message: "Failed to update appointment"
        });

    }
});


// Start server
app.listen(PORT, function () {
    console.log(
        "Server running on http://localhost:" + PORT
    );
});