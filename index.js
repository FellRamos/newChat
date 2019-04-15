// git branch: br1

var express = require('express'),
    socket = require('socket.io');


// Server setup

var app = express();

//starting the server with app.listen, and save this to a var server.

var server = app.listen(8000, () => {
  console.log("listening on port 8000")
});


// middleware to serve static files (in public folder)
app.use(express.static('public'));


//socket setup ( 'server' is the name of the server we want to work with)
var io = socket(server);
var users = [];
var connections = [];


// connections on io.
io.on('connection', (socket) => {
  var socketID = socket.id;
  console.log('Somebody connected', socketID);
  connections.push(socket);
  console.log('Connections: %s sockets connected', connections.length);

  //Listening for chat messages from client, and resend these messages to all clients
  socket.on('chat-message', (data) => {
    io.emit('chat-message', data);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', (socket) => {
    connections.splice(connections.indexOf(socket),1);
    console.log(socketID + ' disconnected: %s sockets connected', connections.length);
  });


  socket.on('nick', (username) => {
    socket.emit('nick', username);
    socket.broadcast.emit('new_user', username);
  });







});
