

/* =====================================================
   CONFIGURATION
===================================================== */

const API_URL = window.FRANTETT_API;


/* =====================================================
   STATE
===================================================== */

let patientId = null;

let appointmentId = null;

let consultationId = null;

let isEditMode = false;


/* =====================================================
   AUTHENTICATION
===================================================== */

function getToken() {

    return localStorage.getItem(
        "frantett_token"
    );

}


function getAuthHeaders() {

    const token =
        getToken();

    if (!token) {

        throw new Error(
            "You are not logged in."
        );

    }

    return {

        "Authorization":
            `Bearer ${token}`,

        "Content-Type":
            "application/json"

    };

}


/* =====================================================
   URL PARAMETERS
===================================================== */

function getUrlParameters() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    patientId =
        params.get("patient_id");


    appointmentId =
        params.get("appointment_id");


    consultationId =
        params.get("consultation_id");


    /*
     * Also support /?id=123
     * for editing a consultation.
     */

    if (!consultationId) {

        consultationId =
            params.get("id");

    }


    if (consultationId) {

        isEditMode = true;

    }

}


/* =====================================================
   DATE
===================================================== */

function getToday() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* =====================================================
   ALERT
===================================================== */

function showAlert(
    message,
    type = "success"
) {

    const alert =
        document.getElementById(
            "alert"
        );

    alert.textContent =
        message;

    alert.className =
        `alert show ${type}`;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (type === "success") {

        setTimeout(
            () => {

                alert.className =
                    "alert";

            },
            5000
        );

    }

}


/* =====================================================
   LOADING
===================================================== */

function showLoading(
    message = "Please wait..."
) {

    document.getElementById(
        "loadingText"
    ).textContent =
        message;

    document.getElementById(
        "loadingOverlay"
    ).classList.add(
        "show"
    );

}


function hideLoading() {

    document.getElementById(
        "loadingOverlay"
    ).classList.remove(
        "show"
    );

}


/* =====================================================
   SAFE VALUE
===================================================== */

function value(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";

}


/* =====================================================
   SET VALUE
===================================================== */

function setValue(
    id,
    val
) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.value =
        val == null
            ? ""
            : val;

}


/* =====================================================
   LOAD PATIENT
===================================================== */

