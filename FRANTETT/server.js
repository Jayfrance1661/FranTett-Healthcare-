const cors = require("cors");

const express = require("express");

const app = express();

app.use(cors());

app.use(express.json());

const PORT = 3000;

// Home page
app.get("/", (req, res) => {
    res.send("<h1>Welcome to FranTett Healthcare Backend!</h1>");
});

// Doctors API
app.get("/api/doctors", (req, res) => {

    app.post("/api/appointments", (req, res) => {

    const appointment = req.body;

    appointments.push(appointment);

    console.log("New Appointment:");
    console.log(appointment);

    res.json({
        message: "Appointment saved successfully!"
    });

});
    const doctors = [
        {
            id: 1,
            name: "Dr. Francis Tetteh",
            specialty: "Family Physician"
        },
        {
            id: 2,
            name: "Dr. Emily Brown",
            specialty: "Pediatrician"
        },
        {
            id: 3,
            name: "Dr. Sam Johnson",
            specialty: "Cardiologist"
        }
    ];

    res.json(doctors);
});

const appointments = [];
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});