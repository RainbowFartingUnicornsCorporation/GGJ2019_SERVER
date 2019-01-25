WebSocket = require('ws');

//SERVER
var wss = new WebSocket.Server({
    port: 30682
});


var player  = require('./Player');
player.initialization("Maxipanda",1,4);
console.log(player.getInfo());
wss.on('connection', function(client) {
    client.on('message', function(message) {
        console.log(message);
    });
});
