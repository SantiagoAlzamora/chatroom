const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin:"*",
        methods:["GET","POST"]
    },
    transports: ["websocket","polling"]
})

io.on("connection",(socket)=>{
    console.log("User connected");

    socket.on("joinRoom",(roomId)=>{
        socket.join(roomId)
        console.log("User joined to the room: ",roomId);
    })

    socket.on("sendMessage",(data)=>{
        socket.to(data.room).emit("receiveMessage",data)
    })

    socket.on("disconnect",()=>{
        console.log("disconnected");
    })
})

const PORT = process.env.PORT || 3001

server.listen(PORT,()=>{
    console.log("Server running on port ",PORT);
})