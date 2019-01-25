WebSocket = require('ws');

//SERVER
var wss = new WebSocket.Server({
    port: 30682
});


wss.on('connection', function(client) {
    client.on('message', function(message) {
        console.log(message);
    });
});