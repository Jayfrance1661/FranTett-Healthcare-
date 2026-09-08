

/* =====================================================
   CONFIGURATION
===================================================== */

const API_URL = "http://localhost:3000";


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let patients = [];

let currentPatientId = null;

let currentAppointmentId = null;

let currentConsultationId = null;

let currentConsultations = [];


/* =====================================================
   TOKEN
===================================================== */

function getToken() {

    return localStorage.getItem(
        "frantett_token"
    );

}


/* =====================================================
   AUTHENTICATION
===================================================== */

function checkAuthentication() {

    const token =
        getToken();

    if (!token) {

        alert(
            "Please log in to access patient records."
        );

        window.location.href =
            "./login.html";

        return false;

    }

    return true;

}


/* =====================================================
   SESSION EXPIRED
===================================================== */

function handleSessionExpired() {

    localStorage.removeItem(
        "frantett_token"
    );

    alert(
        "Your session has expired. Please log in again."
    );

    window.location.href =
        "./login.html";

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   DATE
===================================================== */

function formatDate(value) {

    if (!value) {

        return "";

    }

    const date =
        new Date(value);

    if (
        isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }

    return date.toLocaleDateString();

}

function formatDateTime(value) {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString();
}

/* =====================================================
   TIME
===================================================== */

function formatTime(value) {

    if (!value) {

        return "";

    }

    const parts =
        String(value).split(":");

    if (
        parts.length < 2
    ) {

        return value;

    }

    let hours =
        parseInt(
            parts[0],
            10
        );

    const minutes =
        parts[1];

    if (
        isNaN(hours)
    ) {

        return value;

    }

    const ampm =
        hours >= 12
            ? "PM"
            : "AM";

    hours =
        hours % 12 || 12;

    return `${hours}:${minutes} ${ampm}`;

}


/* =====================================================
   TODAY
===================================================== */

function getTodayDate() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    text,
    type = "success"
) {

    const message =
        document.getElementById(
            "message"
        );

    if (!message) {

        return;

    }

    message.textContent =
        text;

    message.className =
        `message ${type}`;

    message.style.display =
        "block";

    setTimeout(
        () => {

            message.style.display =
                "none";

        },
        4000
    );

}


/* =====================================================
   LOAD PATIENTS
===================================================== */

async function loadPatients() {

    if (
        !checkAuthentication()
    ) {

        return;

    }

    const table =
        document.getElementById(
            "patientsTable"
        );

    const token =
        getToken();

    try {

        const response =
            await fetch(
                `${API_URL}/api/patients`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }


        const data =
            await response.json();


        if (
            !response.ok
        ) {

            table.innerHTML = `
                <tr>
                    <td colspan="7">
                        ${escapeHtml(
                            data.message ||
                            "Failed to load patients."
                        )}
                    </td>
                </tr>
            `;

            return;

        }


        patients =
            Array.isArray(data)
                ? data
                : [];


        displayPatients(
            patients
        );

    } catch (error) {

        console.error(
            "Load patients error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to connect to the server.
                </td>
            </tr>
        `;

    }

}


/* =====================================================
   DISPLAY PATIENTS
===================================================== */

function displayPatients(data) {

    const table =
        document.getElementById(
            "patientsTable"
        );

    table.innerHTML =
        "";


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No patient records found.
                </td>
            </tr>
        `;

        return;

    }


    data.forEach(
        patient => {

            const row =
                document.createElement(
                    "tr"
                );


            const fullName =
                `${patient.first_name || ""} ${patient.last_name || ""}`
                    .trim();


            row.innerHTML = `

                <td>
                    ${escapeHtml(patient.id)}
                </td>

                <td>
                    ${escapeHtml(
                        fullName ||
                        "Unnamed patient"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        patient.email ||
                        ""
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        patient.phone ||
                        ""
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        formatDate(
                            patient.date_of_birth
                        )
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        patient.gender ||
                        ""
                    )}
                </td>

                <td>

                    <div class="actions">

                        <button
                            class="view-btn"
                            onclick="viewPatient(${Number(patient.id)})"
                        >
                            View
                        </button>

                        <button
                            class="edit-btn"
                            onclick="editPatient(${Number(patient.id)})"
                        >
                            Edit
                        </button>

                        <button
                            class="danger-btn"
                            onclick="deletePatient(${Number(patient.id)})"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   FILTER PATIENTS
===================================================== */

function filterPatients() {

    const search =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase()
        .trim();

    const gender =
        document.getElementById(
            "genderFilter"
        ).value;

    const dob =
        document.getElementById(
            "dobFilter"
        ).value;

    const filtered =
        patients.filter(
            patient => {

                const name =
                    `${patient.first_name || ""} ${patient.last_name || ""}`
                        .toLowerCase();

                const email =
                    (
                        patient.email ||
                        ""
                    ).toLowerCase();

                const phone =
                    (
                        patient.phone ||
                        ""
                    ).toLowerCase();

                const matchesSearch =
                    name.includes(search) ||
                    email.includes(search) ||
                    phone.includes(search);

                const matchesGender =
                    !gender ||
                    patient.gender === gender;

                const matchesDob =
                    !dob ||
                    String(
                        patient.date_of_birth || ""
                    ).substring(
                        0,
                        10
                    ) === dob;

                return (
                    matchesSearch &&
                    matchesGender &&
                    matchesDob
                );
            }
        );

    displayPatients(
        filtered
    );
}


/* =====================================================
   ADD PATIENT
===================================================== */

function openAddPatientModal() {

    const form =
        document.getElementById(
            "patientForm"
        );

    form.reset();


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add Patient";


    document.getElementById(
        "patientId"
    ).value =
        "";


    document.getElementById(
        "patientFormModal"
    ).style.display =
        "flex";

}


/* =====================================================
   CLOSE PATIENT FORM
===================================================== */

function closePatientFormModal() {

    document.getElementById(
        "patientFormModal"
    ).style.display =
        "none";

}


/* =====================================================
   SAVE PATIENT
===================================================== */

document
    .getElementById(
        "patientForm"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const token =
                getToken();


            if (!token) {

                handleSessionExpired();

                return;

            }


            const patientId =
                document.getElementById(
                    "patientId"
                ).value;


            const patientData = {

                first_name:
                    document.getElementById(
                        "firstName"
                    ).value.trim(),

                last_name:
                    document.getElementById(
                        "lastName"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "email"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "phone"
                    ).value.trim(),

                date_of_birth:
                    document.getElementById(
                        "dateOfBirth"
                    ).value,

                gender:
                    document.getElementById(
                        "gender"
                    ).value,

                address:
                    document.getElementById(
                        "address"
                    ).value.trim(),

                medical_history:
                    document.getElementById(
                        "medicalHistory"
                    ).value.trim(),

                allergies:
                    document.getElementById(
                        "allergies"
                    ).value.trim(),

                medications:
                    document.getElementById(
                        "medications"
                    ).value.trim(),

                notes:
                    document.getElementById(
                        "notes"
                    ).value.trim()

            };


            const url =
                patientId
                    ? `${API_URL}/api/patients/${patientId}`
                    : `${API_URL}/api/patients`;


            const method =
                patientId
                    ? "PUT"
                    : "POST";


            try {

                const response =
                    await fetch(
                        url,
                        {
                            method,

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify(
                                    patientData
                                )

                        }
                    );


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    handleSessionExpired();

                    return;

                }


                const data =
                    await response.json();


                if (
                    !response.ok
                ) {

                    alert(
                        data.message ||
                        "Failed to save patient."
                    );

                    return;

                }


                showMessage(
                    data.message ||
                    "Patient saved successfully.",
                    "success"
                );


                closePatientFormModal();


                await loadPatients();


            } catch (error) {

                console.error(
                    "Save patient error:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );


/* =====================================================
   VITAL SIGNS
   CONSULTATION-SAFE VERSION
===================================================== */


/* =====================================================
   GET ACTIVE CONSULTATION ID
===================================================== */

function getActiveConsultationId(suppliedId = null) {

    let id = null;


    // -------------------------------------------------
    // 1. Use supplied ID first
    // -------------------------------------------------

    if (
        suppliedId !== null &&
        suppliedId !== undefined &&
        suppliedId !== ""
    ) {

        const parsed =
            Number(suppliedId);

        if (
            Number.isInteger(parsed) &&
            parsed > 0
        ) {

            id = parsed;

        }

    }


    // -------------------------------------------------
    // 2. Use global consultation ID
    // -------------------------------------------------

    if (!id) {

        const parsed =
            Number(currentConsultationId);

        if (
            Number.isInteger(parsed) &&
            parsed > 0
        ) {

            id = parsed;

        }

    }


    // -------------------------------------------------
    // 3. Recover from hidden consultation field
    // -------------------------------------------------

    if (!id) {

        const consultationField =
            document.getElementById(
                "consultationId"
            );


        if (
            consultationField &&
            consultationField.value
        ) {

            const parsed =
                Number(
                    consultationField.value
                );


            if (
                Number.isInteger(parsed) &&
                parsed > 0
            ) {

                id = parsed;

            }

        }

    }


    // -------------------------------------------------
    // 4. Synchronize everything
    // -------------------------------------------------

    if (id) {

        currentConsultationId =
            id;


        const consultationField =
            document.getElementById(
                "consultationId"
            );


        if (consultationField) {

            consultationField.value =
                id;

        }

    }


    console.log(
        "ACTIVE CONSULTATION ID:",
        id
    );


    return id || null;

}


/* =====================================================
   SET ACTIVE CONSULTATION ID
===================================================== */

function setActiveConsultationId(id) {

    const parsed =
        Number(id);


    if (
        !Number.isInteger(parsed) ||
        parsed <= 0
    ) {

        console.warn(
            "Attempted to set invalid consultation ID:",
            id
        );

        return false;

    }


    currentConsultationId =
        parsed;


    const consultationField =
        document.getElementById(
            "consultationId"
        );


    if (consultationField) {

        consultationField.value =
            parsed;

    }


    console.log(
        "ACTIVE CONSULTATION SET TO:",
        parsed
    );


    return true;

}


/* =====================================================
   VITAL SIGNS MODAL
===================================================== */


function openVitalSignsModal(consultationId = null) {

    console.log(
        "Opening Vital Signs. Passed consultation:",
        consultationId,
        "Current consultation:",
        currentConsultationId
    );

    if (!currentPatientId) {
        alert("Please open a patient profile first.");
        return;
    }

    let resolvedConsultationId = null;

    // 1. Explicit ID
    if (
        consultationId !== null &&
        consultationId !== undefined &&
        consultationId !== ""
    ) {
        const parsed = Number(consultationId);

        if (
            Number.isInteger(parsed) &&
            parsed > 0
        ) {
            resolvedConsultationId = parsed;
        }
    }

    // 2. Current consultation
    if (!resolvedConsultationId) {

        const parsed = Number(
            currentConsultationId
        );

        if (
            Number.isInteger(parsed) &&
            parsed > 0
        ) {
            resolvedConsultationId = parsed;
        }
    }

    // 3. Main hidden consultation field
    if (!resolvedConsultationId) {

        const field =
            document.getElementById(
                "consultationId"
            );

        if (field && field.value) {

            const parsed =
                Number(field.value);

            if (
                Number.isInteger(parsed) &&
                parsed > 0
            ) {
                resolvedConsultationId = parsed;
            }
        }
    }

    console.log(
        "Vital Signs resolved consultation ID:",
        resolvedConsultationId
    );

    if (!resolvedConsultationId) {
        alert(
            "Please open a consultation before recording vital signs."
        );
        return;
    }

    // Synchronize everything
    currentConsultationId =
        resolvedConsultationId;

    const consultationField =
        document.getElementById(
            "consultationId"
        );

    if (consultationField) {
        consultationField.value =
            resolvedConsultationId;
    }

    const vitalConsultationField =
        document.getElementById(
            "vitalConsultationId"
        );

    if (vitalConsultationField) {
        vitalConsultationField.value =
            resolvedConsultationId;
    }

    const modal =
        document.getElementById(
            "vitalSignsModal"
        );

    if (!modal) {
        console.error(
            "Vital Signs modal not found."
        );
        return;
    }

    const form =
        document.getElementById(
            "vitalSignsForm"
        );

    if (form) {
        form.reset();
    }

    // Restore ID after reset
    if (vitalConsultationField) {
        vitalConsultationField.value =
            resolvedConsultationId;
    }

    const bmiField =
        document.getElementById(
            "vitalBMI"
        );

    if (bmiField) {
        bmiField.value = "";
    }

    modal.style.display = "flex";

    console.log(
        "Vital Signs modal opened for consultation:",
        resolvedConsultationId
    );
}

/* =====================================================
   VIEW PATIENT
===================================================== */

async function viewPatient(id) {

    const token =
        getToken();


    if (!token) {

        handleSessionExpired();

        return;

    }


    currentPatientId =
        id;


    document.getElementById(
        "appointmentHistory"
    ).innerHTML = `
        <div class="loading">
            Loading appointment history...
        </div>
    `;


    document.getElementById(
        "consultationHistory"
    ).innerHTML = `
        <div class="loading">
            Loading consultation records...
        </div>
    `;


    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${id}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }


        const patient =
            await response.json();


        if (
            !response.ok
        ) {

            alert(
                patient.message ||
                "Unable to load patient."
            );

            return;

        }


        const fullName =
            `${patient.first_name || ""} ${patient.last_name || ""}`
                .trim();


        document.getElementById(
            "viewName"
        ).textContent =
            fullName ||
            "Patient";


        document.getElementById(
            "viewEmail"
        ).textContent =
            patient.email ||
            "Not provided";


        document.getElementById(
            "viewPhone"
        ).textContent =
            patient.phone ||
            "Not provided";


        document.getElementById(
            "viewDateOfBirth"
        ).textContent =
            formatDate(
                patient.date_of_birth
            ) ||
            "Not provided";


        document.getElementById(
            "viewGender"
        ).textContent =
            patient.gender ||
            "Not provided";


        document.getElementById(
            "viewAddress"
        ).textContent =
            patient.address ||
            "Not provided";


        document.getElementById(
            "viewMedicalHistory"
        ).textContent =
            patient.medical_history ||
            "None recorded";


        document.getElementById(
            "viewAllergies"
        ).textContent =
            patient.allergies ||
            "None recorded";


        document.getElementById(
            "viewMedications"
        ).textContent =
            patient.medications ||
            "None recorded";


        document.getElementById(
            "viewNotes"
        ).textContent =
            patient.notes ||
            "None";


        document.getElementById(
            "viewPatientModal"
        ).style.display =
            "flex";


        await loadAppointmentHistory(
            id
        );

        await loadPatientTimeline(
    id
);
        await loadVitalSigns(
            id
        );

        await loadConsultations(
            id
        );

        await loadPrescriptions(
    id
);




       await loadLaboratoryReports(id);

await loadLaboratoryRequests(id);

await updatePatientSummary(
    id
);


    } catch (error) {

        console.error(
            "View patient error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}

/* =====================================================
   LOAD APPOINTMENT HISTORY
===================================================== */

async function loadAppointmentHistory(patientId) {

    const container =
        document.getElementById("appointmentHistory");

    const token =
        getToken();

    if (!container) {
        return;
    }

    if (!token) {
        handleSessionExpired();
        return;
    }

    container.innerHTML = `
        <div class="loading">
            Loading appointment history...
        </div>
    `;

    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/appointments`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        if (
            response.status === 401 ||
            response.status === 403
        ) {
            handleSessionExpired();
            return;
        }

        const appointments =
            await response.json();

        if (!response.ok) {

            container.innerHTML = `
                <div class="no-records">
                    ${escapeHtml(
                        appointments.message ||
                        "Failed to load appointment history."
                    )}
                </div>
            `;

            return;
        }

        if (
            !Array.isArray(appointments) ||
            appointments.length === 0
        ) {

            container.innerHTML = `
                <div class="no-records">
                    No appointment history found.
                </div>
            `;

            return;
        }

        let html = `
            <div class="table-wrapper">

                <table>

                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Doctor</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
        `;

        appointments.forEach(
            appointment => {

                html += `
                    <tr>

                        <td>
                            ${escapeHtml(
                                formatDate(
                                    appointment.appointment_date
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                formatTime(
                                    appointment.appointment_time
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                appointment.doctor ||
                                "Not specified"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                appointment.reason ||
                                "Not provided"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                appointment.status ||
                                "Pending"
                            )}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="view-btn"
                                onclick="viewAppointment(${Number(appointment.id)})"
                            >
                                View
                            </button>

                            <button
                                type="button"
                                class="danger-btn"
                                onclick="deleteAppointmentFromPatient(${Number(appointment.id)})"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>
                `;
            }
        );

        html += `
                    </tbody>

                </table>

            </div>
        `;

        container.innerHTML =
            html;

    } catch (error) {

        console.error(
            "Appointment history error:",
            error
        );

        container.innerHTML = `
            <div class="no-records">
                Failed to load appointment history.
            </div>
        `;

    }

}

async function loadPatientTimeline(patientId) {

    const container =
        document.getElementById("patientTimeline");

    const token =
        getToken();

    if (!container || !token) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/timeline`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        if (
            response.status === 401 ||
            response.status === 403
        ) {
            handleSessionExpired();
            return;
        }

        const timeline =
            await response.json();

        if (!response.ok) {

            container.innerHTML = `
                <div class="no-records">
                    ${escapeHtml(
                        timeline.message ||
                        "Failed to load patient timeline."
                    )}
                </div>
            `;

            return;
        }

        if (
            !Array.isArray(timeline) ||
            timeline.length === 0
        ) {

            container.innerHTML = `
                <div class="no-records">
                    No timeline records found.
                </div>
            `;

            return;
        }

        let html = "";

        timeline.forEach(event => {

            let type = "Record";

            if (event.type === "appointment") {
                type = "Appointment";
            }

            if (event.type === "consultation") {
                type = "Consultation";
            }

            if (event.type === "prescription") {
                type = "Prescription";
            }

            html += `
                <div class="timeline-record">

                    <div class="timeline-header">

                        <div>
                            <div class="timeline-type">
                                ${escapeHtml(type)}
                            </div>

                            <div class="timeline-meta">
                                ${escapeHtml(
                                    formatDate(event.event_date)
                                )}

                                ${
                                    event.doctor
                                        ? ` &bull; ${escapeHtml(event.doctor)}`
                                        : ""
                                }
                            </div>
                        </div>

                    </div>

                    <div class="timeline-title">
                        ${escapeHtml(
                            event.title ||
                            "No details available"
                        )}
                    </div>

                    ${
                        event.status
                            ? `
                                <div class="timeline-status">
                                    Status:
                                    <span>
                                        ${escapeHtml(event.status)}
                                    </span>
                                </div>
                            `
                            : ""
                    }

                </div>
            `;

        });

        container.innerHTML = html;

    } catch (error) {

        console.error(
            "Patient timeline error:",
            error
        );

        container.innerHTML = `
            <div class="no-records">
                Failed to load patient timeline.
            </div>
        `;
    }
}

/* =====================================================
   VIEW APPOINTMENT
===================================================== */

async function viewAppointment(id) {

    const token = getToken();

    if (!token) {
        handleSessionExpired();
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/appointments/${id}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 401 || response.status === 403) {
            handleSessionExpired();
            return;
        }

        const appointment = await response.json();

        if (!response.ok) {
            alert(
                appointment.message ||
                "Unable to load appointment."
            );
            return;
        }

        alert(
            `Appointment Details\n\n` +
            `Patient: ${appointment.name || "Not provided"}\n` +
            `Email: ${appointment.email || "Not provided"}\n` +
            `Phone: ${appointment.phone || "Not provided"}\n` +
            `Doctor: ${appointment.doctor || "Not specified"}\n` +
            `Date: ${formatDate(appointment.appointment_date)}\n` +
            `Time: ${formatTime(appointment.appointment_time)}\n` +
            `Reason: ${appointment.reason || "Not provided"}\n` +
            `Status: ${appointment.status || "Pending"}`
        );

    } catch (error) {

        console.error(
            "Error viewing appointment:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}


/* =====================================================
   DELETE APPOINTMENT FROM PATIENT PROFILE
===================================================== */

async function deleteAppointmentFromPatient(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) {
        return;
    }

    const token = getToken();

    if (!token) {
        handleSessionExpired();
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/appointments/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 401 || response.status === 403) {
            handleSessionExpired();
            return;
        }

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete appointment."
            );

            return;
        }

        showMessage(
            data.message ||
            "Appointment deleted successfully.",
            "success"
        );

        await loadAppointmentHistory(
            currentPatientId
        );

    } catch (error) {

        console.error(
            "Error deleting appointment:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}

/* =====================================================
   LOAD CONSULTATIONS
===================================================== */

async function loadConsultations(
    patientId
) {

    const container =
        document.getElementById(
            "consultationHistory"
        );


    const token =
        getToken();


    container.innerHTML = `
        <div class="loading">
            Loading consultation records...
        </div>
    `;


    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/consultations`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }


        const consultations =
            await response.json();


        if (
            !response.ok
        ) {

            container.innerHTML = `
                <div class="no-records">
                    ${escapeHtml(
                        consultations.message ||
                        "Failed to load consultation records."
                    )}
                </div>
            `;

            return;

        }


        currentConsultations =
            Array.isArray(
                consultations
            )
                ? consultations
                : [];


        if (
            currentConsultations.length === 0
        ) {

            container.innerHTML = `
                <div class="no-records">
                    No consultation records found.
                </div>
            `;

            return;

        }


        displayConsultations(
            currentConsultations
        );


    } catch (error) {

        console.error(
            "Load consultations error:",
            error
        );

        container.innerHTML = `
            <div class="no-records">
                Failed to load consultation records.
            </div>
        `;

    }

}


