WebSocket = require('ws');
/*

Client

const ws = new WebSocket('ws://localhost:30682');


ws.on('open', function open() {
    console.log('connected to central');
    identify();
});
*/



var player  = require('./Player');
player.initialization("Maxipanda",1,4);
console.log(player.getInfo());

//SERVER
var wss = new WebSocketServer({
    server: server
});
