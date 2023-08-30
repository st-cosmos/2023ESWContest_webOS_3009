const ip = require('ip');
const express = require('express');

// network settings
const IP_ADDRESS = ip.address();
const PORT = 9999;

// server settings
const app = express();
app.use(express.json());

console.log(`Server IP address: ${IP_ADDRESS}`);
console.log(`Server is running on port ${PORT}`);

app.get('/', (req, res)=>{
    res.send("Hello World!");
});

app.post('/Diary', (req, res)=>{
    let data = req.body;
    if(typeof(data) == 'string') {
        data = JSON.parse(data);
    }
    console.log(data.text);
    
    const fs = require('fs');
    const receivedText = data.text;
    
    fs.writeFile('server/ml_files/input.txt', receivedText, (err) => {
        if (err) {
          console.error('Error saving text:', err);
        } else {
          console.log('Text saved successfully.');
        }
    });

    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['server/dev/machine_learning/main.py']);

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

      // 클라이언트로 결과 및 IP 주소 전송
      const result = {
        stdout: stdoutData,
        stderr: stderrData,
        exitCode: code
      };

      res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