async function loadPatient() {

    if (!patientId) {

        document.getElementById(
            "patientStatus"
        ).textContent =
            "Patient ID missing";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}`,
                {
                    headers:
                        getAuthHeaders()
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load patient information."
            );

        }


        const patient =
            await response.json();


        /*
         * Support common response formats.
         */

        const data =
            patient.patient ||
            patient.data ||
            patient;


        const firstName =
            data.first_name ||
            data.firstname ||
            "";

        const lastName =
            data.last_name ||
            data.lastname ||
            "";

        const fullName =
            data.full_name ||
            data.name ||
            `${firstName} ${lastName}`.trim();


        document.getElementById(
            "patientName"
        ).textContent =
            fullName || "Unknown patient";


        document.getElementById(
            "patientIdDisplay"
        ).textContent =
            data.id ||
            patientId;


        document.getElementById(
            "patientStatus"
        ).textContent =
            "Patient loaded";


    } catch (error) {

        console.error(
            "Patient loading error:",
            error
        );


        document.getElementById(
            "patientStatus"
        ).textContent =
            "Patient information unavailable";

    }

}


/* =====================================================
   LOAD CONSULTATION
===================================================== */

async function loadConsultation() {

    if (!consultationId) {
        return;
    }


    showLoading(
        "Loading consultation..."
    );


    try {

        const response =
            await fetch(
                `${API_URL}/api/consultations/${consultationId}`,
                {
                    headers:
                        getAuthHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load consultation."
            );

        }


        const consultation =
            data.consultation ||
            data;


        /*
         * Get patient and appointment
         * from consultation record.
         */

        if (
            !patientId &&
            consultation.patient_id
        ) {

            patientId =
                consultation.patient_id;

        }


        if (
            !appointmentId &&
            consultation.appointment_id
        ) {

            appointmentId =
                consultation.appointment_id;

        }


        populateForm(
            consultation
        );
        /*
         * Vital Signs are stored separately from
         * the consultation record.
         *
         * Load the vital record linked to this
         * consultation and populate the existing
         * horizontal Vital Signs fields.
         */

        await loadConsultationLinkedVitals();



        isEditMode =
            true;


        document.getElementById(
            "formMode"
        ).textContent =
            "Edit Consultation";


        document.getElementById(
            "consultationIdDisplay"
        ).textContent =
            consultation.id ||
            consultationId;


        document.getElementById(
            "saveButton"
        ).textContent =
            "Update Consultation";


        /*
         * If patient was discovered from
         * the consultation, load patient.
         */

        await loadPatient();


    } catch (error) {

        console.error(
            "Consultation loading error:",
            error
        );


        showAlert(
            error.message ||
            "Unable to load consultation.",
            "error"
        );


    } finally {

        hideLoading();

    }

}


/* =====================================================
   POPULATE FORM
===================================================== */

function populateForm(
    consultation
) {

    setValue(
        "doctor",
        consultation.doctor
    );


    setValue(
        "consultationDate",
        formatDateForInput(
            consultation.consultation_date
        )
    );


    setValue(
        "appointmentId",
        consultation.appointment_id
    );

    setValue(
    "bloodPressure",
    consultation.blood_pressure
);

setValue(
    "heartRate",
    consultation.heart_rate
);

setValue(
    "temperature",
    consultation.temperature
);

setValue(
    "respiratoryRate",
    consultation.respiratory_rate
);

setValue(
    "oxygenSaturation",
    consultation.oxygen_saturation
);

setValue(
    "weight",
    consultation.weight
);

setValue(
    "height",
    consultation.height
);

setValue(
    "bmi",
    consultation.bmi
);
setValue(
        "chiefComplaint",
        consultation.chief_complaint
    );


    setValue(
        "historyOfPresentingComplaint",
        consultation.history_of_presenting_complaint
    );


    setValue(
        "pastMedicalHistory",
        consultation.past_medical_history
    );


    setValue(
        "drugAllergyHistory",
        consultation.drug_allergy_history
    );


    setValue(
        "familyHistory",
        consultation.family_history
    );


    setValue(
        "socialHistory",
        consultation.social_history
    );


    setValue(
        "systemsReview",
        consultation.systems_review
    );


    setValue(
        "summary",
        consultation.summary
    );


    setValue(
        "examination",
        consultation.examination
    );


    setValue(
        "investigations",
        consultation.investigations
    );


    setValue(
        "differentialDiagnosis",
        consultation.differential_diagnosis
    );


    setValue(
        "diagnosis",
        consultation.diagnosis
    );


    setValue(
        "managementPlan",
        consultation.management_plan
    );


    setValue(
        "treatment",
        consultation.treatment
    );


    setValue(
        "clinicalNotes",
        consultation.clinical_notes
    );


    setValue(
        "followUpDate",
        formatDateForInput(
            consultation.follow_up_date
        )
    );

}


/* =====================================================
   DATE FORMATTER
===================================================== */

function formatDateForInput(
    dateValue
) {

    if (!dateValue) {
        return "";
    }


    /*
     * If PostgreSQL returns:
     * YYYY-MM-DD, keep it.
     */

    if (
        typeof dateValue === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(
            dateValue
        )
    ) {

        return dateValue;

    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return [
        date.getFullYear(),
        String(
            date.getMonth() + 1
        ).padStart(2, "0"),
        String(
            date.getDate()
        ).padStart(2, "0")
    ].join("-");

}


/* =====================================================
   BUILD PAYLOAD
===================================================== */

function buildPayload() {

    return {

        appointment_id:
            appointmentId
                ? Number(appointmentId)
                : null,

        doctor:
            value("doctor") ||
            null,

       consultation_date:
    value("consultationDate") ||
    null,

blood_pressure:
    value("bloodPressure") ||
    null,

heart_rate:
    value("heartRate")
        ? Number(value("heartRate"))
        : null,

temperature:
    value("temperature")
        ? Number(value("temperature"))
        : null,

respiratory_rate:
    value("respiratoryRate")
        ? Number(value("respiratoryRate"))
        : null,

oxygen_saturation:
    value("oxygenSaturation")
        ? Number(value("oxygenSaturation"))
        : null,

weight:
    value("weight")
        ? Number(value("weight"))
        : null,

height:
    value("height")
        ? Number(value("height"))
        : null,

bmi:
    value("bmi")
        ? Number(value("bmi"))
        : null,

chief_complaint:
            value("chiefComplaint") ||
            null,

        history_of_presenting_complaint:
            value(
                "historyOfPresentingComplaint"
            ) || null,

        past_medical_history:
            value(
                "pastMedicalHistory"
            ) || null,

        drug_allergy_history:
            value(
                "drugAllergyHistory"
            ) || null,

        family_history:
            value(
                "familyHistory"
            ) || null,

        social_history:
            value(
                "socialHistory"
            ) || null,

        systems_review:
            value(
                "systemsReview"
            ) || null,

        summary:
            value("summary") ||
            null,

        examination:
            value("examination") ||
            null,

        investigations:
            value("investigations") ||
            null,

        differential_diagnosis:
            value(
                "differentialDiagnosis"
            ) || null,

        diagnosis:
            value("diagnosis") ||
            null,

        management_plan:
            value("managementPlan") ||
            null,

        treatment:
            value("treatment") ||
            null,

        clinical_notes:
            value("clinicalNotes") ||
            null,

        follow_up_date:
            value("followUpDate") ||
            null

    };

}


/* =====================================================
   VALIDATE
===================================================== */

function validateForm() {

    if (!patientId) {

        showAlert(
            "Patient ID is missing. Please open the consultation from a patient or appointment record.",
            "error"
        );

        return false;

    }


    if (!value("doctor")) {

        showAlert(
            "Please enter the doctor / clinician name.",
            "warning"
        );

        document
            .getElementById("doctor")
            .focus();

        return false;

    }


    if (!value("consultationDate")) {

        showAlert(
            "Please select the consultation date.",
            "warning"
        );

        document
            .getElementById(
                "consultationDate"
            )
            .focus();

        return false;

    }


    return true;

}



/* =====================================================
   SAVE / UPDATE VITAL SIGNS
===================================================== */

async function saveConsultationVitals() {

    if (!patientId || !consultationId) {

        throw new Error(
            "Cannot save vital signs because the patient or consultation ID is missing."
        );

    }

    const bloodPressure =
        value("bloodPressure") || "";

    const heartRate =
        value("heartRate") || "";

    const temperature =
        value("temperature") || "";

    const respiratoryRate =
        value("respiratoryRate") || "";

    const oxygenSaturation =
        value("oxygenSaturation") || "";

    const weight =
        value("weight") || "";

    const height =
        value("height") || "";

    const bmi =
        value("bmi") || "";

    const hasVitals =
        bloodPressure ||
        heartRate ||
        temperature ||
        respiratoryRate ||
        oxygenSaturation ||
        weight ||
        height ||
        bmi;

    if (!hasVitals) {

        console.log(
            "No vital signs entered. Nothing to save."
        );

        return;

    }

    const vitalPayload = {

        consultation_id:
            Number(consultationId),

        blood_pressure:
            bloodPressure || null,

        heart_rate:
            heartRate || null,

        temperature:
            temperature || null,

        respiratory_rate:
            respiratoryRate || null,

        oxygen_saturation:
            oxygenSaturation || null,

        weight:
            weight || null,

        height:
            height || null,

        bmi:
            bmi || null

    };


    const existingResponse =
        await fetch(
            `${API_URL}/api/patients/${patientId}/vitals`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


    if (
        existingResponse.status === 401 ||
        existingResponse.status === 403
    ) {

        throw new Error(
            "Your session has expired. Please log in again."
        );

    }


    const existingData =
        await existingResponse.json();


    if (!existingResponse.ok) {

        throw new Error(
            existingData.message ||
            "Unable to check existing vital signs."
        );

    }


    const existingVitals =
        Array.isArray(existingData)
            ? existingData
            : (
                Array.isArray(existingData.records)
                    ? existingData.records
                    : []
            );


    const linkedVitals =
        existingVitals.filter(
            vital =>
                Number(vital.consultation_id) ===
                Number(consultationId)
        );


    if (linkedVitals.length) {

        linkedVitals.sort(
            (a, b) =>
                new Date(b.recorded_at || 0) -
                new Date(a.recorded_at || 0)
        );


        const existingVital =
            linkedVitals[0];


        const updateResponse =
            await fetch(
                `${API_URL}/api/vitals/${existingVital.id}`,
                {
                    method: "PUT",
                    headers: getAuthHeaders(),
                    body:
                        JSON.stringify(
                            vitalPayload
                        )
                }
            );


        const updateData =
            await updateResponse.json();


        if (!updateResponse.ok) {

            throw new Error(
                updateData.message ||
                "Unable to update vital signs."
            );

        }


        console.log(
            "CONSULTATION VITALS UPDATED:",
            updateData
        );


        return updateData;

    }


    const createResponse =
        await fetch(
            `${API_URL}/api/patients/${patientId}/vitals`,
            {
                method: "POST",
                headers: getAuthHeaders(),
                body:
                    JSON.stringify(
                        vitalPayload
                    )
            }
        );


    const createData =
        await createResponse.json();


    if (!createResponse.ok) {

        throw new Error(
            createData.message ||
            "Unable to save vital signs."
        );

    }


    console.log(
        "CONSULTATION VITALS SAVED:",
        createData
    );


    return createData;

}

/* =====================================================
   SAVE / UPDATE
===================================================== */

async function saveConsultation() {

    if (!validateForm()) {
        return;
    }


    const button =
        document.getElementById(
            "saveButton"
        );


    button.disabled =
        true;


    showLoading(
        isEditMode
            ? "Updating consultation..."
            : "Saving consultation..."
    );


    try {

        const payload =
            buildPayload();


        let response;


        if (isEditMode) {

            response =
                await fetch(
                    `${API_URL}/api/consultations/${consultationId}`,
                    {

                        method: "PUT",

                        headers:
                            getAuthHeaders(),

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );

        } else {

            response =
                await fetch(
                    `${API_URL}/api/patients/${patientId}/consultations`,
                    {

                        method: "POST",

                        headers:
                            getAuthHeaders(),

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );

        }


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to save consultation."
            );

        }


        const savedConsultation =
            data.consultation ||
            data;


        /*
         * Capture returned ID.
         */

        if (
            savedConsultation &&
            savedConsultation.id
        ) {

            consultationId =
                savedConsultation.id;

        }


                /*
         * Save Vital Signs after the consultation
         * has a confirmed consultation ID.
         */

        await saveConsultationVitals();


const wasNewConsultation = !isEditMode;

isEditMode = true;

document.getElementById(
    "formMode"
).textContent = "Edit Consultation";

document.getElementById(
    "consultationIdDisplay"
).textContent =
    consultationId || "Saved";

button.textContent =
    "Update Consultation";

showAlert(
    wasNewConsultation
        ? "Consultation created successfully."
        : "Consultation updated successfully.",
    "success"
);

        /*
         * Update browser URL so refresh
         * continues in edit mode.
         */

        updateBrowserUrl();


    } catch (error) {

        console.error(
            "Save consultation error:",
            error
        );


        showAlert(
            error.message ||
            "Failed to save consultation.",
            "error"
        );


    } finally {

        hideLoading();

        button.disabled =
            false;

    }

}


/* =====================================================
   UPDATE URL
===================================================== */

function updateBrowserUrl() {

    if (!consultationId) {
        return;
    }


    const params =
        new URLSearchParams();


    if (patientId) {

        params.set(
            "patient_id",
            patientId
        );

    }


    if (appointmentId) {

        params.set(
            "appointment_id",
            appointmentId
        );

    }


    params.set(
        "consultation_id",
        consultationId
    );


    const newUrl =
        `${window.location.pathname}?${params.toString()}`;


    window.history.replaceState(
        {},
        "",
        newUrl
    );

}


/* =====================================================
   BMI CALCULATION
===================================================== */

/* =====================================================
   FRANTETT CONSULTATION VITAL AUTOFILL
   Loads the existing vital record linked to this
   consultation and populates the current form fields.
===================================================== */

async function loadConsultationLinkedVitals() {

    if (
        !patientId ||
        !consultationId
    ) {

        console.log(
            "Vital autofill skipped: missing patientId or consultationId."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/vitals`,
                {
                    method:
                        "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${getToken()}`
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            showAlert(
                "Your session has expired. Please log in again.",
                "error"
            );

            return;

        }


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Failed to load patient vital signs:",
                data
            );

            return;

        }


        const vitals =
            Array.isArray(data)
                ? data
                : (
                    Array.isArray(data.records)
                        ? data.records
                        : []
                );


        /*
         * Only select records belonging to
         * the current consultation.
         */

        const linkedVitals =
            vitals.filter(
                vital =>
                    Number(
                        vital.consultation_id
                    ) === Number(
                        consultationId
                    )
            );


        if (!linkedVitals.length) {

            console.log(
                "No vital signs linked to consultation:",
                consultationId
            );

            return;

        }


        /*
         * If several vital records exist for the
         * same consultation, use the newest one.
         */

        linkedVitals.sort(
            (a, b) =>
                new Date(
                    b.recorded_at || 0
                ) -
                new Date(
                    a.recorded_at || 0
                )
        );


        const vital =
            linkedVitals[0];


        /*
         * Populate the EXISTING horizontal
         * Vital Signs fields.
         */

        setValue(
            "bloodPressure",
            vital.blood_pressure
        );


        setValue(
            "heartRate",
            vital.heart_rate
        );


        setValue(
            "temperature",
            vital.temperature
        );


        setValue(
            "respiratoryRate",
            vital.respiratory_rate
        );


        setValue(
            "oxygenSaturation",
            vital.oxygen_saturation
        );


        setValue(
            "weight",
            vital.weight
        );


        setValue(
            "height",
            vital.height
        );


        setValue(
            "bmi",
            vital.bmi
        );


        console.log(
            "CONSULTATION VITALS AUTO-POPULATED:",
            vital
        );

    } catch (error) {

        console.error(
            "Consultation vital autofill error:",
            error
        );

    }

}


