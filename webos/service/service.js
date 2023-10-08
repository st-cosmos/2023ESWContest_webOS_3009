/*
 * Copyright (c) 2020-2023 COSMOS, Seoultech.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const pkgInfo = require('./package.json');
const Service = require('webos-service');

const express = require("express");
const cors = require('cors');
const http = require("http");
const socketio = require("socket.io");

const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = `[${pkgInfo.name}]`;

const HOSTNAME = '0.0.0.0';
const PORT = 9000;

// setting server
const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: `http://${HOSTNAME}:${PORT}`,
        methods: ["GET", "POST", "PUT", "PATCH"],
    }
});

io.sockets.on("error", e => console.log(e));

const setLed = (r, g, b) => {
    const cmd = {
        "deviceID" : "LED001",
        "r" : r, 
        "g" : g, 
        "b" : b, 
    };

    io.emit("setLed", cmd);
};

// const socketHandler = (socket) => {

// };

service.register("setLed", (message)=>{
    const color = message.payload;
    setLed(color.r, color.g, color.b);

    message.respond({
        returnValue: true,
        Response: "Set LED Ok",
    });
});

service.register("startServer", (message) => {
    // let res;
    // try {
    //     io.sockets.on("connection", socketHandler);
    //     server.listen(PORT, HOSTNAME, () => console.log(`Server is running on port http://${HOSTNAME}:${PORT}`));

    //     // ==== heartbeat 구독
    //     const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {subscribe: true});
    //     const max = 500;
    //     let count = 0;
    //     sub.addListener("response", (msg) => {
    //         console.log(JSON.stringify(msg.payload));
    //         if (++count >= max) {
    //             sub.cancel();
    //             setTimeout(()=>{
    //                 console.log(max+" responses received, exiting...");
    //                 process.exit(0);
    //             }, 1000);
    //         }
    //     });

    //     // === 서비스 응답
    //     res = {
    //         returnValue: true,
    //         Response: "Server Open",
    //     };
    // }
    // catch(error) {
    //     res = {
    //         returnValue: false,
    //         Response: `[Start Server error]${error}`,
    //     };
    // }
    // finally {
    //     // === 서비스 응답
    //     message.respond(res);
    // }
    console.log("Start server"); 
    message.respond({
        returnValue: false,
        Response: `[Start Server error]${error}`,
    });   
});

// === setup hearbeat
// handle subscription requests
const subscriptions = {};
let heartbeatinterval;
let x = 1;
const createHeartBeatInterval = () => {
    if (heartbeatinterval) {
        return;
    }
    console.log(logHeader, "create_heartbeatinterval");
    heartbeatinterval = setInterval(() => {
        sendResponses();
    }, 1000);
}

// send responses to each subscribed client
const sendResponses = () => {
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

const heartbeat = service.register("heartbeat");

heartbeat.on("request", (message) => {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat");
    message.respond({event: "beat"}); // initial response 
    if (message.isSubscription) { 
        subscriptions[message.uniqueToken] = message; //add message to "subscriptions" 
        if (!heartbeatinterval) {
            createHeartBeatInterval();
        }
    } 
});

heartbeat.on("cancel", (message) => { 
    delete subscriptions[message.uniqueToken]; // remove message from "subscriptions" 
    let keys = Object.keys(subscriptions); 
    if (keys.length === 0) { // count the remaining subscriptions 
        console.log("no more subscriptions, canceling interval"); 
        clearInterval(heartbeatinterval);
        heartbeatinterval = undefined;
    } 
});