/* =====================================================
   DISPLAY CONSULTATIONS
===================================================== */

function displayConsultations(consultations) {

    const container =
        document.getElementById("consultationHistory");

    if (!container) {
        return;
    }

    if (!Array.isArray(consultations) || consultations.length === 0) {

        container.innerHTML = `
            <div class="no-records">
                No consultation records found.
            </div>
        `;

        return;
    }

    container.innerHTML = consultations.map(
        consultation => `

            <div class="consultation-card">

                <div class="clinical-record-header">

                    <div>
                        <h4>Clinical Consultation</h4>

                        <div class="clinical-date">
                            ${escapeHtml(
                                formatDate(
                                    consultation.consultation_date
                                )
                            )}

                            ${
                                consultation.doctor
                                    ? ` &bull; ${escapeHtml(
                                        consultation.doctor
                                    )}`
                                    : ""
                            }

                            ${
                                consultation.created_at
                                    ? ` &bull; Entered ${escapeHtml(
                                        formatDateTime(
                                            consultation.created_at
                                        )
                                    )}`
                                    : ""
                            }
                        </div>
                    </div>

                </div>


                <div class="clinical-grid">

                    <div class="clinical-item">
                        <strong>Presenting Complaint</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.chief_complaint ||
                                consultation.presenting_complaint ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>History of Presenting Complaint</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.history_of_presenting_complaint ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Past Medical History</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.past_medical_history ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Drug and Allergy History</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.drug_allergy_history ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Family History</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.family_history ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Social History</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.social_history ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Systems Review</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.systems_review ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Summary</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.summary ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Examination</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.examination ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Investigations</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.investigations ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Differential Diagnosis</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.differential_diagnosis ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Diagnosis</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.diagnosis ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Management Plan</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.management_plan ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Treatment</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.treatment ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Clinical Notes</strong>
                        <div class="clinical-value">
                            ${escapeHtml(
                                consultation.clinical_notes ||
                                "Not recorded"
                            )}
                        </div>
                    </div>

                    <div class="clinical-item">
                        <strong>Follow-up Date</strong>
                        <div class="clinical-value">
                            ${
                                consultation.follow_up_date
                                    ? escapeHtml(
                                        formatDate(
                                            consultation.follow_up_date
                                        )
                                    )
                                    : "No follow-up scheduled"
                            }
                        </div>
                    </div>

                </div>


                <div class="record-actions">

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editConsultation(${Number(consultation.id)})"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="danger-btn"
                        onclick="deleteConsultation(${Number(consultation.id)})"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `
    ).join("");
}

// ==========================================
// PRESCRIPTION FUNCTIONS
// ==========================================

// ==========================================
// OPEN ADD PRESCRIPTION
// ==========================================

function openAddPrescriptionModal() {

    if (!currentPatientId) {

        alert(
            "Please open a patient profile first."
        );

        return;
    }

    const form =
        document.getElementById(
            "prescriptionForm"
        );

    if (form) {
        form.reset();
    }

    const medicationContainer =
        document.getElementById(
            "medicationItems"
        );

    if (medicationContainer) {

        medicationContainer.innerHTML = `
            <tr class="medication-item">

                <td>
                    <input
                        type="text"
                        class="medication-name"
                        placeholder="Medication"
                        required
                    >
                </td>

                <td>
                    <input
                        type="text"
                        class="medication-dose"
                        placeholder="500 mg"
                    >
                </td>

                <td>
                    <input
                        type="text"
                        class="medication-route"
                        placeholder="Oral"
                    >
                </td>

                <td>
                    <input
                        type="text"
                        class="medication-frequency"
                        placeholder="BID"
                    >
                </td>

                <td>
                    <input
                        type="text"
                        class="medication-duration"
                        placeholder="7 days"
                    >
                </td>

                <td>
                    <input
                        type="text"
                        class="medication-quantity"
                        placeholder="14"
                    >
                </td>

                <td>
                    <button
                        type="button"
                        class="danger-btn"
                        onclick="removeMedicationItem(this)"
                        style="display: none;"
                    >
                        Remove
                    </button>
                </td>

            </tr>
        `;
    }

    document.getElementById(
        "prescriptionFormTitle"
    ).textContent =
        "Add Prescription";

    document.getElementById(
        "prescriptionId"
    ).value =
        "";

    document.getElementById(
        "prescriptionDate"
    ).value =
        getTodayDate();

    document.getElementById(
        "prescriptionFormModal"
    ).style.display =
        "flex";
}


// ==========================================
// ADD MEDICATION ROW
// ==========================================