/* =====================================================
   END FRANTETT CONSULTATION VITAL AUTOFILL
===================================================== */

function calculateBMI() {

    const weight =
        parseFloat(
            value("weight")
        );

    const heightCm =
        parseFloat(
            value("height")
        );


    if (
        !weight ||
        !heightCm ||
        weight <= 0 ||
        heightCm <= 0
    ) {

        return;

    }


    const heightM =
        heightCm / 100;


    const bmi =
        weight /
        (
            heightM *
            heightM
        );


    setValue(
        "bmi",
        bmi.toFixed(1)
    );

}


/* =====================================================
   CLEAR FORM
===================================================== */

function clearForm() {

    if (isEditMode) {

        showAlert(
            "This is an existing consultation. Use Update Consultation to save changes.",
            "warning"
        );

        return;

    }


    const confirmed =
        window.confirm(
            "Clear all consultation information?"
        );


    if (!confirmed) {
        return;
    }


    const fields =
        document.querySelectorAll(
            "input:not([readonly]), textarea, select"
        );


    fields.forEach(
        field => {

            if (
                field.id ===
                "consultationDate"
            ) {

                field.value =
                    getToday();

            } else {

                field.value =
                    "";

            }

        }
    );


    showAlert(
        "Form cleared.",
        "success"
    );

}


