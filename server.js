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
    "camper"
  ],
  clients: [],
  numClients: 0,
  gameState: 0,
  players: [],
  };

// io is opening a context where client side functions calls can be received
io.on('connection', function (socket) {

  gameData.clients.push(socket);
  gameData.numClients += 1;
  // the server is telling socket to connect and get a number
  socket.emit('connection', gameData.numClients); 
  // you cant change this to 'connect'  something about socket.io
  // gameData.numClients gives the client a number

  // do i need socket on connect?

  // in the server here, socket.on() functions are recieving calls from the clients
  socket.on('register', function (name, number) {
    gameData.players.push(name);
  });

  socket.on('disconnect', function () {
    let clientIndex = gameData.clients.indexOf(socket);
    gameData.clients.splice(clientIndex, 1);
    gameData.numClients -= 1;
    console.log(`client ${clientIndex} disconected numClients = ${gameData.numClients}`); // using backticks
  });

});
