// ==========================================
// DOCTOR MANAGEMENT
// ==========================================

const API_URL =
    window.FRANTETT_API + "/api/doctors";


// ==========================================
// LOAD DOCTORS
// ==========================================

async function loadDoctors() {

    const container =
        document.getElementById("doctorContainer");

    try {

        container.innerHTML = `
            <div class="loading">
                Loading doctors...
            </div>
        `;

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Failed to load doctors"
            );

        }

        const doctors =
            await response.json();

        renderDoctors(doctors);

    } catch (error) {

        console.error(
            "Error loading doctors:",
            error
        );

        container.innerHTML = `
            <div class="empty-message">
                Unable to load doctors.
                Please check that the server is running.
            </div>
        `;

    }

}


// ==========================================
// DISPLAY DOCTORS
// ==========================================

function renderDoctors(doctors) {

    const container =
        document.getElementById("doctorContainer");

    if (!doctors.length) {

        container.innerHTML = `
            <div class="empty-message">
                No doctors found.
            </div>
        `;

        return;

    }

    container.innerHTML = "";

    doctors.forEach(doctor => {

        const card =
            document.createElement("div");

        card.className =
            "doctor-card";

        const statusClass =
            doctor.status === "Active"
                ? "status-active"
                : "status-inactive";

        const statusAction =
            doctor.status === "Active"
                ? "Deactivate"
                : "Activate";

        card.innerHTML = `

            <h2>
                ${escapeHtml(doctor.name)}
            </h2>

            <div class="doctor-specialty">
                ${escapeHtml(
                    doctor.specialty ||
                    "Healthcare Provider"
                )}
            </div>

            <div class="doctor-info">
                <strong>Email:</strong>
                ${escapeHtml(
                    doctor.email || "Not provided"
                )}
            </div>

            <div class="doctor-info">
                <strong>Phone:</strong>
                ${escapeHtml(
                    doctor.phone || "Not provided"
                )}
            </div>

            <div class="doctor-info">
                <strong>License:</strong>
                ${escapeHtml(
                    doctor.license_number ||
                    "Not provided"
                )}
            </div>

            <span class="doctor-status ${statusClass}">
                ${escapeHtml(
                    doctor.status || "Active"
                )}
            </span>

            <div class="doctor-actions">

                <button
                    type="button"
                    onclick="editDoctor(${doctor.id})"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onclick="toggleDoctorStatus(
                        ${doctor.id},
                        '${escapeJs(
                            doctor.status
                        )}'
                    )"
                >
                    ${statusAction}
                </button>

                <button
                    type="button"
                    onclick="deleteDoctor(${doctor.id})"
                >
                    Delete
                </button>

            </div>
        `;

        container.appendChild(card);

    });

}


// ==========================================
// OPEN ADD MODAL
// ==========================================

function openAddDoctorModal() {

    document.getElementById(
        "modalTitle"
    ).textContent = "Add Doctor";

    document.getElementById(
        "doctorForm"
    ).reset();

    document.getElementById(
        "doctorId"
    ).value = "";

    document.getElementById(
        "doctorStatus"
    ).value = "Active";

    document.getElementById(
        "doctorModal"
    ).style.display = "flex";

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeDoctorModal() {

    document.getElementById(
        "doctorModal"
    ).style.display = "none";

}


// ==========================================
// SAVE DOCTOR
// ADD OR UPDATE
// ==========================================

document.getElementById(
    "doctorForm"
).addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const id =
            document.getElementById(
                "doctorId"
            ).value;

        const doctor = {

            name:
                document.getElementById(
                    "doctorName"
                ).value.trim(),

            specialty:
                document.getElementById(
                    "doctorSpecialty"
                ).value.trim(),

            email:
                document.getElementById(
                    "doctorEmail"
                ).value.trim(),

            phone:
                document.getElementById(
                    "doctorPhone"
                ).value.trim(),

            license_number:
                document.getElementById(
                    "doctorLicense"
                ).value.trim(),

            status:
                document.getElementById(
                    "doctorStatus"
                ).value

        };


        if (!doctor.name) {

            alert(
                "Doctor name is required."
            );

            return;

        }


        try {

            const method =
                id
                    ? "PUT"
                    : "POST";

            const url =
                id
                    ? `${API_URL}/${id}`
                    : API_URL;


            const response =
                await fetch(
                    url,
                    {
                        method: method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                doctor
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to save doctor"
                );

            }


            alert(
                id
                    ? "Doctor updated successfully."
                    : "Doctor added successfully."
            );


            closeDoctorModal();

            await loadDoctors();


        } catch (error) {

            console.error(
                "Save doctor error:",
                error
            );

            alert(
                error.message
            );

        }

    }
);


// ==========================================
// EDIT DOCTOR
// ==========================================

async function editDoctor(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        const doctor =
            await response.json();


        if (!response.ok) {

            throw new Error(
                doctor.message ||
                "Unable to load doctor"
            );

        }


        document.getElementById(
            "modalTitle"
        ).textContent =
            "Edit Doctor";


        document.getElementById(
            "doctorId"
        ).value =
            doctor.id;


        document.getElementById(
            "doctorName"
        ).value =
            doctor.name || "";


        document.getElementById(
            "doctorSpecialty"
        ).value =
            doctor.specialty || "";


        document.getElementById(
            "doctorEmail"
        ).value =
            doctor.email || "";


        document.getElementById(
            "doctorPhone"
        ).value =
            doctor.phone || "";


        document.getElementById(
            "doctorLicense"
        ).value =
            doctor.license_number || "";


        document.getElementById(
            "doctorStatus"
        ).value =
            doctor.status || "Active";


        document.getElementById(
            "doctorModal"
        ).style.display =
            "flex";


    } catch (error) {

        console.error(
            "Edit doctor error:",
            error
        );

        alert(
            error.message
        );

    }

}


// ==========================================
// ACTIVATE / DEACTIVATE
// ==========================================

async function toggleDoctorStatus(
    id,
    currentStatus
) {

    const newStatus =
        currentStatus === "Active"
            ? "Inactive"
            : "Active";


    const confirmed =
        confirm(
            `Change doctor status to ${newStatus}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            status:
                                newStatus
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update status"
            );

        }


        await loadDoctors();


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

        alert(
            error.message
        );

    }

}


// ==========================================
// DELETE DOCTOR
// ==========================================

async function deleteDoctor(id) {

    const confirmed =
        confirm(
            "Are you sure you want to permanently delete this doctor?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete doctor"
            );

        }


        alert(
            "Doctor deleted successfully."
        );


        await loadDoctors();


    } catch (error) {

        console.error(
            "Delete doctor error:",
            error
        );

        alert(
            error.message
        );

    }

}


// ==========================================
// BASIC HTML ESCAPING
// ==========================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }

    return String(value)
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


// ==========================================
// JAVASCRIPT STRING ESCAPING
// ==========================================

function escapeJs(value) {

    return String(
        value || ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}


// ==========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "doctorModal"
            );

        if (event.target === modal) {

            closeDoctorModal();

        }

    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

loadDoctors();