function addMedicationItem() {

    const container =
        document.getElementById(
            "medicationItems"
        );

    if (!container) {
        return;
    }

    const row =
        document.createElement("tr");

    row.className =
        "medication-item";

    row.innerHTML = `
        <td>
            <input
                type="text"
                class="medication-name"
                placeholder="Medication"
                required
            >
        </td>

        <td>
            <input
                type="text"
                class="medication-dose"
                placeholder="500 mg"
            >
        </td>

        <td>
            <input
                type="text"
                class="medication-route"
                placeholder="Oral"
            >
        </td>

        <td>
            <input
                type="text"
                class="medication-frequency"
                placeholder="BID"
            >
        </td>

        <td>
            <input
                type="text"
                class="medication-duration"
                placeholder="7 days"
            >
        </td>

        <td>
            <input
                type="text"
                class="medication-quantity"
                placeholder="14"
            >
        </td>

        <td>
            <button
                type="button"
                class="danger-btn remove-medication-btn"
                onclick="removeMedicationItem(this)"
            >
                Remove
            </button>
        </td>
    `;

    container.appendChild(row);

    updateMedicationRemoveButtons();
}


// ==========================================
// REMOVE MEDICATION ROW
// ==========================================

function removeMedicationItem(button) {

    const row =
        button.closest(
            ".medication-item"
        );

    if (!row) {
        return;
    }

    const container =
        document.getElementById(
            "medicationItems"
        );

    const rows =
        container.querySelectorAll(
            ".medication-item"
        );

    if (rows.length <= 1) {

        alert(
            "At least one medication is required."
        );

        return;
    }

    row.remove();

    updateMedicationRemoveButtons();
}


// ==========================================
// UPDATE REMOVE BUTTONS
// ==========================================

function updateMedicationRemoveButtons() {

    const container =
        document.getElementById(
            "medicationItems"
        );

    if (!container) {
        return;
    }

    const rows =
        container.querySelectorAll(
            ".medication-item"
        );

    rows.forEach(
        row => {

            const button =
                row.querySelector(
                    ".remove-medication-btn"
                );

            if (!button) {
                return;
            }

            button.style.display =
                rows.length > 1
                    ? "inline-block"
                    : "none";
        }
    );
}

// ==========================================
// CLOSE PRESCRIPTION FORM
// ==========================================

function closePrescriptionFormModal() {

    const modal =
        document.getElementById(
            "prescriptionFormModal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }

}


// ==========================================
// LOAD PRESCRIPTIONS
// ==========================================

async function loadPrescriptions(
    patientId
) {

    const container =
        document.getElementById(
            "prescriptionHistory"
        );

    const token =
        getToken();

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="loading">
            Loading prescription records...
        </div>
    `;

    if (!token) {

        handleSessionExpired();

        return;

    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/prescriptions`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }

        const prescriptions =
            await response.json();

        if (!response.ok) {

            container.innerHTML = `
                <div class="error-message">
                    ${escapeHtml(
                        prescriptions.message ||
                        "Failed to load prescription records."
                    )}
                </div>
            `;

            return;

        }

        currentPrescriptions =
            prescriptions;

        displayPrescriptions(
            prescriptions
        );

    } catch (error) {

        console.error(
            "Error loading prescriptions:",
            error
        );

        container.innerHTML = `
            <div class="error-message">
                Failed to load prescription records.
            </div>
        `;

    }

}

function updatePatientSummary(
    appointments,
    consultations,
    prescriptions
) {

    const totalAppointments =
        Array.isArray(appointments)
            ? appointments.length
            : 0;

    const completedAppointments =
        Array.isArray(appointments)
            ? appointments.filter(
                appointment =>
                    appointment.status === "Completed"
            ).length
            : 0;

    const totalConsultations =
        Array.isArray(consultations)
            ? consultations.length
            : 0;

    const totalPrescriptions =
        Array.isArray(prescriptions)
            ? prescriptions.length
            : 0;

    document.getElementById(
        "summaryTotalAppointments"
    ).textContent =
        totalAppointments;

    document.getElementById(
        "summaryCompletedAppointments"
    ).textContent =
        completedAppointments;

    document.getElementById(
        "summaryTotalConsultations"
    ).textContent =
        totalConsultations;

    document.getElementById(
        "summaryTotalPrescriptions"
    ).textContent =
        totalPrescriptions;
}

