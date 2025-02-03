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
        const meters = document.querySelector("#meters").value;
        const deleteEntryElement = document.querySelector("input[name='deleteEntry']:checked");
        const deleteEntry = deleteEntryElement ? deleteEntryElement.value === "yes" : false;

        if(!deleteEntry && (!heartrate || !time || !age || !weight || !meters)) {
            alert("You must fill out every question in the form.");
            console.log("hit error, here's the data:");
            console.log(heartrate);
            console.log(time);
            console.log(age);
            console.log(weight);
            console.log(meters);
            return;
        }

        const response = await fetch( "/submit", {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({heartrate: parseInt(heartrate), time: parseInt(time), age: parseInt(age), weight: parseInt(weight), meters: parseInt(meters), deleteEntry}),
        });
        const data = await response.json();
        updateTable();
    };

    async function updateTable() {
        const response = await fetch("/workouts");
        const workouts = await response.json();

        dataTable.innerHTML = "";
        workouts.forEach(({heartrate, time, zone, caloriesBurned, date, meters}) => {
            const row = `<tr>
                <td>${heartrate}</td>
                <td>${time}</td>
                <td>${zone}</td>
                <td>${meters}</td>
                <td>${caloriesBurned}</td>
                <td>${date}</td>
            </tr>`;
            dataTable.innerHTML += row;
        });
    }
    updateTable();
});