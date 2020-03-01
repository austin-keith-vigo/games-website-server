var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];
var connections = [];

server.listen(5000);
console.log('Server running...');

app.get('/', function(request, response){

    // Simple html for the express app
    response.sendFile(__dirname + '/index.html');
});

// What happens when a user creates a socket to this api
io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connections: %s sockets connected', connections.length);

});

