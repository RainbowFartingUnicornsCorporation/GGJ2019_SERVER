WebSocket = require('ws');
const port = 8080;
Player  = require('./Player');

let players = [];
let ressources = [];
let home;

//INITIALIZATION SERVER
const wss = new WebSocket.Server({
    port: port
});
console.log("Server listen on port "+port);

//ON NETWORK EVENT
wss.on('connection', function(client, request) {

    const ip = request.connection.remoteAddress;
    console.log('Request received from ' + ip);

    client.on('message', function(message) {
        const data = JSON.parse(message);
        switch (data.event) {
            case "new" :
                console.log("New player !");
                createPlayer(ip, data.name,client);
                break;
            case "position" :
                console.log('New player position !');
                console.log("x : " + data.x + ", y : " + data.y);
                break;
            case "collectRsc" : //id
                console.log("Collect ressource");
                collectRsc(ip, data.id);
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

/**
 *
 * @param ip
 * @param name
 * Create a new player and store it in player.
 * Use the IP as key
 */
function createPlayer(ip, name, client){
    players[ip] = new Player(name, 1, 4);
    client.send("BIEN !");
}

/**
 *
 * @param idRsc
 * Get some ressources from a source and gave it to the player
 */
function collectRsc(ip, idRsc){
    ressources[idRsc].takeRsc();
    players[ip].getRsc();
}

function activateFlux(){
    //TODO don't know how it will be
}