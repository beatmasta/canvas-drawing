const HTTP_PORT = 8080;

const _ = require('lodash');

let clientData = {};

let handler = (req, res) => {

    fs.readFile(
        __dirname + '/index.html',
        (err, data) => {

            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);

        }
    );

};

let app = require('http').createServer(handler);
let io = require('socket.io')(app);
let fs = require('fs');

app.listen(HTTP_PORT);

app.on('listening', () => {
    console.log('Node back-end listening on', '*:' + HTTP_PORT);
});

io.on('connection', socket => {

    let clientId = socket.client.id;

    clientData[clientId] = {};

    console.log('New socket.io connection with id:', clientId);

    let userSendInterval = setInterval(() => {
        io.in('userRoom').emit('userDataList', clientData);
    }, 1000);

    socket.on('setUserData', userData => {
        clientData[clientId] = {...clientData[clientId], ...userData};
    });

    socket.on('joinRoom', roomName => {
        socket.join(roomName);
    });

    socket.on('drawData', data => {
        socket.broadcast.to('drawRoom').emit('drawData', data);
    });

    socket.on('disconnect', () => {
        clearInterval(userSendInterval);
        delete clientData[clientId];
    });

});