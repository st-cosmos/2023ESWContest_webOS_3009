const express = require('express');
const bodyParser = require('body-parser');
const ip = require("ip");

const IP_ADDRESS= ip.address();
const app = express();
const port = 9002;

app.use(bodyParser.json());

// POST 요청을 처리하는 엔드포인트
app.post('/api/user', (req, res) => {
    const userData = req.body;

    // 여기에서 userData를 사용하거나 저장하는 작업을 수행할 수 있습니다.
    // 예를 들어 데이터베이스에 저장하거나 다른 처리를 수행할 수 있습니다.

    console.log('Received user data:', userData);

    // 클라이언트에 응답을 보냅니다.
    res.sendStatus(200); // 성공적인 응답을 보냅니다.
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://${IP_ADDRESS}:${port}`)
});
