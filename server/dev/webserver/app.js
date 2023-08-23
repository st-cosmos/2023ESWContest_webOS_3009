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
    
    //일기 텍스트 input.txt에 저장
    const fs = require('fs');

    const receivedText = data.text;
    
    fs.writeFile('server/ml_files/input.txt', receivedText, (err) => {
        if (err) {
          console.error('Error saving text:', err);
        } else {
          console.log('Text saved successfully.');
        }
     });

    //main.py 호출 및 실행
    const { spawn } = require('child_process');

    const pythonProcess = spawn('python', ['server/dev/machine_learning/main.py']);
        
    pythonProcess.stdout.on('data', (data) => {
      const value = data.toString();
      console.log(`stdout: ${value}`);
    });
      
    pythonProcess.stderr.on('data', (data) => {
      const value = data.toString();
      console.error(`stderr: ${value}`);
    });
      
    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    
    //score값 저장
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);

      let score = value;

      let message = {
        "score" : value
      };
      res.send(message);
      
      console.log(score, typeof(score));
   });
});

app.listen(PORT, ()=>console.log(`Server is running | http://${IP_ADDRESS}:${PORT}`));