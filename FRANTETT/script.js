const form = document.querySelector(".appointment-form");
const appointmentsDiv = document.getElementById("appointments");

if (form) {

    form.addEventListener("submit", function(event){

        event.preventDefault();

        const name = form.elements[0].value;
        const email = form.elements[1].value;
        const phone = form.elements[2].value;
        const date = form.elements[3].value;
        const doctor = form.elements[4].value;

        const appointment = document.createElement("div");

        appointment.innerHTML = `
    <h3>${name}</h3>
    <p>Email: ${email}</p>
    <p>Phone: ${phone}</p>
    <p>Date: ${date}</p>
    <p>Doctor: ${doctor}</p>

    <button class="delete-btn">Delete</button>

    <hr>
`;

        appointmentsDiv.appendChild(appointment);
        const deleteButton = appointment.querySelector(".delete-btn");

deleteButton.addEventListener("click", function () {
    appointment.remove();
});

        alert("Appointment booked successfully!");

        form.reset();

    });

}