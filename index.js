const express=require('express');

const app = express();

require('dotenv').config();

const { connection } = require('./config/db');

const { userRouter } = require('./routes/user.route');

const { chatRouter } = require('./routes/chat.route');

const {messageRouter}=require('./routes/mesage.route')

const socketio = require('socket.io');


const http = require('http');

const server = http.createServer(app);

app.use(express.json())

app.use('/user', userRouter);

app.use('/chat',chatRouter);

app.use('/message',messageRouter)

server.listen(process.env.port, async() => {
    try {
        await connection;
        console.log('Connected to DB');
    } catch (error) {
        console.log({ 'Message': error.message });
        console.log(error);
    }
    console.log(`Server listening to port ${process.env.port}`);
})

const io = socketio(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('Connected')

    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log(`User joined the room ${room}`);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(userData._id)
  });
});