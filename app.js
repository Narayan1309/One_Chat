const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const moment = require('moment');
const { locale } = require('moment');

const app = express();
const PORT = 3000 || process.env.PORT

let users = []

const server = http.createServer(app)
const io = socketio(server)

app.use(express.static('./public'))

app.get('/',(req,res) => {
    res.sendFile('./public/index.html')
})

io.on('connection', (socket) => {

    socket.on('joinChannel',username => {
        socket.emit('message',formatMessage('One Chat Bot',`Hi ${username} , Welcome to One Chat`))

        socket.broadcast.emit('message',formatMessage('One Chat Bot',`${username} has joined the chat`))

        users.push(username)
        io.emit('updateUsers',users)

        socket.on('chatmessage',chatmessage => {
            io.emit('message',formatMessage(username,chatmessage.content))
        })

        socket.on('disconnect',() => {
            users.splice(users.indexOf(username),1)
            io.emit('updateUsers',users)
            io.emit('message',formatMessage('One Chat Bot',`${username} has left the chat`))
        })
    })    
})

server.listen(PORT,()=>console.log(`Sever running on port ${PORT}`))

const formatMessage = (username,content) => {
    return ({
        username: username,
        content: content,
        time: moment().add(5,'hours').add(30,'minutes').format('h:mm a')
    });
}
