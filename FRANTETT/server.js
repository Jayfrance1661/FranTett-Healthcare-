const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Home page
app.get("/", (req, res) => {
    res.send("Welcome to FranTett Healthcare Backend!");
});

// Doctors API
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
            id: 3,
            name: "Dr. Sam",
            specialty: "Cardiologist"
        }
    ];

    res.json(doctors);

});

// Appointments
const appointments = [];

app.post("/api/appointments", (req, res) => {

    const appointment = {
    id: appointments.length + 1,
    ...req.body
};

    appointments.push(appointment);

    console.log("New Appointment:");
    console.log(appointment);

    res.json({
        message: "Appointment saved successfully!"
    });

});

app.get("/api/appointments", (req, res) => {

    res.json(appointments);

});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});