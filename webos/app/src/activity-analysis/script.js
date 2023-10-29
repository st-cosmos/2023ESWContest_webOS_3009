// === webOS service call
const marigoldServiceUrl = "luna://com.marigold.app.service";

const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};

//sleep_chart
function fetchDataSleepCircle() {
    try {
        const bridge = new WebOSServiceBridge();
        const url = `${marigoldServiceUrl}/getSleepData`;

        const callback = (msg) => {
            let res = JSON.parse(msg);
            let sleepData = res.Response;
            console.log('[DEBUG, sleepData]', sleepData);

            // const response = await fetch('http://192.168.206.37:9002/api/sleepdata'); 
            // const data = await response.json();
            // const sleepData = data; 
            console.log("server input data: ", sleepData)
            const sleepStageTimes = calculateSleepStageTime(sleepData);
            console.log("cal Data", sleepStageTimes);
            const stageLabels = Object.keys(sleepStageTimes);
            const stageDurations = Object.values(sleepStageTimes);
            
            // 1. 각 수면 단계의 시간을 분 단위로 합산
            const totalSleepMinutes = Object.values(sleepStageTimes).reduce((total, time) => total + time, 0);
    
            // 각 수면 단계의 백분율 계산
            const sleepStagePercentages = {};
            const sleepStagePercentagesRounded = {};
            for (const stageName in sleepStageTimes) {
                if (Object.hasOwnProperty.call(sleepStageTimes, stageName)) {
                    const stageTimeMinutes = sleepStageTimes[stageName];
                    // 3. 각 수면 단계의 분 단위 시간을 전체 수면 시간으로 나누고 100을 곱하여 백분율 계산
                    const stagePercentage = (stageTimeMinutes / totalSleepMinutes) * 100;
                    sleepStagePercentages[stageName] = stagePercentage;
                    sleepStagePercentagesRounded[stageName] = Math.floor(stagePercentage) + '%';
                }
            }
            console.log(sleepStagePercentagesRounded);
    
            // 결과를 표시할 HTML 엘리먼트를 가져옵니다.
            const resultSleepElement = document.getElementById('result-sleep');
            resultSleepElement.innerHTML = '';
            // sleepStagePercentagesRounded 객체를 순회하며 결과를 HTML에 삽입합니다.
            for (const stageName in sleepStagePercentagesRounded) {
                if (Object.hasOwnProperty.call(sleepStagePercentagesRounded, stageName)) {
                    const stagePercentage = sleepStagePercentagesRounded[stageName];
    
                    const resultElement = document.createElement('p');
                    resultElement.textContent = `${stageName}: ${stagePercentage}`;
    
                    resultSleepElement.appendChild(resultElement);
                }
            }
            //html 종료
            const ctx = document.getElementById('sleppCircle').getContext('2d');
            const sleppCircle = new Chart(ctx, {
                type: 'doughnut', 
                data: {
                    labels: stageLabels,
                    datasets: [{
                        data: stageDurations,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(255, 205, 86, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(153, 102, 255, 0.7)',
                            'rgba(255, 159, 64, 0.7)',
                        ],
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '80%',
                    animation: {
                        animateScale: true,
                    },
                    plugins:{
                        title: {
                            display: true,
                            text: '수면 단계별 비율',
                        },
                        legend: {
                            display: true,
                            position: 'right',
                        },
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    const dataset = data.datasets[tooltipItem.datasetIndex];
                                    const total = dataset.data.reduce((accumulator, currentValue) => accumulator + currentValue);
                                    const currentValue = dataset.data[tooltipItem.index];
                                    const percentage = ((currentValue / total) * 100).toFixed(2);
                                    return `${data.labels[tooltipItem.index]}: ${percentage}%`;
                                },
                            },
                        },
                    },
                    
                },
            });
        };

        bridge.onservicecallback = callback;
        bridge.call(url, JSON.stringify({}));
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
    }
}

// 수면 단계별로 총 시간을 계산하는 함수
function calculateSleepStageTime(data) {
    const stageTimes = {
        '깸': 0,
        '수면중 뒤척임': 0,
        '매우 얕은 수면': 0,
        '렘 수면': 0,
        '얕은 수면': 0,
        '깊은 수면': 0,
    };

    data.forEach((record) => {
        record.Stages.forEach((stage) => {
            // 스테이지 이름을 변환하여 사용
            const stageName = convertStageName(stage.Stage);
            const startTime = new Date(stage['Start Time']);
            const endTime = new Date(stage['End Time']);
            const durationInMinutes = (endTime - startTime) / (1000 * 60);
            stageTimes[stageName] += durationInMinutes;
        });
    });

    return stageTimes;
}

// 스테이지 이름을 변환하는 함수
function convertStageName(stage) {
    switch (stage) {
        case 1:
            return '깸';
        case 2:
            return '수면중 뒤척임';
        case 3:
            return '매우 얕은 수면';
        case 4:
            return '렘 수면';
        case 5:
            return '얕은 수면';
        case 6:
            return '깊은 수면';
        default:
            return '알 수 없는 단계';
    }
}

