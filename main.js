var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];
var connections = [];

server.listen(3000);
console.log('Server running...');
app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connections: %s sockets connected', connections.length);
});