/* =====================================================
   PRINT
===================================================== */

function printConsultation() {

    window.print();

}


/* =====================================================
   BACK
===================================================== */

function goBack() {

    if (
        document.referrer &&
        document.referrer.includes(
            window.location.hostname
        )
    ) {

        window.history.back();

        return;

    }


    window.location.href =
        "./patients.html";

}


/* =====================================================
   LINKED CLINICAL RECORDS
===================================================== */

function linkedClinicalHeaders() {

    if (typeof getAuthHeaders === "function") {
        return getAuthHeaders();
    }

    return {
        "Content-Type": "application/json"
    };
}


function linkedEscape(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "â€”";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function linkedDate(value) {

    if (!value) {
        return "â€”";
    }

    const date = new Date(value);

    return isNaN(date.getTime())
        ? String(value)
        : date.toLocaleDateString();
}


function linkedRequireConsultation() {

    const id = Number(consultationId);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        showAlert(
            "Please save the consultation first.",
            "warning"
        );

        return null;
    }

    return id;
}


/* =====================================================
   LAB REQUEST
===================================================== */

async function loadLinkedLabRequests() {

    const container =
        document.getElementById(
            "linkedLabRequestsList"
        );

    if (!container || !patientId) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/lab-requests`,
                {
                    headers: linkedClinicalHeaders()
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to load laboratory requests."
            );
        }

        const records =
            Array.isArray(data)
                ? data
                : [];

        const consultationRecords =
            records.filter(
                record =>
                    Number(record.consultation_id) ===
                    Number(consultationId)
            );

        if (!consultationRecords.length) {

            container.innerHTML =
                `<div class="linked-record-empty">
                    No laboratory requests recorded for this consultation.
                </div>`;

            return;
        }

        container.innerHTML = `
            <div class="linked-record-table-wrapper">
                <table class="linked-record-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Requested Tests</th>
                            <th>Clinical Information</th>
                            <th>Requested By</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${consultationRecords.map(record => `
                            <tr>
                                <td>${linkedEscape(linkedDate(record.request_date))}</td>
                                <td>${linkedEscape(record.requested_tests)}</td>
                                <td>${linkedEscape(record.clinical_information)}</td>
                                <td>${linkedEscape(record.requested_by)}</td>
                            </tr>
                        `).join("")}

                    </tbody>
                </table>
            </div>
        `;

    } catch (error) {

        console.error(
            "Load lab requests error:",
            error
        );

        container.innerHTML =
            `<div class="linked-record-empty">
                Unable to load laboratory requests.
            </div>`;
    }
}


/* =====================================================
   LAB REPORT
===================================================== */

function showLinkedLabReportForm() {

    if (!linkedRequireConsultation()) {
        return;
    }

    document.getElementById(
        "linkedLabReportForm"
    ).style.display = "block";

    const date =
        document.getElementById(
            "linkedLabResultDate"
        );

    if (!date.value) {
        date.value = getToday();
    }

    const recorded =
        document.getElementById(
            "linkedLabRecordedBy"
        );

    if (
        !recorded.value &&
        value("doctor")
    ) {
        recorded.value = value("doctor");
    }

    if (
        !document.getElementById(
            "linkedLabParameters"
        ).children.length
    ) {
        addLinkedLabParameter();
    }
}


function hideLinkedLabReportForm() {

    document.getElementById(
        "linkedLabReportForm"
    ).style.display = "none";
}


function addLinkedLabParameter() {

    const container =
        document.getElementById(
            "linkedLabParameters"
        );

    const row =
        document.createElement("div");

    row.className =
        "linked-lab-parameter-row";

    row.innerHTML = `
        <input
            type="text"
            class="linked-lab-parameter-name"
            placeholder="Parameter"
        >

        <input
            type="text"
            class="linked-lab-result-value"
            placeholder="Result"
        >

        <input
            type="text"
            class="linked-lab-unit"
            placeholder="Unit"
        >

        <input
            type="text"
            class="linked-lab-flag"
            placeholder="Flag"
        >

        <input
            type="text"
            class="linked-lab-reference"
            placeholder="Reference range"
        >

        <button
            type="button"
            class="btn-secondary"
            onclick="this.closest('.linked-lab-parameter-row').remove()"
        >
            Remove
        </button>
    `;

    container.appendChild(row);
}


async function saveLinkedLabReport() {

    const id =
        linkedRequireConsultation();

    if (!id) {
        return;
    }

    const testName =
        document.getElementById(
            "linkedLabTestName"
        ).value.trim();

    if (!testName) {

        showAlert(
            "Please enter the laboratory test name.",
            "warning"
        );

        return;
    }

    const parameters =
        Array.from(
            document.querySelectorAll(
                "#linkedLabParameters .linked-lab-parameter-row"
            )
        )
        .map(row => ({

            parameter_name:
                row.querySelector(
                    ".linked-lab-parameter-name"
                ).value.trim(),

            result_value:
                row.querySelector(
                    ".linked-lab-result-value"
                ).value.trim() || null,

            unit:
                row.querySelector(
                    ".linked-lab-unit"
                ).value.trim() || null,

            flag:
                row.querySelector(
                    ".linked-lab-flag"
                ).value.trim() || null,

            reference_range:
                row.querySelector(
                    ".linked-lab-reference"
                ).value.trim() || null
        }))
        .filter(item => item.parameter_name);

    const payload = {

        consultation_id: id,

        test_name: testName,

        result_date:
            document.getElementById(
                "linkedLabResultDate"
            ).value || null,

        status:
            document.getElementById(
                "linkedLabResultStatus"
            ).value || "Final",

        recorded_by:
            document.getElementById(
                "linkedLabRecordedBy"
            ).value.trim() || null,

        notes:
            document.getElementById(
                "linkedLabReportNotes"
            ).value.trim() || null,

        parameters: parameters
    };

    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/lab-reports`,
                {
                    method: "POST",
                    headers: linkedClinicalHeaders(),
                    body: JSON.stringify(payload)
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

        showAlert(
            "Laboratory report saved successfully.",
            "success"
        );

        document.getElementById(
            "linkedLabTestName"
        ).value = "";

        document.getElementById(
            "linkedLabReportNotes"
        ).value = "";

        document.getElementById(
            "linkedLabParameters"
        ).innerHTML = "";

        hideLinkedLabReportForm();

        await loadLinkedLabReports();

    } catch (error) {

        console.error(
            "Linked lab report error:",
            error
        );

        showAlert(
            error.message ||
            "Failed to save laboratory report.",
            "error"
        );
    }
}


