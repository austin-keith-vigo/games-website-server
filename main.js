var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var Queue = require('./Queue');
var queue = new Queue();      // queue for the people waiting to play
var connections = [];         // list of all the sockets 
var socketIdsUsernames = [];  // Array of javascript objects that contain a sockets id and the username that is associated with the socket
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

    console.log('Connections: %s sockets connected', connections.length);

    // Generate a username for the user and sends it to the sender
    socket.on('newUser', function(data){
        var ID = function () {
            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return '_' + Math.random().toString(36).substr(2, 9);
            };

        // Keep making usernames until a completely unique one is found
        var newUsername = "";
        var newSocketId = socket.id;
        while(true) {
            newUsername = ID();
            if( socketIdsUsernames.includes({socketId: newSocketId, username: newUsername}) == false ) {
                break;
            }
        }
        
        // To keep tracking of users on the server
        socketIdsUsernames.push({socketId: newSocketId, username: newUsername});
        connections.push(socket);
        console.log("%s has connected", newUsername);

        // Update the user's status on the server, either playing or waiting to play
        if( player1 == null ) {
            player1 = newUsername;
            console.log("Player 1 is %s", player1);
        } else if( player2 == null && player1 != null ) {
            player2 = newUsername;
            console.log("Player 2 is %s", player2);
        } else {
            queue.enqueue(newUsername);
            console.log("%s has been placed in the queue", newUsername);
        }

        // Add to the lists to keep track of users and sockets and emit a message to the client about their username and the current board
        socket.emit('getUsernameAndBoard', {username: newUsername, board: game.toString()});
    });

    
    /*
    A user has made a move. Update the global game variable.
    emit event to all users to update their board with the new board.
    */
    socket.on('turn', function(data) {

        // Update the board
        game.move(data.row, data.col);
        var user = null;
        if(game.getTurn() == 1) {
            user = player1;
        }
        else {
            user = player2;
        }
        var board = game.toString();

        // Emit the board to all listeners
        io.sockets.emit('boardUpdated', {board: board, user: user})

        // Write to console to show state of the server
        console.log(user + " played")
    })

    /*
    A user disconnects from the server for any reasone.
    If they are a current player:
        - Restart the global game
        - Update the current players
    If they are not a current player:
        - Find them from the queue and remove them
    
    Start a new game
    Remove the socket and username from the lists 
    */
    socket.on('disconnect', (reason) => {
        
        // Find the username by comparing socketIds
        const socketId = socket.socketId;
        var username;
        for (let obj of socketIdsUsernames) {
            if (obj.socketId == socketId) {
                username = obj.username;
                break;
            }
        }

        // Check if they are a current player
        if( username == player1 || username == player2) {

            // Update the queue and the current players
            if( username == player1) {
                console.log(player2 + " is now player 1");
                player1 = player2;
            }
            player2 = queue.dequeue();
            console.log(player2 + " is now player 2");

            
        }
        else {
            // Remove them from the queue
            var newQueue = new Queue();
            const qSize = queue.size();
            for(var index = 0; index < qSize; ++index) {
                var user = queue.dequeue();
                if(user != username) {
                    newQueue.enqueue(user);
                }
            }
            queue = newQueue;
            console.log(username + " was removed from the queue");
        }

        // Start a new game and update lists
        game = new TicTacToe();
        var newList = [];
        socketIdsUsernames.forEach( ({currentSocketId, currentUsername}) => {
            if(username != currentUsername) {
                newList.push({socketId: currentSocketId, username: currentUsername});
            }
        });
        socketIdsUsernames = newList;
        console.log(socketIdsUsernames + " users left");
        console.log(socketIdsUsernames.length + " sockets left");
    });
});