async function updatePatientSummary(patientId) {

    const token = getToken();

    if (!token) {
        return;
    }

    try {

        const [
            appointmentsResponse,
            consultationsResponse,
            prescriptionsResponse
        ] = await Promise.all([
            fetch(
                `${API_URL}/api/patients/${patientId}/appointments`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            ),

            fetch(
                `${API_URL}/api/patients/${patientId}/consultations`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            ),

            fetch(
                `${API_URL}/api/patients/${patientId}/prescriptions`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        ]);

        const appointments =
            appointmentsResponse.ok
                ? await appointmentsResponse.json()
                : [];

        const consultations =
            consultationsResponse.ok
                ? await consultationsResponse.json()
                : [];

        const prescriptions =
            prescriptionsResponse.ok
                ? await prescriptionsResponse.json()
                : [];

        const totalAppointments =
            Array.isArray(appointments)
                ? appointments.length
                : 0;

        const completedAppointments =
            Array.isArray(appointments)
                ? appointments.filter(
                    appointment =>
                        appointment.status === "Completed"
                ).length
                : 0;

        const totalConsultations =
            Array.isArray(consultations)
                ? consultations.length
                : 0;

        const totalPrescriptions =
            Array.isArray(prescriptions)
                ? prescriptions.length
                : 0;

        document.getElementById(
            "summaryTotalAppointments"
        ).textContent =
            totalAppointments;

        document.getElementById(
            "summaryCompletedAppointments"
        ).textContent =
            completedAppointments;

        document.getElementById(
            "summaryTotalConsultations"
        ).textContent =
            totalConsultations;

        document.getElementById(
            "summaryTotalPrescriptions"
        ).textContent =
            totalPrescriptions;

    } catch (error) {

        console.error(
            "Patient summary error:",
            error
        );

    }
}

// ==========================================
// DISPLAY PRESCRIPTIONS
// ==========================================

function displayPrescriptions(prescriptions) {

    const container =
        document.getElementById("prescriptionHistory");

    if (!container) {
        return;
    }

    if (
        !Array.isArray(prescriptions) ||
        prescriptions.length === 0
    ) {

        container.innerHTML = `
            <div class="no-records">
                No prescription records found.
            </div>
        `;

        return;
    }

    container.innerHTML =
        prescriptions.map(
            prescription => {

                const medications =
                    Array.isArray(
                        prescription.medications
                    )
                        ? prescription.medications
                        : [];

                return `

                    <div class="clinical-record">

                        <div class="clinical-record-header">

                            <div>

                                <h4>
                                    Prescription
                                </h4>

                                <div class="clinical-date">

                                    ${escapeHtml(
                                        formatDate(
                                            prescription.prescription_date
                                        )
                                    )}

                                    ${
                                        prescription.doctor
                                            ? ` &bull; ${escapeHtml(
                                                prescription.doctor
                                            )}`
                                            : ""
                                    }

                                    ${
                                        prescription.created_at
                                            ? ` &bull; Entered ${escapeHtml(
                                                formatDateTime(
                                                    prescription.created_at
                                                )
                                            )}`
                                            : ""
                                    }

                                </div>

                            </div>

                        </div>


                        <div class="prescription-table-wrapper">

                            <table class="prescription-entry-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Medication
                                        </th>

                                        <th>
                                            Dose
                                        </th>

                                        <th>
                                            Route
                                        </th>

                                        <th>
                                            Frequency
                                        </th>

                                        <th>
                                            Duration
                                        </th>

                                        <th>
                                            Quantity
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    ${
                                        medications.length > 0

                                            ? medications.map(
                                                medication => `

                                                    <tr>

                                                        <td>
                                                            ${escapeHtml(
                                                                medication.medication_name ||
                                                                "Not recorded"
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${escapeHtml(
                                                                medication.dose ||
                                                                "Not recorded"
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${escapeHtml(
                                                                medication.route ||
                                                                "Not recorded"
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${escapeHtml(
                                                                medication.frequency ||
                                                                "Not recorded"
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${escapeHtml(
                                                                medication.duration ||
                                                                "Not recorded"
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${escapeHtml(
                                                                medication.quantity ||
                                                                "Not recorded"
                                                            )}
                                                        </td>

                                                    </tr>

                                                `
                                            ).join("")

                                            : `
                                                <tr>

                                                    <td colspan="6">
                                                        No medication details available.
                                                    </td>

                                                </tr>
                                            `
                                    }

                                </tbody>

                            </table>

                        </div>


                        ${
                            prescription.notes
                                ? `

                                    <div class="clinical-item prescription-extra">

                                        <strong>
                                            Notes
                                        </strong>

                                        <div class="clinical-value">
                                            ${escapeHtml(
                                                prescription.notes
                                            )}

                                            <div class="record-actions">

    <button
        type="button"
        class="edit-btn"
        onclick="editPrescription(${Number(prescription.id)})"
    >
        Edit
    </button>

    <button
        type="button"
        class="danger-btn"
        onclick="deletePrescription(${Number(prescription.id)})"
    >
        Delete
    </button>

</div>

                                        </div>

                                    </div>

                                `
                                : ""
                        }

                    </div>

                `;
            }
        ).join("");
}

// ==========================================
// SAVE PRESCRIPTION
// ==========================================

const prescriptionForm =
    document.getElementById(
        "prescriptionForm"
    );

if (prescriptionForm) {

    prescriptionForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const token =
                getToken();

            if (!token) {
                handleSessionExpired();
                return;
            }

            if (!currentPatientId) {
                alert("No patient selected.");
                return;
            }

            const prescriptionId =
                document.getElementById(
                    "prescriptionId"
                ).value;

            const medicationRows =
                document.querySelectorAll(
                    "#medicationItems .medication-item"
                );

            const items = [];

            medicationRows.forEach(
                row => {

                    const medicationName =
                        row.querySelector(
                            ".medication-name"
                        ).value.trim();

                    if (!medicationName) {
                        return;
                    }

                    items.push({

                        medication_name:
                            medicationName,

                        dose:
                            row.querySelector(
                                ".medication-dose"
                            ).value.trim(),

                        route:
                            row.querySelector(
                                ".medication-route"
                            ).value.trim(),

                        frequency:
                            row.querySelector(
                                ".medication-frequency"
                            ).value.trim(),

                        duration:
                            row.querySelector(
                                ".medication-duration"
                            ).value.trim(),

                        quantity:
                            row.querySelector(
                                ".medication-quantity"
                            ).value.trim()

                    });

                }
            );

            if (items.length === 0) {

                alert(
                    "Please enter at least one medication."
                );

                return;
            }

            const prescriptionData = {

                doctor:
                    document.getElementById(
                        "prescriptionDoctor"
                    ).value.trim(),

                prescription_date:
                    document.getElementById(
                        "prescriptionDate"
                    ).value,

                notes:
                    document.getElementById(
                        "prescriptionNotes"
                    ).value.trim(),

                items:
                    items

            };

            const url =
                prescriptionId
                    ? `${API_URL}/api/prescriptions/${prescriptionId}`
                    : `${API_URL}/api/patients/${currentPatientId}/prescriptions`;

            const method =
                prescriptionId
                    ? "PUT"
                    : "POST";

            try {

                const response =
                    await fetch(
                        url,
                        {
                            method: method,

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify(
                                    prescriptionData
                                )

                        }
                    );

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    handleSessionExpired();
                    return;

                }

                const data =
                    await response.json();

                if (!response.ok) {

                    console.error(
                        "Prescription save error:",
                        data
                    );

                    alert(
                        data.message ||
                        "Failed to save prescription."
                    );

                    return;
                }

                showMessage(
                    data.message ||
                    "Prescription saved successfully.",
                    "success"
                );

                closePrescriptionFormModal();

                await loadPrescriptions(
                    currentPatientId
                );

            } catch (error) {

                console.error(
                    "Error saving prescription:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

}

// ==========================================
// VIEW PRESCRIPTION
// ==========================================

async function viewPrescription(
    id
) {

    const token =
        getToken();

    if (!token) {

        handleSessionExpired();

        return;

    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/prescriptions/${id}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }

        const prescription =
            await response.json();

        if (!response.ok) {

            alert(
                prescription.message ||
                "Unable to load prescription."
            );

            return;

        }

        alert(
            `Prescription\n\n` +

            `Medication: ${
                prescription.medication_name ||
                "Not provided"
            }\n` +

            `Dose: ${
                prescription.dose ||
                "Not provided"
            }\n` +

            `Route: ${
                prescription.route ||
                "Not provided"
            }\n` +

            `Frequency: ${
                prescription.frequency ||
                "Not provided"
            }\n` +

            `Duration: ${
                prescription.duration ||
                "Not provided"
            }\n` +

            `Quantity: ${
                prescription.quantity ||
                "Not provided"
            }\n\n` +

            `Instructions: ${
                prescription.instructions ||
                "Not provided"
            }\n\n` +

            `Notes: ${
                prescription.notes ||
                "Not provided"
            }`
        );

    } catch (error) {

        console.error(
            "Error viewing prescription:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}


// ==========================================
// EDIT PRESCRIPTION
// ==========================================

async function editPrescription(id) {

    const token =
        getToken();

    if (!token) {

        handleSessionExpired();

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/prescriptions/${id}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;
        }

        const prescription =
            await response.json();

        if (!response.ok) {

            alert(
                prescription.message ||
                "Unable to load prescription."
            );

            return;
        }

        document.getElementById(
            "prescriptionFormTitle"
        ).textContent =
            "Edit Prescription";

        document.getElementById(
            "prescriptionId"
        ).value =
            prescription.id;

        document.getElementById(
            "prescriptionDoctor"
        ).value =
            prescription.doctor || "";

        document.getElementById(
            "prescriptionDate"
        ).value =
            prescription.prescription_date
                ? prescription.prescription_date.substring(
                    0,
                    10
                )
                : "";

        document.getElementById(
            "prescriptionNotes"
        ).value =
            prescription.notes || "";

        const medicationContainer =
            document.getElementById(
                "medicationItems"
            );

        medicationContainer.innerHTML = "";

        const medications =
            Array.isArray(
                prescription.medications
            )
                ? prescription.medications
                : [];

        medications.forEach(
            medication => {

                const row =
                    document.createElement("tr");

                row.className =
                    "medication-item";

                row.innerHTML = `

                    <td>
                        <input
                            type="text"
                            class="medication-name"
                            value="${escapeHtml(
                                medication.medication_name || ""
                            )}"
                            required
                        >
                    </td>

                    <td>
                        <input
                            type="text"
                            class="medication-dose"
                            value="${escapeHtml(
                                medication.dose || ""
                            )}"
                        >
                    </td>

                    <td>
                        <input
                            type="text"
                            class="medication-route"
                            value="${escapeHtml(
                                medication.route || ""
                            )}"
                        >
                    </td>

                    <td>
                        <input
                            type="text"
                            class="medication-frequency"
                            value="${escapeHtml(
                                medication.frequency || ""
                            )}"
                        >
                    </td>

                    <td>
                        <input
                            type="text"
                            class="medication-duration"
                            value="${escapeHtml(
                                medication.duration || ""
                            )}"
                        >
                    </td>

                    <td>
                        <input
                            type="text"
                            class="medication-quantity"
                            value="${escapeHtml(
                                medication.quantity || ""
                            )}"
                        >
                    </td>

                    <td>
                        <button
                            type="button"
                            class="danger-btn remove-medication-btn"
                            onclick="removeMedicationItem(this)"
                        >
                            Remove
                        </button>
                    </td>

                `;

                medicationContainer.appendChild(
                    row
                );

            }
        );

        if (medications.length === 0) {

            addMedicationItem();

        }

        updateMedicationRemoveButtons();

        document.getElementById(
            "prescriptionFormModal"
        ).style.display =
            "flex";

    } catch (error) {

        console.error(
            "Error editing prescription:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}


// ==========================================
// DELETE PRESCRIPTION
// ==========================================

async function deletePrescription(
    id
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this prescription record?"
        );

    if (!confirmed) {
        return;
    }

    const token =
        getToken();

    if (!token) {

        handleSessionExpired();

        return;

    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/prescriptions/${id}`,
                {
                    method:
                        "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete prescription."
            );

            return;

        }

        showMessage(
            data.message ||
            "Prescription deleted successfully.",
            "success"
        );

        await loadPrescriptions(
            currentPatientId
        );

    } catch (error) {

        console.error(
            "Error deleting prescription:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}

/* =====================================================
   ADD CONSULTATION
===================================================== */

function openAddConsultationModal() {

    if (!currentPatientId) {

        alert(
            "Please open a patient profile first."
        );

        return;
    }


    const form =
        document.getElementById(
            "consultationForm"
        );


    form.reset();


    document.getElementById(
        "consultationFormTitle"
    ).textContent =
        "Add Consultation";


    document.getElementById(
        "consultationId"
    ).value =
        "";
currentConsultationId = null;

    document.getElementById(
        "consultationDate"
    ).value =
        getTodayDate();


    // ---------------------------------------------
    // Reset appointment dropdown
    // ---------------------------------------------

    const appointmentSelect =
        document.getElementById(
            "consultationAppointment"
        );


    if (appointmentSelect) {

        appointmentSelect.innerHTML = `
            <option value="">
                Loading appointments...
            </option>
        `;

    }


    // ---------------------------------------------
    // Open modal
    // ---------------------------------------------

    document.getElementById(
        "consultationFormModal"
    ).style.display =
        "flex";


    // ---------------------------------------------
    // Load patient's appointments
    // ---------------------------------------------

    loadConsultationAppointments(
        currentPatientId
    );

}

/* =====================================================
   LOAD APPOINTMENTS FOR CONSULTATION
===================================================== */

async function loadConsultationAppointments(patientId) {

    const select =
        document.getElementById(
            "consultationAppointment"
        );


    if (!select) {
        return;
    }


    const token =
        getToken();


    if (!token) {

        handleSessionExpired();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/appointments`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }


        const appointments =
            await response.json();


        if (!response.ok) {

            select.innerHTML = `
                <option value="">
                    Unable to load appointments
                </option>
            `;

            alert(
                appointments.message ||
                "Failed to load appointments."
            );

            return;
        }


        if (
            !Array.isArray(appointments) ||
            appointments.length === 0
        ) {

            select.innerHTML = `
                <option value="">
                    No appointments found
                </option>
            `;

            return;
        }


        // -----------------------------------------
        // Build appointment options
        // -----------------------------------------

        select.innerHTML = `
            <option value="">
                Select appointment
            </option>
        `;


        appointments.forEach(
            appointment => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    appointment.id;


                const date =
                    appointment.appointment_date
                        ? formatDate(
                            appointment.appointment_date
                        )
                        : "No date";


                const time =
                    appointment.appointment_time
                        ? formatTime(
                            appointment.appointment_time
                        )
                        : "No time";


                const doctor =
                    appointment.doctor ||
                    "Doctor not specified";


                const status =
                    appointment.status ||
                    "Pending";


                option.textContent =
                    `${date} - ${time} - ${doctor} (${status})`;


                select.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Load consultation appointments error:",
            error
        );


        select.innerHTML = `
            <option value="">
                Unable to load appointments
            </option>
        `;

    }

}

/* =====================================================
   CLOSE CONSULTATION FORM
===================================================== */

function closeConsultationFormModal() {

    document.getElementById(
        "consultationFormModal"
    ).style.display =
        "none";

}


/* =====================================================
   SAVE CONSULTATION
===================================================== */

document
    .getElementById(
        "consultationForm"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const token =
                getToken();


            if (!token) {

                handleSessionExpired();

                return;

            }


            if (
                !currentPatientId
            ) {

                alert(
                    "No patient selected."
                );

                return;

            }


            const consultationId =
                document.getElementById(
                    "consultationId"
                ).value;


            const appointmentSelect =
    document.getElementById(
        "consultationAppointment"
    );


const appointmentId =
    appointmentSelect
        ? appointmentSelect.value
        : "";


if (!appointmentId) {

    alert(
        "Please select an appointment before saving the consultation."
    );

    return;

}


const consultationData = {

    appointment_id:
        appointmentId,

    doctor:
        document.getElementById(
            "consultationDoctor"
        ).value.trim(),

                consultation_date:
                    document.getElementById(
                        "consultationDate"
                    ).value,

                chief_complaint:
                    document.getElementById(
                        "chiefComplaint"
                    ).value.trim(),

                history_of_presenting_complaint:
                    document.getElementById(
                        "historyOfPresentingComplaint"
                    ).value.trim(),

                past_medical_history:
                    document.getElementById(
                        "pastMedicalHistory"
                    ).value.trim(),

                drug_allergy_history:
                    document.getElementById(
                        "drugAllergyHistory"
                    ).value.trim(),

                family_history:
                    document.getElementById(
                        "familyHistory"
                    ).value.trim(),

                social_history:
                    document.getElementById(
                        "socialHistory"
                    ).value.trim(),

                systems_review:
                    document.getElementById(
                        "systemsReview"
                    ).value.trim(),

                summary:
                    document.getElementById(
                        "consultationSummary"
                    ).value.trim(),

                examination:
                    document.getElementById(
                        "examination"
                    ).value.trim(),

                investigations:
                    document.getElementById(
                        "investigations"
                    ).value.trim(),

                differential_diagnosis:
                    document.getElementById(
                        "differentialDiagnosis"
                    ).value.trim(),

                diagnosis:
                    document.getElementById(
                        "diagnosis"
                    ).value.trim(),

                management_plan:
                    document.getElementById(
                        "managementPlan"
                    ).value.trim(),

                treatment:
                    document.getElementById(
                        "treatment"
                    ).value.trim(),

                clinical_notes:
                    document.getElementById(
                        "clinicalNotes"
                    ).value.trim(),

                follow_up_date:
                    document.getElementById(
                        "followUpDate"
                    ).value

            };


            const url =
                consultationId
                    ? `${API_URL}/api/consultations/${consultationId}`
                    : `${API_URL}/api/patients/${currentPatientId}/consultations`;


            const method =
                consultationId
                    ? "PUT"
                    : "POST";


            try {

                const response =
                    await fetch(
                        url,
                        {
                            method,

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify(
                                    consultationData
                                )

                        }
                    );


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    handleSessionExpired();

                    return;

                }


                const data =
                    await response.json();


                if (
                    !response.ok
                ) {

                    console.error(
                        "Consultation save error:",
                        data
                    );

                    alert(
                        data.message ||
                        "Failed to save consultation."
                    );

                    return;

                }

if (data.id) {

    setActiveConsultationId(
        data.id
    );


    console.log(
        "Current consultation set to:",
        currentConsultationId
    );
}
                showMessage(
                    data.message ||
                    "Consultation saved successfully.",
                    "success"
                );


                closeConsultationFormModal();


                await loadConsultations(
                    currentPatientId
                );


            } catch (error) {

                console.error(
                    "Save consultation error:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

/* =====================================================
   VIEW CONSULTATION
===================================================== */

async function viewConsultation(
    id
) {

    // ---------------------------------------------
    // Validate ID
    // ---------------------------------------------

    const consultationId =
        Number(id);


    if (
        !consultationId ||
        consultationId <= 0
    ) {

        console.error(
            "Invalid consultation ID:",
            id
        );

        alert(
            "Invalid consultation."
        );

        return;
    }


    // ---------------------------------------------
    // IMPORTANT:
    // Set global consultation immediately
    // ---------------------------------------------

    currentConsultationId =
        consultationId;


    console.log(
        "VIEW CONSULTATION → currentConsultationId:",
        currentConsultationId
    );


    // ---------------------------------------------
    // Store in hidden consultation field
    // ---------------------------------------------

    const consultationField =
        document.getElementById(
            "consultationId"
        );


    if (consultationField) {

        consultationField.value =
            consultationId;

    }


    const token =
        getToken();


    if (!token) {

        handleSessionExpired();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/consultations/${consultationId}`,
                {
                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }


        const consultation =
            await response.json();


        if (!response.ok) {

            alert(
                consultation.message ||
                "Unable to load consultation."
            );

            return;

        }


        // -----------------------------------------
        // IMPORTANT:
        // Set it AGAIN from server response
        // -----------------------------------------

       if (consultation && consultation.id) {

    setActiveConsultationId(
        consultation.id
    );

    console.log(
        "ACTIVE CONSULTATION CONFIRMED:",
        currentConsultationId
    );
}


        const finalConsultationId =
            currentConsultationId;


        console.log(
            "VIEW CONSULTATION → confirmed ID:",
            finalConsultationId
        );


        // -----------------------------------------
        // Keep hidden field synchronized
        // -----------------------------------------

        if (consultationField) {

            consultationField.value =
                finalConsultationId;

        }


        // -----------------------------------------
        // Doctor
        // -----------------------------------------

        setText(
            "viewConsultationDoctor",
            consultation.doctor ||
            "Not provided"
        );


        // -----------------------------------------
        // Date
        // -----------------------------------------

        setText(
            "viewConsultationDate",
            consultation.consultation_date
                ? formatDate(
                    consultation.consultation_date
                )
                : "Not provided"
        );


        // -----------------------------------------
        // Clinical information
        // -----------------------------------------

        setText(
            "viewChiefComplaint",
            consultation.chief_complaint ||
            "Not recorded"
        );


        setText(
            "viewHistoryOfPresentingComplaint",
            consultation.history_of_presenting_complaint ||
            "Not recorded"
        );


        setText(
            "viewPastMedicalHistory",
            consultation.past_medical_history ||
            "Not recorded"
        );


        setText(
            "viewDrugAllergyHistory",
            consultation.drug_allergy_history ||
            "Not recorded"
        );


        setText(
            "viewFamilyHistory",
            consultation.family_history ||
            "Not recorded"
        );


        setText(
            "viewSocialHistory",
            consultation.social_history ||
            "Not recorded"
        );


        setText(
            "viewSystemsReview",
            consultation.systems_review ||
            "Not recorded"
        );


        setText(
            "viewSummary",
            consultation.summary ||
            "Not recorded"
        );


        setText(
            "viewExamination",
            consultation.examination ||
            "Not recorded"
        );


        setText(
            "viewInvestigations",
            consultation.investigations ||
            "Not recorded"
        );


        setText(
            "viewDifferentialDiagnosis",
            consultation.differential_diagnosis ||
            "Not recorded"
        );


        setText(
            "viewDiagnosis",
            consultation.diagnosis ||
            "Not recorded"
        );


        setText(
            "viewManagementPlan",
            consultation.management_plan ||
            "Not recorded"
        );


        setText(
            "viewTreatment",
            consultation.treatment ||
            "Not recorded"
        );


        setText(
            "viewClinicalNotes",
            consultation.clinical_notes ||
            "Not recorded"
        );


        setText(
            "viewFollowUpDate",
            consultation.follow_up_date
                ? formatDate(
                    consultation.follow_up_date
                )
                : "No follow-up scheduled"
        );


        // -----------------------------------------
        // Open consultation modal
        // -----------------------------------------

        const modal =
            document.getElementById(
                "viewConsultationModal"
            );


        if (modal) {

            modal.style.display =
                "flex";

        }


        // -----------------------------------------
        // Final verification
        // -----------------------------------------

        console.log(
            "CONSULTATION OPENED SUCCESSFULLY. ID:",
            currentConsultationId
        );


    } catch (error) {

        console.error(
            "View consultation error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}

/* =====================================================
   SAFE TEXT SETTER
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }
}

/* =====================================================
   SAFE TEXT SETTER
===================================================== */

/* =====================================================
   EDIT CONSULTATION
===================================================== */

async function editConsultation(
    id
) {

    const token =
        getToken();


    if (!token) {

        handleSessionExpired();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/consultations/${id}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }


        const consultation =
            await response.json();


        if (
            !response.ok
        ) {

            alert(
                consultation.message ||
                "Unable to load consultation."
            );

            return;

        }


        document.getElementById(
            "consultationFormTitle"
        ).textContent =
            "Edit Consultation";


       document.getElementById(
    "consultationId"
).value =
    consultation.id;


setActiveConsultationId(consultation.id);


// ---------------------------------------------
// Load patient's appointments
// ---------------------------------------------

await loadConsultationAppointments(
    consultation.patient_id
);


// ---------------------------------------------
// Select the appointment linked to this
// consultation
// ---------------------------------------------

const appointmentSelect =
    document.getElementById(
        "consultationAppointment"
    );


if (appointmentSelect) {

    appointmentSelect.value =
        consultation.appointment_id
            ? String(
                consultation.appointment_id
            )
            : "";

}


setInput(
    "consultationDoctor",
    consultation.doctor
);


        setInputDate(
            "consultationDate",
            consultation.consultation_date
        );


        setInput(
            "chiefComplaint",
            consultation.chief_complaint
        );


        setInput(
            "historyOfPresentingComplaint",
            consultation.history_of_presenting_complaint
        );


        setInput(
            "pastMedicalHistory",
            consultation.past_medical_history
        );


        setInput(
            "drugAllergyHistory",
            consultation.drug_allergy_history
        );


        setInput(
            "familyHistory",
            consultation.family_history
        );


        setInput(
            "socialHistory",
            consultation.social_history
        );


        setInput(
            "systemsReview",
            consultation.systems_review
        );


        setInput(
            "consultationSummary",
            consultation.summary
        );


        setInput(
            "examination",
            consultation.examination
        );


        setInput(
            "investigations",
            consultation.investigations
        );


        setInput(
            "differentialDiagnosis",
            consultation.differential_diagnosis
        );


        setInput(
            "diagnosis",
            consultation.diagnosis
        );


        setInput(
            "managementPlan",
            consultation.management_plan
        );


        setInput(
            "treatment",
            consultation.treatment
        );



        setInput(
            "clinicalNotes",
            consultation.clinical_notes
        );


        setInputDate(
            "followUpDate",
            consultation.follow_up_date
        );


        document.getElementById(
            "consultationFormModal"
        ).style.display =
            "flex";


    } catch (error) {

        console.error(
            "Edit consultation error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}


/* =====================================================
   SET INPUT
===================================================== */

function setInput(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );

    if (element) {

        element.value =
            value || "";

    }

}


/* =====================================================
   SET DATE INPUT
===================================================== */

function setInputDate(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    if (!value) {

        element.value =
            "";

        return;

    }


    element.value =
        String(value).substring(
            0,
            10
        );

}


/* =====================================================
   DELETE CONSULTATION
===================================================== */

async function deleteConsultation(
    id
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this consultation record?"
        );


    if (!confirmed) {

        return;

    }


    const token =
        getToken();


    if (!token) {

        handleSessionExpired();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/consultations/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }


        const data =
            await response.json();


        if (
            !response.ok
        ) {

            alert(
                data.message ||
                "Failed to delete consultation."
            );

            return;

        }


        showMessage(
            data.message ||
            "Consultation deleted successfully.",
            "success"
        );


        await loadConsultations(
            currentPatientId
        );


    } catch (error) {

        console.error(
            "Delete consultation error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}


/* =====================================================
   EDIT PATIENT
===================================================== */

async function editPatient(
    id
) {

    const token =
        getToken();


    if (!token) {

        handleSessionExpired();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${id}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }


        const patient =
            await response.json();


        if (
            !response.ok
        ) {

            alert(
                patient.message ||
                "Unable to load patient."
            );

            return;

        }


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Patient";


        document.getElementById(
            "patientId"
        ).value =
            patient.id;


        setInput(
            "firstName",
            patient.first_name
        );

        setInput(
            "lastName",
            patient.last_name
        );

        setInput(
            "email",
            patient.email
        );

        setInput(
            "phone",
            patient.phone
        );


        setInputDate(
            "dateOfBirth",
            patient.date_of_birth
        );


        setInput(
            "gender",
            patient.gender
        );

        setInput(
            "address",
            patient.address
        );

        setInput(
            "medicalHistory",
            patient.medical_history
        );

        setInput(
            "allergies",
            patient.allergies
        );

        setInput(
            "medications",
            patient.medications
        );

        setInput(
            "notes",
            patient.notes
        );


        document.getElementById(
            "patientFormModal"
        ).style.display =
            "flex";


    } catch (error) {

        console.error(
            "Edit patient error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}


/* =====================================================
   DELETE PATIENT
===================================================== */

async function deletePatient(
    id
) {

    const patient =
        patients.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!patient) {

        alert(
            "Patient not found."
        );

        return;

    }


    const fullName =
        `${patient.first_name || ""} ${patient.last_name || ""}`
            .trim();


    const confirmed =
        confirm(
            `Are you sure you want to delete ${fullName}?`
        );


    if (!confirmed) {

        return;

    }


    const token =
        getToken();


    if (!token) {

        handleSessionExpired();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;

        }


        const data =
            await response.json();


        if (
            !response.ok
        ) {

            alert(
                data.message ||
                "Failed to delete patient."
            );

            return;

        }


        showMessage(
            data.message ||
            "Patient deleted successfully.",
            "success"
        );


        await loadPatients();


    } catch (error) {

        console.error(
            "Delete patient error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}


/* =====================================================
   CLOSE PATIENT VIEW
===================================================== */

function closeViewPatientModal() {

    document.getElementById(
        "viewPatientModal"
    ).style.display =
        "none";

}


/* =====================================================
   CLOSE CONSULTATION VIEW
===================================================== */

function closeViewConsultationModal() {

    document.getElementById(
        "viewConsultationModal"
    ).style.display =
        "none";

}


/* =====================================================
   CLOSE MODALS ON BACKDROP
===================================================== */

window.addEventListener(
    "click",
    function(event) {

        const patientFormModal =
            document.getElementById(
                "patientFormModal"
            );

        const patientViewModal =
            document.getElementById(
                "viewPatientModal"
            );

        const consultationFormModal =
            document.getElementById(
                "consultationFormModal"
            );

        const consultationViewModal =
            document.getElementById(
                "viewConsultationModal"
            );


        if (
            event.target ===
            patientFormModal
        ) {

            closePatientFormModal();

        }


        if (
            event.target ===
            patientViewModal
        ) {

            closeViewPatientModal();

        }


        if (
            event.target ===
            consultationFormModal
        ) {

            closeConsultationFormModal();

        }


        if (
            event.target ===
            consultationViewModal
        ) {

            closeViewConsultationModal();

        }

    }
);




/* =====================================================
   START
===================================================== */

/* =====================================================
   LABORATORY REQUEST HISTORY
===================================================== */

async function loadLaboratoryRequests(patientId) {

    const container =
        document.getElementById("labRequestsHistory");

    if (!container || !patientId) {
        return;
    }

    container.innerHTML = `
        <div class="lab-request-loading">
            <div class="loading-spinner"></div>
            <span>Loading laboratory requests...</span>
        </div>
    `;

    try {

        const token = getToken();

        const response = await fetch(
            `${API_URL}/api/patients/${patientId}/lab-requests`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleSessionExpired();

            return;
        }


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load laboratory requests."
            );
        }


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            container.innerHTML = `
                <div class="lab-request-empty">

                    <div class="lab-request-empty-icon">
                        ??
                    </div>

                    <h4>
                        No Laboratory Requests
                    </h4>

                    <p>
                        No laboratory investigations have
                        been requested for this patient.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML =
            data.map(
                (request, index) => {

                    const signature =
                        request.electronic_signature
                            ? String(
                                request.electronic_signature
                            ).trim()
                            : "";


                    const requestDate =
                        request.request_date
                            ? formatDate(
                                request.request_date
                            )
                            : "Not provided";


                    const createdDate =
                        request.created_at
                            ? formatDate(
                                request.created_at
                            )
                            : "";


                    const investigations =
                        request.requested_tests
                            ? String(
                                request.requested_tests
                            )
                            .split(",")
                            .map(
                                test => test.trim()
                            )
                            .filter(Boolean)
                            : [];


                    return `
                        <div
                            class="lab-request-card"
                            data-request-id="${Number(request.id)}"
                        >

                            <!-- HEADER -->
                            <div class="lab-request-card-header">

                                <div class="lab-request-title">

                                    <div class="lab-request-icon">
                                        ??
                                    </div>

                                    <div>

                                        <h4>
                                            Laboratory Request
                                        </h4>

                                        <div class="lab-request-id">
                                            Request #${Number(request.id)}
                                        </div>

                                    </div>

                                </div>


                                <div class="lab-request-date">

                                    <span class="lab-request-date-label">
                                        Requested
                                    </span>

                                    <strong>
                                        ${escapeHtml(
                                            requestDate
                                        )}
                                    </strong>

                                </div>

                            </div>


                            <!-- BODY -->
                            <div class="lab-request-card-body">


                                <!-- INVESTIGATIONS -->
                                <div class="lab-request-field lab-request-investigations">

                                    <div class="lab-request-field-label">
                                        <span class="field-icon">â€¢</span>
                                        Requested Investigations
                                    </div>


                                    <div class="lab-request-tests">

                                        ${
                                            investigations.length
                                            ?
                                            investigations
                                                .map(
                                                    test => `
                                                        <span class="lab-test-badge">
                                                            ${escapeHtml(test)}
                                                        </span>
                                                    `
                                                )
                                                .join("")
                                            :
                                            `
                                                <span class="lab-request-muted">
                                                    No investigations recorded
                                                </span>
                                            `
                                        }

                                    </div>

                                </div>


                                <!-- DETAILS GRID -->
                                <div class="lab-request-details-grid">


                                    <div class="lab-request-field">

                                        <div class="lab-request-field-label">
                                            <span class="field-icon">â€¢</span>
                                            Requested By
                                        </div>

                                        <div class="lab-request-field-value">
                                            ${escapeHtml(
                                                request.requested_by ||
                                                "Not provided"
                                            )}
                                        </div>

                                    </div>


                                    <div class="lab-request-field">

                                        <div class="lab-request-field-label">
                                            <span class="field-icon">â€¢</span>
                                            Request Date
                                        </div>

                                        <div class="lab-request-field-value">
                                            ${escapeHtml(
                                                requestDate
                                            )}
                                        </div>

                                    </div>


                                    <div class="lab-request-field lab-request-clinical-info">

                                        <div class="lab-request-field-label">
                                            <span class="field-icon">â€¢</span>
                                            Clinical Information
                                        </div>

                                        <div class="lab-request-field-value">

                                            ${
                                                request.clinical_information
                                                ?
                                                escapeHtml(
                                                    request.clinical_information
                                                )
                                                :
                                                `
                                                    <span class="lab-request-muted">
                                                        No clinical information provided
                                                    </span>
                                                `
                                            }

                                        </div>

                                    </div>


                                </div>


                                <!-- ELECTRONIC SIGNATURE -->
                                <div class="lab-request-signature-section">

                                    <div class="lab-request-field-label">
                                        <span class="field-icon">â€¢</span>
                                        Electronic Signature
                                    </div>


                                    ${
                                        signature
                                        ?
                                        `
                                            <div class="lab-request-signature">

                                                <img
                                                    src="${signature}"
                                                    alt="Electronic signature"
                                                >

                                                <div class="lab-request-signature-status">
                                                    ? Electronically signed
                                                </div>

                                            </div>
                                        `
                                        :
                                        `
                                            <div class="lab-request-no-signature">
                                                <span>
                                                    No electronic signature provided
                                                </span>
                                            </div>
                                        `
                                    }

                                </div>


                            </div>


                            <!-- FOOTER -->
                            <div class="lab-request-card-footer">

                                <div class="lab-request-created">

                                    ${
                                        createdDate
                                        ?
                                        `Created ${escapeHtml(createdDate)}`
                                        :
                                        ""
                                    }

                                </div>


                                <div class="lab-request-actions">

                                    <button
                                        type="button"
                                        class="lab-request-print-btn"
                                        onclick="printSavedLabRequest(${Number(request.id)})"
                                    >
                                        ?? Print
                                    </button>


                                    <button
                                        type="button"
                                        class="lab-request-delete-btn"
                                        onclick="deleteLaboratoryRequest(${Number(request.id)})"
                                    >
                                        ?? Delete
                                    </button>

                                </div>

                            </div>

                        </div>
                    `;

                }
            )
            .join("");


    } catch (error) {

        console.error(
            "Load laboratory requests error:",
            error
        );


        container.innerHTML = `
            <div class="lab-request-error">

                <strong>
                    Unable to load laboratory requests
                </strong>

                <span>
                    ${escapeHtml(
                        error.message ||
                        "Please try again."
                    )}
                </span>

            </div>
        `;
    }
}

/* =====================================================
   LABORATORY RESULTS
===================================================== */


async function deleteLaboratoryRequest(id) {

    if (!id) {
        console.error("Delete laboratory request: missing ID.");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete this laboratory request?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const token = getToken();

        const response = await fetch(
            `${API_URL}/api/lab-requests/${Number(id)}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json().catch(() => ({}));

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete laboratory request."
            );
        }

        /*
         * Remove the deleted request from the screen immediately.
         */
        const deletedCard =
            document.querySelector(
                `.lab-request-card[data-request-id="${Number(id)}"]`
            );

        if (deletedCard) {
            deletedCard.remove();
        }

        /*
         * If there are no requests left,
         * show the normal empty state.
         */
        const container =
            document.getElementById("labRequestsHistory");

        if (
            container &&
            !container.querySelector(".lab-request-card")
        ) {

            container.innerHTML = `
                <div class="lab-request-empty">

                    <div class="lab-request-empty-icon">
                        ??
                    </div>

                    <h4>
                        No Laboratory Requests
                    </h4>

                    <p>
                        No laboratory investigations have
                        been requested for this patient.
                    </p>

                </div>
            `;
        }

        alert(
            data.message ||
            "Laboratory request deleted successfully."
        );

    } catch (error) {

        console.error(
            "Delete laboratory request error:",
            error
        );

        alert(
            error.message ||
            "Failed to delete laboratory request."
        );
    }
}

async function loadLaboratoryResults(patientId) {

    const container =
        document.getElementById("labResultsHistory");

    if (!container || !patientId) {
        return;
    }

    container.innerHTML =
        '<div class="loading">Loading laboratory results...</div>';

    try {

        const response = await fetch(
            `${API_URL}/api/patients/${patientId}/labs`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to load laboratory results (${response.status})`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    No laboratory results recorded.
                </div>
            `;

            return;
        }

        container.innerHTML = data.map(lab => `

            <div class="clinical-record-card">

                <div class="clinical-record-header">

                    <strong>
                        ${escapeHtml(lab.test_name || "Laboratory Test")}
                    </strong>

                    <span>
                        ${escapeHtml(lab.status || "Final")}
                    </span>

                </div>

                <div class="clinical-record-body">

                    <p>
                        <strong>Result:</strong>
                        ${escapeHtml(lab.result_value || "?")}
                    </p>

                    <p>
                        <strong>Unit:</strong>
                        ${escapeHtml(lab.unit || "?")}
                    </p>

                    <p>
                        <strong>Reference Range:</strong>
                        ${escapeHtml(lab.reference_range || "?")}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${escapeHtml(lab.result_date || "?")}
                    </p>

                    <p>
                        <strong>Notes:</strong>
                        ${escapeHtml(lab.notes || "?")}
                    </p>

                    <div style="margin-top:10px;">

                        <button
                            type="button"
                            class="primary-btn"
                            onclick="openEditLabResultModal(${lab.id})"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="danger-btn"
                            onclick="deleteLaboratoryResult(${lab.id})"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>

        `).join("");

    } catch (error) {

        console.error(
            "Load laboratory results error:",
            error
        );

        container.innerHTML = `
            <div class="error-message">
                Unable to load laboratory results.
            </div>
        `;
    }
}


/* =====================================================
   OPEN ADD LAB RESULT MODAL
===================================================== */

function openAddLabResultModal() {

    if (!currentPatientId) {

        alert(
            "Please open a patient profile first."
        );

        return;
    }

    const modal =
        document.getElementById("labResultModal");

    const form =
        document.getElementById("labResultForm");

    if (!modal || !form) {

        console.error(
            "Laboratory result modal or form not found."
        );

        return;
    }

    form.reset();

    const idField =
        document.getElementById("labResultId");

    if (idField) {
        idField.value = "";
    }

    const title =
        document.getElementById("labResultFormTitle");

    if (title) {
        title.textContent = "Add Laboratory Result";
    }

    const dateField =
        document.getElementById("labResultDate");

    if (dateField) {

        const today =
            new Date().toISOString().split("T")[0];

        dateField.value = today;
    }

    modal.style.display = "flex";
}


/* =====================================================
   CLOSE LAB RESULT MODAL
===================================================== */

function closeLabResultModal() {

    const modal =
        document.getElementById("labResultModal");

    if (modal) {
        modal.style.display = "none";
    }
}


/* =====================================================
   EDIT LAB RESULT
===================================================== */

async function openEditLabResultModal(id) {

    try {

        const response = await fetch(
            `${API_URL}/api/patients/${currentPatientId}/labs`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to load laboratory result (${response.status})`
            );
        }

        const results = await response.json();

        const lab =
            results.find(item => Number(item.id) === Number(id));

        if (!lab) {

            alert(
                "Laboratory result not found."
            );

            return;
        }

        const modal =
            document.getElementById("labResultModal");

        const title =
            document.getElementById("labResultFormTitle");

        if (title) {
            title.textContent = "Edit Laboratory Result";
        }

        document.getElementById("labResultId").value =
            lab.id || "";

        document.getElementById("labTestName").value =
            lab.test_name || "";

        document.getElementById("labResultValue").value =
            lab.result_value || "";

        document.getElementById("labResultUnit").value =
            lab.unit || "";

        document.getElementById("labReferenceRange").value =
            lab.reference_range || "";

        document.getElementById("labResultDate").value =
            lab.result_date
                ? String(lab.result_date).substring(0, 10)
                : "";

        document.getElementById("labResultStatus").value =
            lab.status || "Final";

        document.getElementById("labResultNotes").value =
            lab.notes || "";

        modal.style.display = "flex";

    } catch (error) {

        console.error(
            "Open laboratory result error:",
            error
        );

        alert(
            "Unable to load laboratory result."
        );
    }
}


/* =====================================================
   SAVE LABORATORY RESULT
===================================================== */

const labResultForm =
    document.getElementById("labResultForm");

if (labResultForm) {

    labResultForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            if (!currentPatientId) {

                alert(
                    "Please open a patient profile first."
                );

                return;
            }

            const id =
                document.getElementById("labResultId")?.value || "";

            const payload = {

                test_name:
                    document.getElementById("labTestName")?.value.trim() || "",

                result_value:
                    document.getElementById("labResultValue")?.value.trim() || "",

                unit:
                    document.getElementById("labResultUnit")?.value.trim() || "",

                reference_range:
                    document.getElementById("labReferenceRange")?.value.trim() || "",

                result_date:
                    document.getElementById("labResultDate")?.value || null,

                status:
                    document.getElementById("labResultStatus")?.value || "Final",

                notes:
                    document.getElementById("labResultNotes")?.value.trim() || ""

            };

            if (!payload.test_name) {

                alert(
                    "Please enter the laboratory test name."
                );

                return;
            }

            const saveButton =
                labResultForm.querySelector(
                    'button[type="submit"]'
                );

            if (saveButton) {
                saveButton.disabled = true;
                saveButton.textContent = "Saving...";
            }

            try {

                const url = id
                    ? `${API_URL}/api/labs/${id}`
                    : `${API_URL}/api/patients/${currentPatientId}/labs`;

                const response = await fetch(
                    url,
                    {
                        method: id ? "PUT" : "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(payload)
                    }
                );

                const responseText =
                    await response.text();

                let data = {};

                if (responseText) {

                    try {
                        data = JSON.parse(responseText);
                    } catch (parseError) {

                        console.error(
                            "Server returned non-JSON response:",
                            responseText
                        );

                        throw new Error(
                            `Server returned an invalid response (${response.status}).`
                        );
                    }
                }

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        `Failed to save laboratory result (${response.status}).`
                    );
                }

                closeLabResultModal();

                await loadLaboratoryResults(
                    currentPatientId
                );

                alert(
                    id
                        ? "Laboratory result updated successfully."
                        : "Laboratory result saved successfully."
                );

            } catch (error) {

                console.error(
                    "Save laboratory result error:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to save laboratory result."
                );

            } finally {

                if (saveButton) {
                    saveButton.disabled = false;
                    saveButton.textContent =
                        "Save Laboratory Result";
                }
            }

        }
    );
}


/* =====================================================
   DELETE LABORATORY RESULT
===================================================== */

async function deleteLaboratoryResult(id) {

    if (
        !confirm(
            "Are you sure you want to delete this laboratory result?"
        )
    ) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/labs/${id}`,
            {
                method: "DELETE"
            }
        );

        const responseText =
            await response.text();

        let data = {};

        if (responseText) {

            try {
                data = JSON.parse(responseText);
            } catch (error) {
                console.error(
                    "Invalid delete response:",
                    responseText
                );
            }
        }

        if (!response.ok) {

            throw new Error(
                data.message ||
                `Failed to delete laboratory result (${response.status}).`
            );
        }

        await loadLaboratoryResults(
            currentPatientId
        );

        alert(
            "Laboratory result deleted successfully."
        );

    } catch (error) {

        console.error(
            "Delete laboratory result error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete laboratory result."
        );
    }
}


/* =====================================================
   CLOSE LAB RESULT MODAL ON BACKDROP
===================================================== */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById("labResultModal");

        if (
            modal &&
            event.target === modal
        ) {
            closeLabResultModal();
        }

    }
);



/* =====================================================
   LABORATORY REPORT PANELS
===================================================== */

async function loadLaboratoryReports(patientId) {

    const container =
        document.getElementById("labResultsHistory");

    if (!container || !patientId) {
        return;
    }

    container.innerHTML =
        '<div class="loading">Loading laboratory results...</div>';

    try {

        const response = await fetch(
            `${API_URL}/api/patients/${patientId}/lab-reports`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to load laboratory reports (${response.status})`
            );
        }

        const reports = await response.json();

        if (!Array.isArray(reports) || reports.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    No laboratory results recorded.
                </div>
            `;

            return;
        }

        container.innerHTML = reports.map(report => {

            const parameters =
                Array.isArray(report.parameters)
                    ? report.parameters
                    : [];

            return `
                <div class="lab-report-card">

                    <div class="lab-report-header">

                        <div>
                            <div class="lab-report-date">Date: ${escapeHtml(report.result_date ? new Date(report.result_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A")}</div><h4>
                                ${escapeHtml(
                                    report.test_name ||
                                    "Laboratory Report"
                                )}
                            </h4><div class="lab-report-meta"><span>
                                    Status:
                                    ${escapeHtml(
                                        report.status || "Final"
                                    )}
                                </span>

                                ${
                                    report.recorded_by
                                    ? `
                                    <span>
                                        Recorded by:
                                        ${escapeHtml(
                                            report.recorded_by
                                        )}
                                    </span>
                                    `
                                    : ""
                                }
                            </div>
                        </div>

                        <button
                            type="button"
                            class="danger-btn"
                            onclick="deleteLaboratoryReport(${report.id})"
                        >
                            Delete Report
                        </button>

                    </div>


                    <div class="lab-table-wrapper">

                        <table class="lab-results-table">

                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Result</th>
                                    <th>Unit</th>
                                    <th>Flag</th>
                                    <th>Reference Range</th>
                                </tr>
                            </thead>

                            <tbody>

                                ${
                                    parameters.length
                                    ?
                                    parameters.map(parameter => `

                                        <tr>

                                            <td>
                                                ${escapeHtml(
                                                    parameter.parameter_name ||
                                                    "?"
                                                )}
                                            </td>

                                            <td class="lab-result-value">
                                                ${escapeHtml(
                                                    parameter.result_value ||
                                                    "?"
                                                )}
                                            </td>

                                            <td>
                                                ${escapeHtml(
                                                    parameter.unit ||
                                                    "?"
                                                )}
                                            </td>

                                            <td>
                                                <span class="
                                                    lab-flag
                                                    ${
                                                        String(
                                                            parameter.flag || ""
                                                        )
                                                        .toLowerCase()
                                                        .replace(/\s+/g, "-")
                                                    }
                                                ">
                                                    ${escapeHtml(
                                                        parameter.flag ||
                                                        "?"
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                ${escapeHtml(
                                                    parameter.reference_range ||
                                                    "?"
                                                )}
                                            </td>

                                        </tr>

                                    `).join("")
                                    :
                                    `
                                    <tr>
                                        <td
                                            colspan="5"
                                            class="empty-state"
                                        >
                                            No parameters recorded.
                                        </td>
                                    </tr>
                                    `
                                }

                            </tbody>

                        </table>

                    </div>


                    ${
                        report.notes
                        ?
                        `
                        <div class="lab-report-notes">
                            <strong>Notes:</strong>
                            ${escapeHtml(report.notes)}
                        </div>
                        `
                        :
                        ""
                    }

                </div>
            `;

        }).join("");

    } catch (error) {

        console.error(
            "Load laboratory reports error:",
            error
        );

        container.innerHTML = `
            <div class="error-message">
                Unable to load laboratory results.
            </div>
        `;
    }
}


async function deleteLaboratoryReport(id) {

    if (!id) {
        return;
    }

    const confirmed = confirm(
        "Delete this laboratory report and all its parameters?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/lab-reports/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to delete laboratory report."
            );
        }

        showMessage(
            data.message ||
            "Laboratory report deleted successfully.",
            "success"
        );

        await loadLaboratoryReports(
            currentPatientId
        );

    } catch (error) {

        console.error(
            "Delete laboratory report error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete laboratory report."
        );
    }
}

// =====================================================
// LABORATORY REQUEST ELECTRONIC SIGNATURE
// =====================================================

let labSignatureCanvas = null;
let labSignatureContext = null;
let labSignatureDrawing = false;


// =====================================================
// INITIALIZE LABORATORY REQUEST SIGNATURE
// =====================================================

function initializeLabRequestSignature() {

    labSignatureCanvas =
        document.getElementById(
            "labRequestSignaturePad"
        );

    if (!labSignatureCanvas) {
        console.error(
            "Laboratory signature canvas not found."
        );
        return;
    }


    labSignatureContext =
        labSignatureCanvas.getContext("2d");


    // Clear canvas
    labSignatureContext.clearRect(
        0,
        0,
        labSignatureCanvas.width,
        labSignatureCanvas.height
    );


    // White background
    labSignatureContext.fillStyle = "#ffffff";

    labSignatureContext.fillRect(
        0,
        0,
        labSignatureCanvas.width,
        labSignatureCanvas.height
    );


    // Blue signature ink
    labSignatureContext.lineWidth = 2;

    labSignatureContext.lineCap = "round";

    labSignatureContext.lineJoin = "round";

    labSignatureContext.strokeStyle = "#2563EB";


    labSignatureDrawing = false;


    // -------------------------------------------------
    // Mouse events
    // -------------------------------------------------

    labSignatureCanvas.onmousedown =
        function (event) {

            labSignatureDrawing = true;

            labSignatureContext.beginPath();

            labSignatureContext.moveTo(
                event.offsetX,
                event.offsetY
            );
        };


    labSignatureCanvas.onmousemove =
        function (event) {

            if (!labSignatureDrawing) {
                return;
            }

            labSignatureContext.lineTo(
                event.offsetX,
                event.offsetY
            );

            labSignatureContext.stroke();
        };


    labSignatureCanvas.onmouseup =
        function () {

            labSignatureDrawing = false;

            labSignatureContext.closePath();

        };


    labSignatureCanvas.onmouseleave =
        function () {

            labSignatureDrawing = false;

        };


    // -------------------------------------------------
    // Touch events
    // -------------------------------------------------

    labSignatureCanvas.ontouchstart =
        function (event) {

            event.preventDefault();

            const rect =
                labSignatureCanvas.getBoundingClientRect();

            const touch =
                event.touches[0];

            const x =
                touch.clientX - rect.left;

            const y =
                touch.clientY - rect.top;


            labSignatureDrawing = true;

            labSignatureContext.beginPath();

            labSignatureContext.moveTo(
                x,
                y
            );
        };


    labSignatureCanvas.ontouchmove =
        function (event) {

            event.preventDefault();

            if (!labSignatureDrawing) {
                return;
            }

            const rect =
                labSignatureCanvas.getBoundingClientRect();

            const touch =
                event.touches[0];

            const x =
                touch.clientX - rect.left;

            const y =
                touch.clientY - rect.top;


            labSignatureContext.lineTo(
                x,
                y
            );

            labSignatureContext.stroke();
        };


    labSignatureCanvas.ontouchend =
        function (event) {

            event.preventDefault();

            labSignatureDrawing = false;

            labSignatureContext.closePath();

        };


    // -------------------------------------------------
    // Signature status
    // -------------------------------------------------

    const status =
        document.getElementById(
            "labRequestSignatureStatus"
        );

    if (status) {

        status.textContent =
            "Signature not provided";

    }
}


// =====================================================
// CLEAR LABORATORY REQUEST SIGNATURE
// =====================================================

function clearLabRequestSignature() {

    if (
        !labSignatureCanvas ||
        !labSignatureContext
    ) {
        initializeLabRequestSignature();
        return;
    }


    labSignatureContext.clearRect(
        0,
        0,
        labSignatureCanvas.width,
        labSignatureCanvas.height
    );


    // Restore white background
    labSignatureContext.fillStyle =
        "#ffffff";

    labSignatureContext.fillRect(
        0,
        0,
        labSignatureCanvas.width,
        labSignatureCanvas.height
    );


    // Restore blue ink
    labSignatureContext.strokeStyle =
        "#2563EB";


    const status =
        document.getElementById(
            "labRequestSignatureStatus"
        );

    if (status) {

        status.textContent =
            "Signature not provided";

    }
}

/* =====================================================
   LABORATORY REPORT PANEL FUNCTIONS
===================================================== */
  
// =====================================================
// LABORATORY REQUEST
// =====================================================


/* =====================================================
   OPEN LABORATORY REQUEST MODAL
===================================================== */

function openAddLabRequestModal(
    consultationId = null
) {


    // -------------------------------------------------
    // Patient must be selected
    // -------------------------------------------------

    if (!currentPatientId) {

        alert(
            "Please open a patient profile first."
        );

        return;
    }


    // -------------------------------------------------
    // 1. Use supplied consultation ID if available
    // -------------------------------------------------

    if (
        consultationId !== null &&
        consultationId !== undefined &&
        consultationId !== ""
    ) {

        currentConsultationId =
            Number(consultationId);

    }


    // -------------------------------------------------
    // 2. Recover consultation ID from hidden field
    // -------------------------------------------------

    if (
        !currentConsultationId ||
        Number.isNaN(
            Number(currentConsultationId)
        )
    ) {

        const consultationField =
            document.getElementById(
                "consultationId"
            );


        if (
            consultationField &&
            consultationField.value
        ) {

            currentConsultationId =
                Number(
                    consultationField.value
                );

        }

    }


    // -------------------------------------------------
    // 3. Final consultation check
    // -------------------------------------------------

    if (
        !currentConsultationId ||
        Number.isNaN(
            Number(currentConsultationId)
        )
    ) {

        alert(
            "Please open a consultation before creating a laboratory request."
        );

        return;
    }


    // -------------------------------------------------
    // Normalize consultation ID
    // -------------------------------------------------

    currentConsultationId =
        Number(currentConsultationId);


    console.log(
        "Lab request consultation ID:",
        currentConsultationId
    );


    // -------------------------------------------------
    // Find modal
    // -------------------------------------------------

    const modal =
        document.getElementById(
            "labRequestModal"
        );


    if (!modal) {

        console.error(
            "Laboratory Request modal not found."
        );

        return;
    }


    // -------------------------------------------------
    // Clear previous test selections
    // -------------------------------------------------

    document
        .querySelectorAll(
            ".lab-request-test"
        )
        .forEach(
            function (checkbox) {

                checkbox.checked =
                    false;

            }
        );


    // -------------------------------------------------
    // Clear form fields
    // -------------------------------------------------

    const otherTest =
        document.getElementById(
            "labRequestOtherTest"
        );


    const clinicalInformation =
        document.getElementById(
            "labRequestClinicalInformation"
        );


    const requestedBy =
        document.getElementById(
            "labRequestRequestedBy"
        );


    if (otherTest) {

        otherTest.value = "";

    }


    if (clinicalInformation) {

        clinicalInformation.value = "";

    }


    if (requestedBy) {

        requestedBy.value = "";

    }


    // -------------------------------------------------
    // Initialize electronic signature
    // -------------------------------------------------

    if (
        typeof initializeLabRequestSignature ===
        "function"
    ) {

        initializeLabRequestSignature();

    }


    // -------------------------------------------------
    // Clear electronic signature
    // -------------------------------------------------

    if (
        typeof clearLabRequestSignature ===
        "function"
    ) {

        clearLabRequestSignature();

    }


    // -------------------------------------------------
    // Patient ID
    // -------------------------------------------------

    const patientIdField =
        document.getElementById(
            "labRequestPatientId"
        );


    if (patientIdField) {

        patientIdField.textContent =
            currentPatientId;

    }


    // -------------------------------------------------
    // Patient name
    // -------------------------------------------------

    const patientName =
        document.getElementById(
            "viewName"
        );


    const patientNameField =
        document.getElementById(
            "labRequestPatientName"
        );


    if (patientNameField) {

        patientNameField.textContent =
            patientName
                ? patientName.textContent.trim()
                : "?";

    }


    // -------------------------------------------------
    // Date of birth
    // -------------------------------------------------

    const dob =
        document.getElementById(
            "viewDateOfBirth"
        );


    const dobField =
        document.getElementById(
            "labRequestPatientDob"
        );


    if (dobField) {

        dobField.textContent =
            dob
                ? dob.textContent.trim()
                : "?";

    }


    // -------------------------------------------------
    // Gender
    // -------------------------------------------------

    const gender =
        document.getElementById(
            "viewGender"
        );


    const genderField =
        document.getElementById(
            "labRequestPatientGender"
        );


    if (genderField) {

        genderField.textContent =
            gender
                ? gender.textContent.trim()
                : "?";

    }


    // -------------------------------------------------
    // Current date
    // -------------------------------------------------

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const dateDisplay =
        document.getElementById(
            "labRequestDateDisplay"
        );


    const signatureDate =
        document.getElementById(
            "labRequestSignatureDate"
        );


    if (dateDisplay) {

        dateDisplay.textContent =
            today;

    }


    if (signatureDate) {

        signatureDate.textContent =
            today;

    }


    // -------------------------------------------------
    // Store consultation ID in hidden field
    // -------------------------------------------------

    const labConsultationField =
        document.getElementById(
            "labRequestConsultationId"
        );


    if (labConsultationField) {

        labConsultationField.value =
            currentConsultationId;

    }


    // -------------------------------------------------
    // Also synchronize main consultation field
    // -------------------------------------------------

    const consultationField =
        document.getElementById(
            "consultationId"
        );


    if (consultationField) {

        consultationField.value =
            currentConsultationId;

    }


    // -------------------------------------------------
    // Open modal
    // -------------------------------------------------

    modal.style.display =
        "block";


    console.log(
        "Laboratory Request opened successfully. Consultation ID:",
        currentConsultationId
    );

}


/* =====================================================
   CLOSE LABORATORY REQUEST MODAL
===================================================== */

function closeLabRequestModal() {

    const modal =
        document.getElementById(
            "labRequestModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// =====================================================
// SAVE LABORATORY REQUEST
// Includes electronic signature
// =====================================================

async function saveLabRequest() {

    // -------------------------------------------------
    // Make sure a patient is open
    // -------------------------------------------------

    if (!currentPatientId) {

        alert(
            "Please open a patient profile first."
        );

        return;
    }


    // -------------------------------------------------
    // Collect selected laboratory investigations
    // -------------------------------------------------

    const selectedTests = [];

    document
        .querySelectorAll(
            ".lab-request-test:checked"
        )
        .forEach(
            function (checkbox) {

                selectedTests.push(
                    checkbox.value
                );

            }
        );


    // -------------------------------------------------
    // Add "Other Investigation"
    // -------------------------------------------------

    const otherTest =
        document.getElementById(
            "labRequestOtherTest"
        );

    if (
        otherTest &&
        otherTest.value.trim()
    ) {

        selectedTests.push(
            otherTest.value.trim()
        );

    }


    // -------------------------------------------------
    // Require at least one investigation
    // -------------------------------------------------

    if (
        selectedTests.length === 0
    ) {

        alert(
            "Please select at least one laboratory investigation."
        );

        return;
    }


    // -------------------------------------------------
    // Get clinical information
    // -------------------------------------------------

    const clinicalInformation =
        document.getElementById(
            "labRequestClinicalInformation"
        );


    // -------------------------------------------------
    // Get requesting clinician
    // -------------------------------------------------

    const requestedBy =
        document.getElementById(
            "labRequestRequestedBy"
        );


    // -------------------------------------------------
    // Request date
    // -------------------------------------------------

    const requestDate =
        new Date()
            .toISOString()
            .split("T")[0];


    // -------------------------------------------------
    // Get electronic signature
    // -------------------------------------------------

    const signatureCanvas =
        document.getElementById(
            "labRequestSignaturePad"
        );

    let electronicSignature = "";


    if (signatureCanvas) {

        electronicSignature =
            signatureCanvas.toDataURL(
                "image/png"
            );

    }


    // -------------------------------------------------
    // Make sure we actually captured the signature
    // -------------------------------------------------

    if (
        !electronicSignature ||
        electronicSignature.length < 100
    ) {

        alert(
            "Please provide an electronic signature before saving the laboratory request."
        );

        return;
    }


    // -------------------------------------------------
    // Prepare laboratory request
    // -------------------------------------------------

    const consultationId =
    currentConsultationId || null;

const labRequestData = {

    consultation_id:
    currentConsultationId || null,

    requested_tests:
        selectedTests.join(", "),

        clinical_information:
            clinicalInformation
                ? clinicalInformation.value.trim()
                : "",

        requested_by:
            requestedBy
                ? requestedBy.value.trim()
                : "",

        request_date:
            requestDate,

        electronic_signature:
            electronicSignature

    };


    // -------------------------------------------------
    // Send request to server
    // -------------------------------------------------

    try {

    const token = getToken();

    if (!token) {
        throw new Error(
            "Authentication required. Please log in again."
        );
    }

    const response =
        await fetch(
            `${API_URL}/api/patients/${currentPatientId}/lab-requests`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        labRequestData
                    )
            }
        );

        // -------------------------------------------------
        // Read server response
        // -------------------------------------------------

        const data =
            await response.json();


        // -------------------------------------------------
        // Handle server error
        // -------------------------------------------------

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to save laboratory request."
            );

        }


        // -------------------------------------------------
        // Success
        // -------------------------------------------------

        alert(
            "Laboratory request saved successfully."
        );


        // -------------------------------------------------
        // Close laboratory request modal
        // -------------------------------------------------

        closeLabRequestModal();

        await loadLaboratoryRequests(currentPatientId);

    } catch (error) {

        console.error(
            "Save laboratory request error:",
            error
        );

        alert(
            error.message ||
            "Unable to save laboratory request."
        );

    }

}

// =====================================================
// PRINT LABORATORY REQUEST - SINGLE A4 PAGE
// =====================================================

function printLabRequest() {

    const printable =
        document.getElementById("labRequestPrintable");

    if (!printable) {
        alert("Laboratory request form not found.");
        return;
    }

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=1100"
        );

    if (!printWindow) {
        alert(
            "Please allow pop-ups for printing."
        );
        return;
    }

    const printClone =
    printable.cloneNode(true);

const originalCheckboxes =
    printable.querySelectorAll(
        ".lab-request-test"
    );

const clonedCheckboxes =
    printClone.querySelectorAll(
        ".lab-request-test"
    );

originalCheckboxes.forEach(
    function (originalCheckbox, index) {

        const clonedCheckbox =
            clonedCheckboxes[index];

        if (!clonedCheckbox) {
            return;
        }

        const label =
            clonedCheckbox.closest("label");

        if (!label) {
            return;
        }

        const testName =
            label.textContent.trim();

        /*
         * Remove the real checkbox because
         * browsers may not print its checked state.
         */
        clonedCheckbox.remove();

        /*
         * Create a visible printed checkbox.
         */
        const printedCheckbox =
            document.createElement("span");

        printedCheckbox.textContent = originalCheckbox.checked ? "[X] " : "[ ] ";

        printedCheckbox.style.fontSize =
            "14px";

        printedCheckbox.style.fontWeight =
            "bold";

        /*
         * Replace the label content with
         * the visible checkbox + test name.
         */
        label.textContent = "";

        label.appendChild(
            printedCheckbox
        );

        label.appendChild(
            document.createTextNode(testName)
        );
    }
);

// =====================================================
// CONVERT ELECTRONIC SIGNATURE CANVAS TO IMAGE
// =====================================================

const originalSignatureCanvas =
    printable.querySelector(
        "#labRequestSignaturePad"
    );

const clonedSignatureCanvas =
    printClone.querySelector(
        "#labRequestSignaturePad"
    );

if (
    originalSignatureCanvas &&
    clonedSignatureCanvas
) {

    const signatureImage =
        originalSignatureCanvas.toDataURL(
            "image/png"
        );

    const signatureImg =
        document.createElement("img");

    signatureImg.src =
        signatureImage;

    signatureImg.alt =
        "Electronic Signature";

    signatureImg.style.width =
        "500px";

    signatureImg.style.height =
        "160px";

    signatureImg.style.objectFit =
        "contain";

    signatureImg.style.display =
        "block";

    signatureImg.style.background =
        "#ffffff";

    clonedSignatureCanvas.replaceWith(
        signatureImg
    );
}


// Remove the Clear Signature button
const clonedSignatureActions =
    printClone.querySelector(
        ".signature-actions"
    );

if (clonedSignatureActions) {
    clonedSignatureActions.remove();
}


// Remove signature status text
const clonedSignatureStatus =
    printClone.querySelector(
        "#labRequestSignatureStatus"
    );

if (clonedSignatureStatus) {
    clonedSignatureStatus.remove();
}

const printContent =
    printClone.innerHTML;

    const printHtml =
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +

        "<meta charset='UTF-8'>" +

        "<title>" +
        "Laboratory Request - FranTett Healthcare" +
        "</title>" +

        "<style>" +

        "@page {" +
            "size: A4;" +
            "margin: 14mm;" +
        "}" +

        "* {" +
            "box-sizing: border-box;" +
        "}" +

        "html, body {" +
            "margin: 0;" +
            "padding: 0;" +
            "background: #fff;" +
            "color: #222;" +
            "font-family: Arial, Helvetica, sans-serif;" +
            "font-size: 12px;" +
        "}" +

        "body {" +
            "width: 100%;" +
        "}" +

        ".lab-request-header {" +
            "text-align: center;" +
            "border-bottom: 2px solid #222;" +
            "padding-bottom: 12px;" +
            "margin-bottom: 18px;" +
        "}" +

        ".lab-request-header h1 {" +
            "margin: 0;" +
            "font-size: 24px;" +
        "}" +

        ".lab-request-header p {" +
            "margin: 5px 0 10px;" +
            "font-size: 12px;" +
        "}" +

        ".lab-request-header h2 {" +
            "margin: 0;" +
            "font-size: 18px;" +
        "}" +

        ".lab-request-patient-section," +
        ".lab-request-section {" +
            "margin-bottom: 18px;" +
        "}" +

        ".lab-request-patient-section h3," +
        ".lab-request-section h3 {" +
            "margin: 0 0 8px;" +
            "font-size: 14px;" +
            "border-bottom: 1px solid #aaa;" +
            "padding-bottom: 4px;" +
        "}" +

        ".lab-request-patient-grid {" +
            "display: grid;" +
            "grid-template-columns: 1fr 1fr;" +
            "gap: 8px 20px;" +
        "}" +

        ".lab-request-tests {" +
            "display: grid;" +
            "grid-template-columns: 1fr 1fr;" +
            "gap: 7px 15px;" +
        "}" +

        ".lab-request-tests label {" +
            "display: block;" +
        "}" +

        ".lab-request-tests input {" +
            "margin-right: 6px;" +
        "}" +

        ".form-group {" +
            "margin-top: 10px;" +
        "}" +

        ".form-group label {" +
            "display: block;" +
            "font-weight: bold;" +
            "margin-bottom: 5px;" +
        "}" +

        "input[type='text']," +
        "textarea {" +
            "width: 100%;" +
            "border: 1px solid #999;" +
            "padding: 7px;" +
            "font-family: Arial, Helvetica, sans-serif;" +
            "font-size: 12px;" +
            "background: #fff;" +
        "}" +

        "textarea {" +
            "min-height: 70px;" +
            "resize: none;" +
        "}" +

        ".lab-request-signature {" +
            "display: flex;" +
            "flex-direction: column;" +
            "align-items: flex-start;" +
            "margin-top: 20px;" +
        "}" +

        ".signature-line {" +
            "border-bottom: 1px solid #222;" +
            "height: 28px;" +
            "margin-top: 5px;" +
        "}" +

        ".lab-request-footer {" +
            "margin-top: 40px;" +
            "padding-top: 10px;" +
            "border-top: 1px solid #aaa;" +
            "text-align: center;" +
            "font-size: 10px;" +
            "line-height: 1.5;" +
        "}" +

        ".no-print," +
        "button," +
        ".close-modal {" +
            "display: none !important;" +
        "}" +

        "</style>" +


        "</head>" +

        "<body>" +
        "<div id='labRequestPrintable'>" +
            printContent +
        "</div>" +

        "<\/body>" +
        "<\/html>";

    printWindow.document.open();

    printWindow.document.write(
        printHtml
    );

    printWindow.document.close();

    printWindow.focus();

    setTimeout(
        function () {

            printWindow.print();

        },
        500
    );
}


// Close Lab Request when clicking outside the modal
window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "labRequestModal"
            );

        if (
            modal &&
            event.target === modal
        ) {
            closeLabRequestModal();
        }

    }
);


function openAddLabReportModal() {

    if (!currentPatientId) {
        alert("Please open a patient profile first.");
        return;
    }

    const modal = document.getElementById("labReportModal");
    const form = document.getElementById("labReportForm");

    if (!modal || !form) {
        console.error("Laboratory report modal/form not found.");
        return;
    }

    form.reset();

    const idField = document.getElementById("labReportId");
    if (idField) idField.value = "";

    const title = document.getElementById("labReportFormTitle");
    if (title) title.textContent = "Add Laboratory Report";

    const container =
        document.getElementById("labParametersContainer");

    if (container) {
        container.innerHTML = "";
        addLabParameterRow();
    }

    modal.style.display = "flex";
}


function closeLabReportModal() {

    const modal =
        document.getElementById("labReportModal");

    if (modal) {
        modal.style.display = "none";
    }
}


function addLabParameterRow(
    parameter = {}
) {

    const container =
        document.getElementById("labParametersContainer");

    if (!container) {
        console.error("labParametersContainer not found.");
        return;
    }

    const row = document.createElement("div");

    row.className = "lab-parameter-row";

    row.innerHTML = `

        <input
            type="text"
            class="lab-parameter-name"
            placeholder="Parameter"
            value="${escapeHtml(parameter.parameter_name || "")}"
        >

        <input
            type="text"
            class="lab-parameter-result"
            placeholder="Result"
            value="${escapeHtml(parameter.result_value || "")}"
        >

        <input
            type="text"
            class="lab-parameter-unit"
            placeholder="Unit"
            value="${escapeHtml(parameter.unit || "")}"
        >

        <select class="lab-parameter-flag">

            <option value="">Flag</option>
            <option value="Low" ${parameter.flag === "Low" ? "selected" : ""}>
                Low
            </option>
            <option value="Normal" ${parameter.flag === "Normal" ? "selected" : ""}>
                Normal
            </option>
            <option value="High" ${parameter.flag === "High" ? "selected" : ""}>
                High
            </option>

        </select>

        <input
            type="text"
            class="lab-parameter-reference"
            placeholder="Reference Range"
            value="${escapeHtml(parameter.reference_range || "")}"
        >

        <button
            type="button"
            class="danger-btn"
            onclick="this.parentElement.remove()"
        >
            Remove
        </button>

    `;

    container.appendChild(row);
}


/* =====================================================
   SAVE LABORATORY REPORT
===================================================== */

const labReportForm =
    document.getElementById("labReportForm");

if (labReportForm) {

    labReportForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            if (!currentPatientId) {
                alert("Please open a patient profile first.");
                return;
            }

            const rows =
                document.querySelectorAll(
                    ".lab-parameter-row"
                );

            const parameters = [];

            rows.forEach(row => {

                const parameterName =
                    row.querySelector(
                        ".lab-parameter-name"
                    )?.value.trim();

                if (!parameterName) {
                    return;
                }

                parameters.push({

                    parameter_name:
                        parameterName,

                    result_value:
                        row.querySelector(
                            ".lab-parameter-result"
                        )?.value.trim() || null,

                    unit:
                        row.querySelector(
                            ".lab-parameter-unit"
                        )?.value.trim() || null,

                    flag:
                        row.querySelector(
                            ".lab-parameter-flag"
                        )?.value || null,

                    reference_range:
                        row.querySelector(
                            ".lab-parameter-reference"
                        )?.value.trim() || null

                });

            });

            const payload = {

                test_name:
                    document.getElementById(
                        "labReportTestName"
                    )?.value.trim(),

                result_date:
                    document.getElementById(
                        "labReportDate"
                    )?.value || null,

                status:
                    document.getElementById(
                        "labReportStatus"
                    )?.value || "Final",

                recorded_by:
                    document.getElementById(
                        "labReportRecordedBy"
                    )?.value.trim() || null,

                notes:
                    document.getElementById(
                        "labReportNotes"
                    )?.value.trim() || null,

                parameters

            };

            if (!payload.test_name) {
                alert("Please enter the laboratory test name.");
                return;
            }

            try {

                const response = await fetch(
                    `${API_URL}/api/patients/${currentPatientId}/lab-reports`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(payload)
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to save laboratory report."
                    );
                }

                closeLabReportModal();

                await loadLaboratoryReports(
                    currentPatientId
                );

                showMessage(
                    "Laboratory report saved successfully.",
                    "success"
                );

            } catch (error) {

                console.error(
                    "Save laboratory report error:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to save laboratory report."
                );

            }

        }
    );

}


/* =====================================================
   CLOSE LAB REPORT ON BACKDROP
===================================================== */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "labReportModal"
            );

        if (
            modal &&
            event.target === modal
        ) {
            closeLabReportModal();
        }

    }
);

function printPatientRecord() {
    window.print();
}

loadPatients();


