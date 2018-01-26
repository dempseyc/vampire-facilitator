// let $body = $('body');
// uiTargets and dataDisplay should prolly be part of a page construction of some sort

// app level JQ supports
// let pageNum = 0;

// let $page = $('#page');
// let $pageNumber = $(`.page-${pageNum}`);

let $uiTargets = $('#ui-targets');
let $dataDisplay = $('#data-display');

let myName = "";

// i could have a class of uitargetss that submit names, first to register, then to vote
// or something like that.

let $name = $('<form>name:<br><input type="text" name="name"><input type="submit" value="Submit"></form>');

$name.submit(function( event ) {
  event.preventDefault();
  myName = $name.find('input[name="name"]').val();
  updateData(myName);
});

$uiTargets.append($name);

/* 
start doing socket stuff 
prolly want to call some functions in here that change a display on a higher order
*/

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

socket.on('update-names', function (nameArray) {
  // do something with data display and nameArray
  console.log(nameArray);  // works
});

// step 3


socket.on('disconnect', function (myClientIndex) {
  // socket.emit is calling functions on the server from the client side
  socket.emit('disconnect', myClientIndex); // client transport close google it
});

// updateData is called when a client interacts with the UI target
// data is shared with all clients through the server
function updateData (data) {
  socket.emit('register', data);
  console.log(data); // this works fine, the data is a string, the val in the form
}
