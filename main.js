var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var Queue = require('./Queue');
var queue = new Queue();  // queue for the people waiting to play
var connections = [];   // list of all the sockets 
var player1 = null;
var player2 = null;

/*
Create a global game for everyone to see. Each user has a status on the server.
They are either playing or watching. If they are watching, they will not be able to 
write to the current game. This is made sure by the client as well as the server by checking
the usernames before writing. If they are playing, the user will only have write access if 
it is their turn;
*/
var TicTacToe = require('./TicTacToe');
var game = new TicTacToe();

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

    // Generate a username for the user and sends it to the sender
    socket.on('newUser', function(data){
        var ID = function () {
            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return '_' + Math.random().toString(36).substr(2, 9);
            };
        var username = ID();
        console.log("%s has connected", username);

        // Update the user's status on the server, either playing or waiting to play
        if( player1 == null ) {
            player1 = username;
            console.log("Player 1 is %s", player1);
        } else if( player2 == null && player1 != null ) {
            player2 = username;
            console.log("Player 2 is %s", player2);
        } else {
            queue.enqueue(username);
            console.log("%s has been placed in the queue", username);
        }

        socket.emit('getUsernameAndBoard', {username: username, board: game.toString()});
    });

});

