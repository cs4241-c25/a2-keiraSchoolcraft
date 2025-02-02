// FRONT-END (CLIENT) JAVASCRIPT HERE

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const dataTable = document.querySelector("#results tbody");

    // i wanted to do an event listener so it makes life a little easier on the html side
    // also its just cooler and this is how we did it in softeng
    form.onsubmit = async function (event) {
        // stop form submission from trying to load
        // a new .html page for displaying results...
        // this was the original browser behavior and still
        // remains to this day
        event.preventDefault();
        
        const heartrate = document.querySelector("#heartrate").value;
        const time = document.querySelector("#time").value;
        const age = document.querySelector("#age").value;
        const weight = document.querySelector("#weight").value;

        if(!heartrate || !time || !age || !time) {
            alert("You must fill out every question in the form.");
            return;
        }
        const response = await fetch( "/submit", {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({heartrate: parseInt(heartrate), time: parseInt(time), age: parseInt(age), weight: parseInt(weight)}),
        });
        const data = await response.json();
        updateTable();
    };

    async function updateTable() {
        const response = await fetch("/workouts");
        const workouts = await response.json();

        dataTable.innerHTML = "";
        workouts.forEach(({heartrate, time, zone, caloriesBurned, date}) => {
            const row = `<tr>
                <td>${heartrate}</td>
                <td>${time}</td>
                <td>${zone}</td>
                <td>${caloriesBurned}</td>
                <td>${date}</td>
            </tr>`;
            dataTable.innerHTML += row;
        });
    }
    updateTable();
});