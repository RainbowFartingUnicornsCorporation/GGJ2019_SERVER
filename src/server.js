WebSocket = require('ws');

GameManager = require('./GameManager');

const port = 8080;

let names = ['Bob', 'Samus sans armure', 'Mike', 'Lara'];

//CREATING GAME MANAGER
let gameManager = new GameManager();
gameManager.generate(5);

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
                let n = names.pop();
                gameManager.createPlayer(ip, n,client);
                break;
            case "position" :
                //console.log('New position !');
               // console.log("x : " + data.x + ", y : " + data.y);
                gameManager.movePlayer(ip, data.x, data.y);
                break;
            case "activateFlux":
                console.log("Activate Flux");
                gameManager.activateFlux(ip);
                break;
            case "dropRscHome" : //5
                console.log("Drop ressource to home");
                gameManager.dropRscHome(ip);
                break;
            case "getRscHome" : //5
                console.log("Get ressource from home");
                gameManager.getRscHome(ip);
                break;
            default:
                console.log("Unrecognize event ...");
                console.log(message);
                break;
        }
    });
});