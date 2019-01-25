WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:30682');


ws.on('open', function open() {
    console.log('connected to central');


    ws.send('cctvvmb');
});
