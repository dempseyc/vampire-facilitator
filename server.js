// not sure if we actually need express..  socket.io dependency?
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

const io = require('socket.io')(server);

server.listen(port, function () {
  console.log(`server listening at port ${port}`);
});

// routing
app.use(express.static(path.join(__dirname, 'public')));

// config
// add middlewares here
app.set('view engine','html');

// a place for server data
let gameData = {
  cards: [
    "camper",
    "camper",
    "camper",
    "vampire",
    "camper",
    "healer",
    "camper",
    "camper",
    "joker",
    "camper",
    "camper",
    "camper",
    "camper",
    "camper"
  ],
  clients: [],
  gameState: 0,
  players: [],
  };

// io is opening a context where client side functions calls can be received
io.on('connect', function (socket) {

  gameData.clients.push(socket);
  // the server is telling socket to connect and get a number
  // clients.length is a better basis for id, but  
  // perhaps their basis must be a unique reference,
  // like a random number of 10000 possibilities, and rest on that uniqueness..  
  socket.emit('connection', gameData.clients.length);

  // in the server here, socket.on() functions are recieving calls from the clients
  socket.on('register', function (name) {
    gameData.players.push(name);
    io.emit('update-names', gameData.players);
  });

  socket.on('disconnect', function (myNumber) {
    gameData.clients.splice(myNumber, 1); // might have to change this
    console.log(`client ${myNumber} disconected numClients = ${gameData.clients.length}`); // using backticks
  });

});