//walkChart
// 서버에서 받은 데이터
const dataFromServer = [
    /*{
        incomHR: '2023-10-03 02:18:57',
        totalHR: 'PT30M',
        totalcal: '0.00145 kcal',
        totalsteps: '1000',
        uid: '843c360f-5122-45e6-91ce-9ac4f6c0b50d'
    },
    {
        incomHR: '2023-10-03 02:23:11',
        totalHR: 'PT30M',
        totalcal: '0.00156 kcal',
        totalsteps: '1000',
        uid: '9a91a639-85a7-4d2b-9ea8-944211fd8deb'
    },
    
*/];

// 서버에서 데이터를 가져와서 저장
function fetchDataStepCircle() {
    try {
        const bridge = new WebOSServiceBridge();
        const url = `${marigoldServiceUrl}/getWalkData`;
        
        const callback = (msg) => {
            let res = JSON.parse(msg);
            let dataFromServer = res.Response;
            console.log('[DEBUG, dataFromServer]', dataFromServer);

            // const response = await fetch('http://192.168.206.37:9002/api/walkdata'); 
            // const data = await response.json();
            
            // // 가져온 데이터를 배열로 저장
            // const dataFromServer = data;

            // console.log("넘어온 데이터: ",dataFromServer);
            // 목표 걸음 수
            const goalSteps = 10000;

            // 당일 날짜의 데이터만 필터링, new Date로 구한 날짜가 하루전 날자를 표시해, 다른 해결방법을 찾다 +1로 땜질...
            //어라라 또 제대로 표시되네 beforetoday.setDate(beforetoday.getDate()+1 , +1 제거
            const beforetoday = new Date();
            beforetoday.setDate(beforetoday.getDate() ); // 현재 날짜에 하루를 더함
            const today = beforetoday.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
            console.log("+1한 날짜: ",today); // 하루를 더한 날짜 출력

            const todayData = dataFromServer.filter(item => item.incomHR.split(' ')[0] === today);
            //console.log(today);
            console.log("넘어온 데이터: ",dataFromServer);
            console.log("필터 후 데이터",todayData);
            // 걸음 수 합산
            const stepsToday = todayData.reduce((acc, item) => {
                return acc + parseInt(item.totalsteps);
            }, 0);
            console.log("걸음수 합산한 데이터: ",stepsToday);
            // 목표 대비 퍼센트 계산
            const percentToday = ((stepsToday / goalSteps) * 100).toFixed(2);
            console.log("%비율: ",percentToday);
            
            // 그래프를 그리는 함수
            function drawPieChart(data) {
                const ctx = document.getElementById('stepCircle').getContext('2d');

                // 만약 stepsToday가 goalSteps보다 크다면, 그래프를 100%로 그립니다.
                const goalReached = stepsToday >= goalSteps;

                const stepCircle = new Chart(ctx, {
                    type: 'doughnut', // 원형 그래프
                    data: {
                        labels: ['걸음 수', '목표'],
                        datasets: [
                            {
                                data: [goalReached ? goalSteps : stepsToday, goalReached ? 0 : goalSteps - stepsToday],
                                backgroundColor: [
                                    goalReached ? 'rgba(75, 192, 192, 0.7)' : 'rgba(255, 99, 132, 0.7)',
                                    'rgba(135, 206, 250, 0.7)', // 목표를 표시할 때는 투명하게 처리
                                ],
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '80%', // 두께
                        animation: {
                            animateScale: true,
                        },
                        plugins: {
                            title: {
                                display: false,
                            },
                            legend: {
                                display: true,
                                position: 'right',
                            },
                            tooltips: {
                                enabled: false,
                            },
                        },
                        elements: {
                            centerText: {
                                display: true,
                                text: `${goalReached ? '목표 달성' : percentToday + '%'}`,
                                color: 'black',
                                fontStyle: 'Arial',
                            },
                        },
                    },
                });
            }

            //html 텍스트 표시
            const resultStepElement = document.getElementById('result-step');
            const subitem = document.createElement("p");
            subitem.className = "contents-font";
            let resultWalkText;
            if (stepsToday > goalSteps) {
                resultWalkText = `오늘은 목표한 ${goalSteps}보 대비 ${stepsToday}보 만큼 걸었습니다. \n
                잘했어요!`;
            }else{
                resultWalkText = `오늘은 목표한 ${goalSteps}보 대비 ${stepsToday}보 만큼 걸었습니다. \n
                산책을 나가보는건 어때요?`;
            }
            // resultStepElement.textContent =resultWalkText; 
            subitem.innerText = resultWalkText;
            resultStepElement.append(subitem);

            // 그래프 그리기
            drawPieChart({ '걸음 수': stepsToday, '목표': goalSteps - stepsToday });
        };
        bridge.onservicecallback = callback;
        bridge.call(url, JSON.stringify({}));
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
    }
}
  
//onload 전용
const fetchData = () => {
    fetchDataSleepCircle();
    fetchDataStepCircle();  
};