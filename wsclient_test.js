#!/usr/bin/env node

function start_one_client(i) {
    console.log('WebSocket client started '+i);

    var WebSocketClient = require('websocket').client;

    var client = new WebSocketClient();
    var _id = new Date().getTime();

    client.on('connectFailed', function(error) {
        console.log((new Date()) + 'Connect Error: ' + error.toString());
        start_one_client(i);
    });

    client.on('connect', function(connection) {
        console.log('WebSocket client connected '+i);

        connection.on('error', function(error) {
            console.log((new Date()) + " Connection Error: " + error.toString());
            start_one_client(i);
        });

        connection.on('close', function() {
            console.log((new Date()) +' online protocol Connection Closed');
            start_one_client(i);
        });

        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                if (process.env.SHOW_MESSAGES) {
                    console.log("Received: '" + message.utf8Data + "'");
                }
            }
        });

        function sendNumber() {
            if (connection.connected) {
                var a = parseInt(Math.random()*100+1);
                var b = parseInt(Math.random()*100+1);
                msg = {sns_id:_id, data:{x:a, y:b}}
                connection.sendUTF(JSON.stringify(msg));
                setTimeout(sendNumber, 10000);
            }
        }
        sendNumber();
    });

    client.connect(process.env.TEST_URL, 'echo-protocol');
}

for(var i=0;i<process.env.CLIENT_COUNT;i++){
    console.log("start " + i + " websocket client");
    setTimeout(start_one_client, 10*i, i);
}
