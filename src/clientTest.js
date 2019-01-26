WebSocket = require('ws');

const warrowsIP = "10.16.178.141";
const benIP = "10.16.178.105";

const ws = new WebSocket('ws://'+benIP+':8080');


ws.on('open', function open() {
    console.log('connected to central');

    ws.send('{"event":"new","name":"Bob"}');
});

ws.on('message', function(message) {
    console.log(message);
});
