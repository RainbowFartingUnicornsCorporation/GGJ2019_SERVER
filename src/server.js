WebSocket = require('ws');
const port = 30682;

//INITIALIZATION PLAYER >> TESTING
var testRunner  = require('./TestAll');
testRunner();

//INITIALIZATION SERVER
const wss = new WebSocket.Server({
    port: port
});
console.log("Server listen on port "+port);

wss.on('connection', function(client, request) {
    const ip = request.connection.remoteAddress;
    console.log('Request received from ' + ip);
    client.on('message', function(message) {
        const data = JSON.parse(message);

        switch (data.event) {
            case "position" :
                console.log('New player position !');
                console.log("x : " + data.x + ", y : " + data.y);
                break;
            case "collectRsc" : //id
                console.log("Collect ressource");
                break;
            case "activateFlux": //id
                console.log("Activate Flux");
                break;
            case "dropRscHome" : //5
                console.log("Drop ressource to home");
                break;
            case "getRsvHome" : //5
                console.log("Get ressource from home");
                break;
            case "motivateFlux": //id
                break;
            default:
                console.log("Unrecognize event ...");
                console.log(message);
                break;
        }
    });
});
