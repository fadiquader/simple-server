const http = require('http')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');

const apis = require('./routes');
const subscribeChannels = require('./subscribeChannels');

const app = express();

app.use(cors('*'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/v1', apis);


const PORT = 3091;
const SOCKET_PORT = 3092;

const server = require('http').createServer(app)
const io = socketIo(server)
io.use(function (socket, next) {
    const token = socket.handshake.query.token;
    console.log('Socket: ', token)
    if (token) {
        return next();
    }
    return next(new Error('authentication error'));
});

io.on('connection', function (client) {
    subscribeChannels(client)
});

server.listen(PORT, function (err) {
    if(err) throw err;

    io.listen(SOCKET_PORT)

    console.log('Server is listening at port: '+PORT)
});

