const ip = require('ip');
const express = require('express');

// network settings
const IP_ADDRESS = ip.address();
const PORT = 9999;

// server settings
const app = express();

app.get('/', (req, res)=>{
    res.send("Hello World!");
});

app.get('/Page', (req, res)=>{
    res.send("<h1>Hello World!</h1><h3>Fighting!</h3>");
});

app.listen(PORT, ()=>console.log(`Server is running | http://${IP_ADDRESS}:${PORT}`));