async function loadLinkedLabReports() {

    const container =
        document.getElementById(
            "linkedLabReportsList"
        );

    if (!container || !patientId) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/lab-reports`,
                {
                    headers: linkedClinicalHeaders()
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to load laboratory reports."
            );
        }

        const records =
            Array.isArray(data)
                ? data
                : [];

        const consultationRecords =
            records.filter(
                record =>
                    Number(record.consultation_id) ===
                    Number(consultationId)
            );

        if (!consultationRecords.length) {

            container.innerHTML =
                `<div class="linked-record-empty">
                    No laboratory reports recorded for this consultation.
                </div>`;

            return;
        }

        container.innerHTML =
            consultationRecords.map(record => `

                <div class="linked-record-table-wrapper">

                    <div class="linked-lab-report-header">
                        <strong>${linkedEscape(record.test_name)}</strong>
                        <span>â€”</span>
                        <span>${linkedEscape(linkedDate(record.result_date))}</span>
                    </div>

                    ${
                        record.parameters &&
                        record.parameters.length
                            ? `
                                <div class="linked-record-subtable">

                                    <table>

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

                                            ${record.parameters.map(parameter => `
                                                <tr>
                                                    <td>${linkedEscape(parameter.parameter_name)}</td>
                                                    <td>${linkedEscape(parameter.result_value)}</td>
                                                    <td>${linkedEscape(parameter.unit)}</td>
                                                    <td>${linkedEscape(parameter.flag)}</td>
                                                    <td>${linkedEscape(parameter.reference_range)}</td>
                                                </tr>
                                            `).join("")}

                                        </tbody>

                                    </table>

                                </div>
                            `
                            : ""
                    }

                    ${
                        record.notes
                            ? `
                                <div class="linked-record-meta">
                                    <strong>Notes:</strong>
                                    ${linkedEscape(record.notes)}
                                </div>
                            `
                            : ""
                    }

                </div>

            `).join("");

    } catch (error) {

        console.error(
            "Load lab reports error:",
            error
        );

        container.innerHTML =
            `<div class="linked-record-empty">
                Unable to load laboratory reports.
            </div>`;
    }
}


/* =====================================================
   PRESCRIPTION
===================================================== */

function showLinkedPrescriptionForm() {

    if (!linkedRequireConsultation()) {
        return;
    }

    document.getElementById(
        "linkedPrescriptionForm"
    ).style.display = "block";

    const date =
        document.getElementById(
            "linkedPrescriptionDate"
        );

    if (!date.value) {
        date.value = getToday();
    }

    const doctor =
        document.getElementById(
            "linkedPrescriptionDoctor"
        );

    if (
        !doctor.value &&
        value("doctor")
    ) {
        doctor.value = value("doctor");
    }

    if (
        !document.getElementById(
            "linkedPrescriptionItems"
        ).children.length
    ) {
        addLinkedMedication();
    }
}


function hideLinkedPrescriptionForm() {

    document.getElementById(
        "linkedPrescriptionForm"
    ).style.display = "none";
}


function addLinkedMedication() {

    const container =
        document.getElementById(
            "linkedPrescriptionItems"
        );

    const row =
        document.createElement("div");

    row.className =
        "linked-medication-row";

    row.innerHTML = `

        <input
            type="text"
            class="linked-medication-name"
            placeholder="Medication"
        >

        <input
            type="text"
            class="linked-medication-dose"
            placeholder="Dose"
        >

        <input
            type="text"
            class="linked-medication-route"
            placeholder="Route"
        >

        <input
            type="text"
            class="linked-medication-frequency"
            placeholder="Frequency"
        >

        <input
            type="text"
            class="linked-medication-duration"
            placeholder="Duration"
        >

        <input
            type="text"
            class="linked-medication-quantity"
            placeholder="Quantity"
        >

        <button
            type="button"
            class="btn-secondary"
            onclick="this.closest('.linked-medication-row').remove()"
        >
            Remove
        </button>

    `;

    container.appendChild(row);
}


async function saveLinkedPrescription() {

    const id =
        linkedRequireConsultation();

    if (!id) {
        return;
    }

    const items =
        Array.from(
            document.querySelectorAll(
                "#linkedPrescriptionItems .linked-medication-row"
            )
        )
        .map(row => ({

            medication_name:
                row.querySelector(
                    ".linked-medication-name"
                ).value.trim(),

            dose:
                row.querySelector(
                    ".linked-medication-dose"
                ).value.trim() || null,

            route:
                row.querySelector(
                    ".linked-medication-route"
                ).value.trim() || null,

            frequency:
                row.querySelector(
                    ".linked-medication-frequency"
                ).value.trim() || null,

            duration:
                row.querySelector(
                    ".linked-medication-duration"
                ).value.trim() || null,

            quantity:
                row.querySelector(
                    ".linked-medication-quantity"
                ).value.trim() || null

        }))
        .filter(item => item.medication_name);

    if (!items.length) {

        showAlert(
            "Please enter at least one medication.",
            "warning"
        );

        return;
    }

    const payload = {

        consultation_id: id,

        doctor:
            document.getElementById(
                "linkedPrescriptionDoctor"
            ).value.trim() || null,

        prescription_date:
            document.getElementById(
                "linkedPrescriptionDate"
            ).value || null,

        instructions:
            document.getElementById(
                "linkedPrescriptionInstructions"
            ).value.trim() || null,

        notes:
            document.getElementById(
                "linkedPrescriptionNotes"
            ).value.trim() || null,

        items: items
    };

    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/prescriptions`,
                {
                    method: "POST",
                    headers: linkedClinicalHeaders(),
                    body: JSON.stringify(payload)
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to save prescription."
            );
        }

        showAlert(
            "Prescription saved successfully.",
            "success"
        );

        document.getElementById(
            "linkedPrescriptionInstructions"
        ).value = "";

        document.getElementById(
            "linkedPrescriptionNotes"
        ).value = "";

        document.getElementById(
            "linkedPrescriptionItems"
        ).innerHTML = "";

        hideLinkedPrescriptionForm();

        await loadLinkedPrescriptions();

    } catch (error) {

        console.error(
            "Linked prescription error:",
            error
        );

        showAlert(
            error.message ||
            "Failed to save prescription.",
            "error"
        );
    }
}


