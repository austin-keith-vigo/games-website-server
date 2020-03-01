var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];         // list of all the users
var connections = [];   // list of all the sockets 

// Open server on port 5000
server.listen(5000);
console.log('Server running...');

// Open express app
app.get('/', function(request, response){
    // Simple html for the express app
    response.sendFile(__dirname + '/index.html');
});

// What happens when a user creates a socket to this api
io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connections: %s sockets connected', connections.length);
    var ID = function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
        };
    var username = ID();
    users.push(username);

    // Generate a username for the user and sends it to the sender
    socket.on('newUser', function(data){
        var ID = function () {
            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return '_' + Math.random().toString(36).substr(2, 9);
            };
        var username = ID();
        users.push(username);
        console.log("%s has connected", username);
        socket.emit('getUsername', {username: username});
    })
});

