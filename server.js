const http = require("node:http"),
    fs = require("node:fs"),
    mime = require("mime"),
    dir = "public/",
    port = 3000;

// this defines the hr zones according to my coach
const HR_ZONES = [
    { name: "resting", min: 0, max: 117},
    { name: "UT2", min: 117, max: 126},
    { name: "UT1", min: 126, max: 156},
    { name: "AT", min: 157, max: 175 },
    { name: "TR", min: 176, max: 190},
    { name: "MHR", min: 191, max: 205 },
];

let workouts = []; //store workouts 

const server = http.createServer((request, response) => {
    if (request.method === "GET") {
        handleGet(request, response);
    } else if (request.method === "POST") {
        handlePost(request, response);
    }

    // Log the full URL
    const fullURL = `http://${request.headers.host}${request.url}`;
    console.log(fullURL);
});

// Handle GET requests
const handleGet = function(request, response) {
    const filename = dir + request.url.slice(1);

    if (request.url === "/") {
        sendFile(response, "public/index.html");
    } else if (request.url === "/workouts") {
        response.writeHeader(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(workouts)); // workouts data
        console.log(JSON.stringify(workouts));
    } else {
        sendFile(response, filename);
    }
};

// Handle POST requests
const handlePost = function(request, response) {
    let dataString = "";

    request.on("data", function(data) {
        dataString += data;
    });

    request.on("end", function() {
        try {
            const { heartrate, time, age, weight } = JSON.parse(dataString);
            if (!heartrate || !time || !age || !weight) {
                response.writeHeader(400, { "Content-Type": "application/json" });
                return response.end(JSON.stringify({ error: "heartrate, time, age, or weight missing" }));
            }

            console.log("going to calc calories");
            const caloriesBurned = Math.round(calcCalories(heartrate, time, age, weight));
            console.log(caloriesBurned);
            const zone = HR_ZONES.find(z => heartrate >= z.min && heartrate <= z.max) || HR_ZONES[0];
            const newWorkout = { heartrate, time, zone: zone.name, caloriesBurned, date: new Date().toISOString() };

            workouts.push(newWorkout);

            console.log(newWorkout);

            response.writeHeader(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(newWorkout));
        } catch (error) {
            response.writeHeader(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ error: "Invalid JSON format" }));
        }
    });
};

function calcCalories(heartrate, time, age, weight) {
    return ((time * (0.4472 * heartrate - 0.1263 * (weight*0.4536) + 0.074 * age - 20.4022))/4.184); 
    //this is the calories burned per workout calculator *for women*
}

const sendFile = function(response, filename) {
    const type = mime.getType(filename);

    fs.readFile(filename, function(err, content) {
        if (err === null) {
            response.writeHeader(200, { "Content-Type": type });
            response.end(content);
        } else {
            response.writeHeader(404);
            response.end("404 Error: File Not Found");
        }
    });
};

server.listen(process.env.PORT || port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