async function loadLinkedPrescriptions() {

    const container =
        document.getElementById(
            "linkedPrescriptionsList"
        );

    if (!container || !patientId) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/prescriptions`,
                {
                    headers: linkedClinicalHeaders()
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to load prescriptions."
            );
        }

        const records =
            Array.isArray(data)
                ? data
                : Array.isArray(data.prescriptions)
                    ? data.prescriptions
                    : [];

        const consultationRecords =
            records.filter(
                record =>
                    Number(record.consultation_id) ===
                    Number(consultationId)
            );

        if (!consultationRecords.length) {

            container.innerHTML =
                `<div class="linked-record-empty">
                    No prescriptions recorded for this consultation.
                </div>`;

            return;
        }

        container.innerHTML =
            consultationRecords.map(record => {

                const medications =
                    Array.isArray(record.medications)
                        ? record.medications
                        : Array.isArray(record.items)
                            ? record.items
                            : [];

                return `

                    <div class="linked-record-table-wrapper">

                        <table class="linked-record-table">

                            <thead>
                                <tr>
                                    <th>Medication</th>
                                    <th>Dose</th>
                                    <th>Route</th>
                                    <th>Frequency</th>
                                    <th>Duration</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>

                            <tbody>

                                ${
                                    medications.length
                                        ? medications.map(item => `
                                            <tr>
                                                <td>${linkedEscape(item.medication_name)}</td>
                                                <td>${linkedEscape(item.dose)}</td>
                                                <td>${linkedEscape(item.route)}</td>
                                                <td>${linkedEscape(item.frequency)}</td>
                                                <td>${linkedEscape(item.duration)}</td>
                                                <td>${linkedEscape(item.quantity)}</td>
                                            </tr>
                                        `).join("")
                                        : `
                                            <tr>
                                                <td colspan="6">
                                                    No medication items recorded.
                                                </td>
                                            </tr>
                                        `
                                }

                            </tbody>

                        </table>

                        ${
                            record.instructions
                                ? `
                                    <div class="linked-record-meta">
                                        <strong>Instructions:</strong>
                                        ${linkedEscape(record.instructions)}
                                    </div>
                                `
                                : ""
                        }

                        ${
                            record.notes
                                ? `
                                    <div class="linked-record-meta">
                                        <strong>Notes:</strong>
                                        ${linkedEscape(record.notes)}
                                    </div>
                                `
                                : ""
                        }

                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error(
            "Load prescriptions error:",
            error
        );

        container.innerHTML =
            `<div class="linked-record-empty">
                Unable to load prescriptions.
            </div>`;
    }
}


