// setting server
const socketIo = require("socket.io");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const ip = require('ip');
const fs = require('fs');
const path = require('path');

const IP_ADDRESS = ip.address();
const PORT = 9000;

const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(express.static(__dirname + "/public")); // load files below /public
app.use(express.static(__dirname + "/public/client")); // load files below /public
app.use(express.static(__dirname + "/public/counselor")); // load files below /public
app.use(express.static(__dirname + "/public/assets")); // load files below /public
app.use(express.static(__dirname + '/node_modules'));

const http = require("http");
const options = {};
const server = http.createServer(options, app);

// const https = require("https");
// const options = {
//     key: fs.readFileSync('cert-files/key.pem'),
//     cert: fs.readFileSync('cert-files/cert.pem'),
//     // ca: fs.readFileSync('C:/Windows/System32/server.csr'),
// };
// const server = https.createServer(options, app);

const io = socketIo(server);

app.get('/client', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/client/index.html'));
});

app.get('/main', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/counselor/index.html'));
});

// POST 요청을 처리하는 엔드포인트
app.post('/api/user', (req, res) => {
    const userData = req.body;

    // 여기에서 userData를 사용하거나 저장하는 작업을 수행할 수 있습니다.
    // 예를 들어 데이터베이스에 저장하거나 다른 처리를 수행할 수 있습니다.

    console.log('Received user data:', userData);

    // 클라이언트에 응답을 보냅니다.
    res.sendStatus(200); // 성공적인 응답을 보냅니다.
});

app.post('/Diary', (req, res)=>{
    let data = req.body;
    if(typeof(data) == 'string') {
        data = JSON.parse(data);
    }
    console.log(data.text);

    const receivedText = data.text;
    
    fs.writeFile('./ml_files/input.txt', receivedText, (err) => {
        if (err) {
          console.error('Error saving text:', err);
        } else {
          console.log('Text saved successfully.');
        }
    });

    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['./machine_learning/main.py']);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      const value = data.toString();
      console.log(`stdout: ${value}`);
      stdoutData += value;
    });

    pythonProcess.stderr.on('data', (data) => {
      const value = data.toString();
      console.error(`stderr: ${value}`);
      stderrData += value;
    });

    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      
      fs.readFile('./ml_files/output.txt', 'utf-8', (err, data)=>{
        if (err) {
          console.error(err);
          return;
        }
        console.log(data);
        res.json({"score" : Number(data)});
      });
    });
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

server.listen(PORT, '0.0.0.0', () => console.log(`Server is running...\n[client] http://${IP_ADDRESS}:${PORT}/client\n[main] http://${IP_ADDRESS}:${PORT}/main`));
