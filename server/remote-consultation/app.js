// setting server
const socketIo = require("socket.io");
const express = require("express");
const cors = require('cors');
const ip = require('ip');
const fs = require('fs');
const path = require('path');

const IP_ADDRESS = ip.address();
const PORT = 9000;

const app = express();
app.use(cors())
app.use(express.static(__dirname + "/public")); // load files below /public
app.use(express.static(__dirname + "/counselorMainPage")); // load files below /public
app.use(express.static(__dirname + '/node_modules'));

// const http = require("http");
// const options = {};
// const server = http.createServer(options, app);

const https = require("https");
const options = {
    key: fs.readFileSync('cert-files/key.pem'),
    cert: fs.readFileSync('cert-files/cert.pem'),
    // ca: fs.readFileSync('C:/Windows/System32/server.csr'),
};
const server = https.createServer(options, app);

const io = socketIo(server);

app.get('/client', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/client/index.html'));
});

app.get('/counselor', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/counselor/index.html'));
});

app.get('/main', (req, res)=>{
    res.sendFile(path.join(__dirname, 'counselorMainPage/counselor.html'));
});

let broadcasters = [];
io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
    // console.log("a");
    socket.on("broadcaster", () => {
        if(!broadcasters.includes(socket.id)) {
            broadcasters.push(socket.id);
        }
        console.log(broadcasters);
        socket.broadcast.emit("broadcaster"); // to all id
        // console.log("b", socket.id);
    });
    socket.on("watcher", () => {
        console.log("c", socket.id);
        broadcasters.forEach(broadcaster => {
            if(socket.id != broadcaster) {
                socket.to(broadcaster).emit("watcher", socket.id);
            }
        });
    });
    socket.on("disconnect", () => {
        broadcasters.forEach(broadcaster => {
            if(socket.id != broadcaster) {
                socket.to(broadcaster).emit("disconnectPeer", socket.id);
                // console.log("d", socket.id);
            }
        });
    });

    // initiate webrtc
    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
        // console.log("e");
    });
    socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
        // console.log("f");
    });
    socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
        // console.log("g", socket.id);
    });
    socket.on("watcher-candidate", (id, message) => {
        socket.to(id).emit("watcher-candidate", socket.id, message);
        // console.log("g", socket.id);
    });
});

server.listen(PORT, '0.0.0.0', () => console.log(`Server is running...\n[client] https://${IP_ADDRESS}:${PORT}/client\n[counselor] https://${IP_ADDRESS}:${PORT}/counselor\n[main] https://${IP_ADDRESS}:${PORT}/main`));
