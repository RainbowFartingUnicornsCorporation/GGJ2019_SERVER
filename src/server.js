WebSocket = require('ws');
/*

Client

const ws = new WebSocket('ws://localhost:30682');


ws.on('open', function open() {
    console.log('connected to central');
    identify();
});
*/


//SERVER
var wss = new WebSocketServer({
    server: server
});