const express = require('express');
const bodyParser = require('body-parser');
const ip = require("ip");
const http = require('http');
const WebSocket = require('ws'); 
const cors = require('cors');

const pkgInfo = require('./package.json');
const Service = require('webos-service');
const axios = require('axios');

const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = `[${pkgInfo.name}]`;

const IP_ADDRESS = ip.address();
const PORT = 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const EXT_SERVER_URL = "http://192.168.206.250:9000";

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
        text: "나는 오늘 끝내주게 숨을 쉬었다. :)",
        score: 10,
    },
    {
        createdAt: "2023-10-20T07:01:46.687Z",
        text: "나는 오늘 멋지게 숨을 쉬었다. ;>",
        score: 8,
    },
];

let sessionData = []; // 활동량 데이터
let SleepSessionData = []; // 수면 데이터

app.post('/api/healthdata', (req, res) => {
    const userData = req.body;

    if (userData.incomHR) {
        // incomHR 데이터 그대로 저장
        sessionData.push({
            incomHR: userData.incomHR,
            totalHR: userData.totalHR,
            totalcal: userData.totalcal,
            totalsteps: userData.totalsteps,
            uid: userData.uid
        });
        console.log('Data received and stored.',sessionData);
    }

    // ...
    if (userData.SleepSessions) {
        const rawData = userData.SleepSessions; // userData.SleepSessions 값을 rawData 변수에 할당

        // 데이터를 파싱하여 JavaScript 객체로 변환
        const sleepData = {};

        // 정규 표현식을 사용하여 데이터 파싱
        const pattern = /(\w+:\s(?:'[^']*'|[^,]+))/g;
        let match;
        while ((match = pattern.exec(rawData)) !== null) {
            const parts = match[1].split(': ');
            const key = parts[0];
            const value = parts[1];

            // 값이 날짜 형식인 경우 Date 객체로 변환
            if (key === 'Start Time' || key === 'End Time') {
                value = new Date(value);
            }

            // Notes 및 Title 파싱
            if (key === 'Title' || key === 'Notes') {
                value = value.trim(); // 필요하다면 공백을 제거
            }

            // Duration 파싱
            if (key === 'Duration') {
                value = value.trim(); // 필요하다면 공백을 제거
            }

            sleepData[key] = value;
        }
        
        // Start Time과 End Time을 Date 객체로 변환
        sleepData['Start Time'] = new Date(sleepData['Start Time']);
        sleepData['End Time'] = new Date(sleepData['End Time']);

        // Stages 파싱
        const stagesPattern = /Stage: (\d+)\nStart Time: ([^\n]+)\nEnd Time: ([^\n]+)/g;
        sleepData['Stages'] = [];
        while ((match = stagesPattern.exec(rawData)) !== null) {
        const stage = {
            Stage: parseInt(match[1]),
            'Start Time': new Date(match[2]),
            'End Time': new Date(match[3])
        };
        sleepData['Stages'].push(stage);
        }

        // 필요한 정보를 함께 표현
        const SleepfinalData = {
        UID: sleepData['UID'],
        Title: sleepData['Title'],
        Notes: sleepData['Notes'],
        'Start Time': sleepData['Start Time'],
        'End Time': sleepData['End Time'],
        Duration: sleepData['Duration'],
        Stages: sleepData['Stages']
        };

        console.log(SleepfinalData);
        SleepSessionData.push(SleepfinalData);
    }  
    
    
    //console.log(userData);
    res.sendStatus(200); 
});

// app.get('/api/sleepdata', (req, res) => {
//     if(SleepSessionData.length > 0){
//         res.json(SleepSessionData);
//     }
//     else{
//         const mok ={
//             UID: 'c3573604-6cf0-4387-b80a-8cdfb7f40df9\nTitle',
//             Title: undefined,
//             Notes: undefined,
//             'Start Time': "Invalid Date",
//             'End Time': "Invalid Date",
//             Duration: "undefined",
//             Stages: [
//                 {
//                 Stage: 5,
//                 'Start Time': "2023-10-04T10:06:00.000Z",
//                 'End Time': "2023-10-04T10:46:00.000Z"
//                 },
//                 {
//                 Stage: 5,
//                 'Start Time': "2023-10-04T10:46:00.000Z",
//                 'End Time': "2023-10-04T11:59:00.000Z"
//                 },
//                 {
//                 Stage: 5,
//                 'Start Time': "2023-10-04T11:59:00.000Z",
//                 'End Time': "2023-10-04T13:43:00.000Z"
//                 },
//                 {
//                 Stage: 4,
//                 'Start Time': "2023-10-04T13:43:00.000Z",
//                 'End Time': "2023-10-04T15:00:00.000Z"
//                 },
//                 {
//                 Stage: 3,
//                 'Start Time': "2023-10-04T15:00:00.000Z",
//                 'End Time': "2023-10-04T16:14:00.000Z"
//                 },
//                 {
//                 Stage: 6,
//                 'Start Time': "2023-10-04T16:14:00.000Z",
//                 'End Time': "2023-10-04T17:01:00.000Z"
//                 },
//                 {
//                 Stage: 1,
//                 'Start Time': "2023-10-04T17:01:00.000Z",
//                 'End Time': "2023-10-04T18:49:00.000Z"
//                 },
//                 {
//                 Stage: 4,
//                 'Start Time': "2023-10-04T18:49:00.000Z",
//                 'End Time': "2023-10-04T20:42:00.000Z"
//                 },
//                 {
//                 Stage: 2,
//                 'Start Time': "2023-10-04T20:42:00.000Z",
//                 'End Time': "2023-10-04T22:26:00.000Z"
//                 },
//                 {
//                 Stage: 2,
//                 'Start Time': "2023-10-04T22:26:00.000Z",
//                 'End Time': "2023-10-04T22:56:00.000Z"
//                 }
//             ]
//         }
//         res.json(mok);
//     }
    
// });

// app.get('/api/walkdata',(req, res) =>{
//     res.json(sessionData);
// });

service.register("getSleepData", (message)=>{
    console.log(logHeader, "SERVICE_METHOD_CALLED:/getSleepData");

    message.respond({
        returnValue: true,
        // Response: JSON.stringify(sessionData),
        Response: SleepSessionData,
    }); 
});

service.register("getWalkData", (message)=>{
    console.log(logHeader, "SERVICE_METHOD_CALLED:/getWalkData");

    message.respond({
        returnValue: true,
        // Response: JSON.stringify(sessionData),
        Response: sessionData,
    });    
});

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

    axios.post(`${EXT_SERVER_URL}/Diary`, {
        text: data.text,
    })
    .then((response)=>{
        console.log("????", response);
        data["score"] = response.data.score;
        diaryList.push(data);
        console.log(diaryList);
        message.respond({
            returnValue: true,
            Response: JSON.stringify(diaryList),
        });
    })
    .catch((error)=>{
        console.log(error);
        message.respond({
            returnValue: false,
            Response: JSON.stringify(diaryList),
        });
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