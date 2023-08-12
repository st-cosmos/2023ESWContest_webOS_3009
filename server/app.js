const ip = require('ip');
const express = require('express');

// network settings
const IP_ADDRESS = ip.address();
const PORT = 9999;

// server settings
const app = express();
app.use(express.json());

app.get('/', (req, res)=>{
    res.send("Hello World!");
});

app.post('/Diary', (req, res)=>{
    // console.log(req.body, typeof(req.body));
    let data = req.body;
    if(typeof(data) == 'string') {
        data = JSON.parse(data);
    }
    console.log(data.text);

    let score = 50;
    
    let message = {
        "score" : score
    };
    res.send(message);
});

app.listen(PORT, ()=>console.log(`Server is running | http://${IP_ADDRESS}:${PORT}`));