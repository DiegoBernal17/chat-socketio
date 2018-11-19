const path = require('path')
const express = require('express');
const app = express();
const chalk = require('chalk');
console.log('Initializing...');

// settings
app.set('port', process.env.PORT || 3000);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// start server
const server = app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'))
});

// websockets
const SocketIO = require('socket.io');
const io = SocketIO(server);

let online = 0;
io.on('connection', (socket) => {
    console.log(chalk.green('new connection ', socket.id));
    io.sockets.emit('chat:online', ++online);

    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message', data);
    });

    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing', data);
    });

    socket.on('disconnect', (reason) => {
        let rooms = Object.keys(socket.rooms);
        console.log(chalk.red('finish connection ', socket.id));
        io.sockets.emit('chat:online', --online);
    });
});