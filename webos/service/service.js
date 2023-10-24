const express = require('express');
const bodyParser = require('body-parser');
const ip = require("ip");
const http = require('http');
const WebSocket = require('ws'); 
const cors = require('cors');

const pkgInfo = require('./package.json');
const Service = require('webos-service');

const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = `[${pkgInfo.name}]`;

const IP_ADDRESS = ip.address();
const PORT = 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); 

app.use(cors());
app.use(bodyParser.json());

let userInfo = {
    "name" : "홍길동",
    "birthdate" : "2002. 08. 19.",
    "address" : "서울특별시 노원구 공릉로 232 1층",
    "phonenumber" : "010-1234-5679",
};

let diaryList = [
    {
        createdAt: "2023-10-12T07:01:46.687Z",
        text: "나는 오늘 끝내주게 숨을 쉬었다. :)"
    },
    {
        createdAt: "2023-10-20T07:01:46.687Z",
        text: "나는 오늘 멋지게 숨을 쉬었다. ;>"
    },
];

service.register("getUserInfo", (message)=>{
    console.log(logHeader, "SERVICE_METHOD_CALLED:/getUserInfo");

    message.respond({
        returnValue: true,
        Response: JSON.stringify(userInfo),
    });
});

service.register("setUserInfo", (message)=>{
    let data = message.payload.data;
    console.log(logHeader, "SERVICE_METHOD_CALLED:/setUserInfo | ", data);

    Object.assign(userInfo, data);

    message.respond({
        returnValue: true,
        Response: JSON.stringify(userInfo),
    });
});

service.register("getDiaryList", (message)=>{
    console.log(logHeader, "SERVICE_METHOD_CALLED:/getDiaryList");

    message.respond({
        returnValue: true,
        Response: JSON.stringify(diaryList),
    });
});

service.register("addDiary", (message)=>{
    let data = message.payload.data;
    if(typeof(data) == String) {
        data = JSON.parse(data);
    }

    console.log(logHeader, "SERVICE_METHOD_CALLED:/addDiary | ", data);

    diaryList.push(data);

    message.respond({
        returnValue: true,
        Response: JSON.stringify(diaryList),
    });
});

let ledStatus = {
    "id" : "LED001",
    "r" : 0,
    "g" : 0,
    "b" : 0,
};

// service.register("light/getAutoConfig");
// service.register("light/setAutoConfig");
// service.register("light/getStatus");

service.register("light/setStatus", (message)=>{
    let data = message.payload.data;
    if(typeof(data) == String) {
        data = JSON.parse(data);
    }

    console.log(logHeader, "SERVICE_METHOD_CALLED:/light/setStatus | ", data);

    Object.assign(ledStatus, data);
    console.log("Debug >>> ", ledStatus);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(ledStatus));
        }
    });

    message.respond({
        returnValue: true,
        Response: JSON.stringify(ledStatus),
    });
});

service.register("startServer", (message)=>{
    wss.on('connection', (ws) => {
        console.log('WebSocket connected');
        
        ws.on('message', (message) => {
            console.log('Received message:', message);
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });
    
        ws.on('close', () => {
            console.log('WebSocket disconnected');
        });
    });

    // 서버 시작
    server.listen(PORT, () => {
        console.log(`Server is running at http://${IP_ADDRESS}:${PORT}`);
    });

    // ==== heartbeat 구독
    const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {subscribe: true});
    const max = 500;
    let count = 0;
    sub.addListener("response", function(msg) {
        console.log(JSON.stringify(msg.payload));
        if (++count >= max) {
            sub.cancel();
            setTimeout(function(){
                console.log(max+" responses received, exiting...");
                process.exit(0);
            }, 1000);
        }
    });

    message.respond({
        returnValue: true,
        Response: "Server started",
    });
});

// handle subscription requests
const subscriptions = {};
let heartbeatinterval;
let x = 1;
function createHeartBeatInterval() {
   if (heartbeatinterval) {
       return;
   }
   console.log(logHeader, "create_heartbeatinterval");
   heartbeatinterval = setInterval(function() {
       sendResponses();
   }, 1000);
}

// send responses to each subscribed client
function sendResponses() {
   console.log(logHeader, "send_response");
   console.log("Sending responses, subscription count=" + Object.keys(subscriptions).length);
   for (const i in subscriptions) {
       if (Object.prototype.hasOwnProperty.call(subscriptions, i)) {
           const s = subscriptions[i];
           s.respond({
               returnValue: true,
               event: "beat " + x
           });
       }
   }
   x++;
}

var heartbeat = service.register("heartbeat");

heartbeat.on("request", function(message) {
   console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat");
   message.respond({event: "beat"}); // initial response 
   if (message.isSubscription) { 
       subscriptions[message.uniqueToken] = message; //add message to "subscriptions" 
       if (!heartbeatinterval) {
           createHeartBeatInterval();
       }
   } 
});

heartbeat.on("cancel", function(message) { 
   delete subscriptions[message.uniqueToken]; // remove message from "subscriptions" 
   var keys = Object.keys(subscriptions); 
   if (keys.length === 0) { // count the remaining subscriptions 
       console.log("no more subscriptions, canceling interval"); 
       clearInterval(heartbeatinterval);
       heartbeatinterval = undefined;
   } 
});