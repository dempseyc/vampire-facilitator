let $body = $('body');
let $uiTarget = $('#ui-target');
let $dataDisplay = $('#data-display');

let myName = "";

// i could have a class of uitargets that submit names, first to register, then to vote
// or something like that.

let $name = $('<form>message:<br><input type="text" name="name"><input type="submit" value="Submit"></form>');

$name.submit(function( event ) {
  event.preventDefault();
  myName = $name.find('input[name="name"]').val();
  updateData(myName);
});

$body.add($name);
$uiTarget.append($name);

var socket = io();
// console.log(socket);

let myClientIndex;

// the socket.on() functions are receiving calls from the server
// step 1
socket.on('connection', function (clientIndex) {
  myClientIndex = clientIndex;
  console.log('you are connected, client ', clientIndex);
});

// step 2
socket.on('give-name', function () {
  let name = myName;
  socket.emit('register', myName, myClientIndex);
  console.log('you are registered as', myName);
});

socket.on('disconnect', function () {
  // socket.emit is calling functions on the server from the client side
  socket.emit('disconnect');
});

// updateData is called when a client interacts with the UI target
// data is shared with all clients through the server
function updateData (data) {
  socket.emit('register', data);
}
