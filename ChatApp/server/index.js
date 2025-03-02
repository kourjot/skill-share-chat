import express from "express"
import http from "http"
import { Server} from  "socket.io"
const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {}; 
app.use(express.static('./client'));
io.on("connection",(socket)=>{
    console.log("user connected",socket.id)
    socket.on("login",(username)=>{
        users[socket.id]=username
        io.emit("update-users",Object.values(users))
        console.log(`${username} logged in`)
    });
    socket.on("send-message",(message)=>{
        const  username=users[socket.id]
        io.emit("receive-message",{username,message})
    })
    socket.on('typing', (status) => {
        const username = users[socket.id];
                socket.broadcast.emit('typing', { username, status }); 
    });
    socket.on('disconnect', () => {
        const username = users[socket.id];
            delete users[socket.id]; 
                io.emit('update-users', Object.values(users)); 
                console.log(`${username} disconnected.`);
        });

})

server.listen(1212, () => {
    console.log('Server running at http://localhost:1212');
});