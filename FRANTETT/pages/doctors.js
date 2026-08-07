async function loadDoctors() {

    const response = await fetch("http://localhost:3000/api/doctors");

    const doctors = await response.json();

    console.log(doctors);

}

loadDoctors();