/* =====================================================
   LOAD ALL LINKED RECORDS
===================================================== */

async function loadLinkedClinicalRecords() {

    const display =
        document.getElementById(
            "linkedRecordsConsultationId"
        );

    if (display) {
        display.textContent =
            consultationId || "â€”";
    }

    if (!consultationId) {
        return;
    }

    await Promise.all([
        loadLinkedLabRequests(),
        loadLinkedLabReports(),
        loadLinkedPrescriptions()
    ]);
}


/* =====================================================
   INITIALIZE
===================================================== */

async function initialize() {

    getUrlParameters();


    /*
     * Appointment display.
     */

    document.getElementById(
        "appointmentId"
    ).value =
        appointmentId || "";


    document.getElementById(
        "appointmentIdDisplay"
    ).textContent =
        appointmentId || "Ã¢â‚¬â€";


    document.getElementById(
        "patientIdDisplay"
    ).textContent =
        patientId || "Ã¢â‚¬â€";


    /*
     * Default date for new consultation.
     */

    if (!isEditMode) {

        setValue(
            "consultationDate",
            getToday()
        );

    }


    /*
     * Load patient.
     */

    await loadPatient();


    /*
     * Load existing consultation.
     */

    if (consultationId) {

        await loadConsultation();

    }


    /*
     * BMI.
     */

    document
        .getElementById("weight")
        .addEventListener(
            "input",
            calculateBMI
        );


    document
        .getElementById("height")
        .addEventListener(
            "input",
            calculateBMI
        );


    /*
     * Load linked clinical records.
     */

    if (consultationId) {

        await loadLinkedClinicalRecords();

    }

    /*
     * Warn before leaving with
     * unsaved information.
     */

    let formChanged =
        false;


    document
        .querySelectorAll(
            "input, textarea, select"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "input",
                    () => {

                        formChanged =
                            true;

                    }
                );

                element.addEventListener(
                    "change",
                    () => {

                        formChanged =
                            true;

                    }
                );

            }
        );


    window.addEventListener(
        "beforeunload",
        event => {

            if (formChanged) {

                event.preventDefault();

                event.returnValue =
                    "";

            }

        }
    );

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


/* =====================================================
   CONSULTATION LAB REQUEST POPUP
===================================================== */

let labRequestSignaturePad = null;
let labRequestSignatureDrawing = false;

function openConsultationLabRequestModal() {

    const consultationId =
        getActiveConsultationId();

    if (!consultationId) {
        showAlert(
            "Please save or open a consultation before creating a laboratory request.",
            "warning"
        );
        return;
    }

    const modal =
        document.getElementById("labRequestModal");

    if (!modal) {
        showAlert(
            "Laboratory request form could not be opened.",
            "error"
        );
        return;
    }

    const patient =
        window.currentPatient ||
        window.patientData ||
        null;

    const patientName =
        patient
            ? (
                `${patient.first_name || patient.firstName || ""} ${patient.last_name || patient.lastName || ""}`
            ).trim()
            : "";

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || "?";
        }
    };

    setText(
        "labRequestPatientName",
        patientName || currentPatientId || "?"
    );

    setText(
        "labRequestPatientId",
        currentPatientId || "?"
    );

    setText(
        "labRequestPatientDob",
        patient?.date_of_birth ||
        patient?.dob ||
        "?"
    );

    setText(
        "labRequestPatientGender",
        patient?.gender ||
        "?"
    );

    const today =
        typeof getToday === "function"
            ? getToday()
            : new Date().toISOString().slice(0, 10);

    setText(
        "labRequestDateDisplay",
        today
    );

    setText(
        "labRequestSignatureDate",
        today
    );

    const clinicalInfo =
        document.getElementById(
            "labRequestClinicalInformation"
        );

    if (clinicalInfo) {
        clinicalInfo.value = "";
    }

    const otherTest =
        document.getElementById(
            "labRequestOtherTest"
        );

    if (otherTest) {
        otherTest.value = "";
    }

    const requestedBy =
        document.getElementById(
            "labRequestRequestedBy"
        );

    if (requestedBy) {
        requestedBy.value = "";
    }

    document
        .querySelectorAll(".lab-request-test")
        .forEach(checkbox => {
            checkbox.checked = false;
        });

    initializeConsultationLabRequestSignature();

    modal.style.display = "block";
}


