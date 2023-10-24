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

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);

    /**
     * TODO
     * 1. 받은 텍스트를 'input.txt'로 저장하기
     * 2. python 호출해서 해당 코드 분석하도록 만들기
     * 3. output.txt 읽어와서 점수를 아래 score 변수에 넣기
     */

    let score = 50;
    
    let message = {
        "score" : score
    };
    res.send(message);
   });
});
app.listen(PORT, ()=>console.log(`Server is running | http://${IP_ADDRESS}:${PORT}`));
