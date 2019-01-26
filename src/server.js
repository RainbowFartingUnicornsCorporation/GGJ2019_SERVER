WebSocket = require('ws');

GameManager = require('./GameManager');

const port = 8080;

//CREATING GAME MANAGER
let gameManager = new GameManager();

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
                gameManager.createPlayer(ip, data.name,client);
                break;
            case "position" :
                console.log('New position !');
                console.log("x : " + data.x + ", y : " + data.y);
                gameManager.movePlayer(ip, x, y);
                break;
            case "collectRsc" : //id
                console.log("Collect ressource");
                gameManager.collectRsc(ip, data.id);
                break;
            case "activateFlux": //id
                console.log("Activate Flux");
                //TODO see bellow
                break;
            case "dropRscHome" : //5
                console.log("Drop ressource to home");
                gameManager.dropRscHome(ip);
                break;
            case "getRsvHome" : //5
                console.log("Get ressource from home");
                gameManager.getRscHome(ip);
                break;
            case "motivateFlux": //id
                //TODO see bellow
                break;
            default:
                console.log("Unrecognize event ...");
                console.log(message);
                break;
        }
    });
});