function closeConsultationLabRequestModal() {

    const modal =
        document.getElementById("labRequestModal");

    if (modal) {
        modal.style.display = "none";
    }
}


function initializeConsultationLabRequestSignature() {

    const canvas =
        document.getElementById(
            "labRequestSignaturePad"
        );

    if (!canvas) {
        return;
    }

    const context =
        canvas.getContext("2d");

    if (!context) {
        return;
    }

    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    labRequestSignaturePad = canvas;

    const getPosition = event => {

        const rect =
            canvas.getBoundingClientRect();

        const source =
            event.touches
                ? event.touches[0]
                : event;

        return {
            x:
                (source.clientX - rect.left) *
                (canvas.width / rect.width),

            y:
                (source.clientY - rect.top) *
                (canvas.height / rect.height)
        };
    };

    const startDrawing = event => {

        event.preventDefault();

        const position =
            getPosition(event);

        labRequestSignatureDrawing = true;

        context.beginPath();
        context.moveTo(
            position.x,
            position.y
        );

        updateLabRequestSignatureStatus(true);
    };

    const draw = event => {

        if (!labRequestSignatureDrawing) {
            return;
        }

        event.preventDefault();

        const position =
            getPosition(event);

        context.lineTo(
            position.x,
            position.y
        );

        context.stroke();
    };

    const stopDrawing = event => {

        if (event) {
            event.preventDefault();
        }

        labRequestSignatureDrawing = false;
    };

    canvas.onmousedown = startDrawing;
    canvas.onmousemove = draw;
    canvas.onmouseup = stopDrawing;
    canvas.onmouseleave = stopDrawing;

    canvas.ontouchstart = startDrawing;
    canvas.ontouchmove = draw;
    canvas.ontouchend = stopDrawing;

    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";
}


function updateLabRequestSignatureStatus(hasSignature) {

    const status =
        document.getElementById(
            "labRequestSignatureStatus"
        );

    if (!status) {
        return;
    }

    status.textContent =
        hasSignature
            ? "Signature provided"
            : "Signature not provided";
}


function clearConsultationLabRequestSignature() {

    const canvas =
        document.getElementById(
            "labRequestSignaturePad"
        );

    if (!canvas) {
        return;
    }

    const context =
        canvas.getContext("2d");

    if (context) {
        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    updateLabRequestSignatureStatus(false);
}


async function saveConsultationLabRequest() {

    const consultationId =
        getActiveConsultationId();

    if (!consultationId) {
        showAlert(
            "No active consultation found.",
            "warning"
        );
        return;
    }

    const selectedTests =
        Array.from(
            document.querySelectorAll(
                ".lab-request-test:checked"
            )
        ).map(
            checkbox => checkbox.value
        );

    const otherTest =
        document.getElementById(
            "labRequestOtherTest"
        )?.value.trim();

    if (otherTest) {
        selectedTests.push(otherTest);
    }

    if (!selectedTests.length) {
        showAlert(
            "Please select at least one laboratory investigation.",
            "warning"
        );
        return;
    }

    const payload = {

        consultation_id:
            consultationId,

        requested_tests:
            selectedTests.join(", "),

        clinical_information:
            document.getElementById(
                "labRequestClinicalInformation"
            )?.value.trim() || null,

        requested_by:
            document.getElementById(
                "labRequestRequestedBy"
            )?.value.trim() || null,

        request_date:
            new Date().toISOString(),

        electronic_signature:
            document.getElementById(
                "labRequestSignaturePad"
            )?.toDataURL("image/png") || null
    };

    try {

        const response =
            await fetch(
                `${API_URL}/api/patients/${patientId}/lab-requests`,
                {
                    method: "POST",
                    headers: {
                        ...getAuthHeaders(),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to save laboratory request."
            );
        }

        showAlert(
            "Laboratory request saved successfully.",
            "success"
        );

        closeConsultationLabRequestModal();

        if (
            typeof loadLinkedLabRequests ===
            "function"
        ) {
            await loadLinkedLabRequests();
        }

    } catch (error) {

        console.error(
            "Consultation laboratory request error:",
            error
        );

        showAlert(
            error.message ||
            "Failed to save laboratory request.",
            "error"
        );
    }
}


function printConsultationLabRequest() {

    const printable =
        document.getElementById(
            "labRequestPrintable"
        );

    if (!printable) {
        showAlert(
            "Laboratory request form could not be printed.",
            "error"
        );
        return;
    }

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=900"
        );

    if (!printWindow) {
        showAlert(
            "Please allow pop-ups to print the laboratory request.",
            "warning"
        );
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Laboratory Request</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 30px;
                    color: #111;
                }

                * {
                    box-sizing: border-box;
                }

                input,
                textarea {
                    border: 1px solid #ccc;
                    padding: 6px;
                }

                button {
                    display: none;
                }

                canvas {
                    max-width: 500px;
                }
            </style>
        </head>
        <body>
            ${printable.innerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
    }, 300);
}


/* =====================================================
   END CONSULTATION LAB REQUEST POPUP
===================================================== */


