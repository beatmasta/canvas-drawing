var SOCKET_URL = 'http://localhost:8080';
var socket = io(SOCKET_URL);

socket.emit('joinRoom', 'userRoom');
socket.emit('joinRoom', 'drawRoom');