// === webOS service call
const marigoldServiceUrl = "luna://com.marigold.app.service";

const goToMenuPage = () => {
    window.location.href = "../activity-analysis/activity-analysis.html";
};

//sleep_chart
async function fetchDataSleepCircle() {
    try {
        const bridge = new WebOSServiceBridge();
        const url = `${marigoldServiceUrl}/getSleepData`;

        const callback = (msg) => {
            // const response = await fetch('http://10.50.10.182:9002/api/sleepdata'); 
            // const data = await response.json();
            // const sleepData = data;
            
            let res = JSON.parse(msg);
            let sleepData = res.Response;

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
            const ctx = document.getElementById('sleepCircle').getContext('2d');
            const sleepCircle = new Chart(ctx, {
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
                        //responsive: false,
                        //maintainAspectRatio: false,
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
// 수면시간 계산
// 시간을 받아서 8시간 전 시간을 계산하고 표시하는 함수
function calculateAndDisplayTime() {
    
    const timeInput = document.getElementById('cal-Sleep-Time');
    const enteredTime = timeInput.value;

    if (!enteredTime) {
        return;
    }

    const parsedTime = new Date(`1970-01-01T${enteredTime}:00`);
    
    parsedTime.setHours(parsedTime.getHours() - 8);

    const newHours = parsedTime.getHours();
    const newMinutes = parsedTime.getMinutes();
    const message = `수면의 질을 위해서 ${newHours}시 ${newMinutes}분에 주무시는 것을 추천드립니다.`;

    const calFuncElement = document.getElementById('cal-func');
    calFuncElement.textContent = message;
}

const timeInput = document.getElementById('cal-Sleep-Time');
timeInput.addEventListener('input', calculateAndDisplayTime);


// 창 크기가 변경될 때 body-mid의 max-height 업데이트
function updateBodyMidMaxHeight() {
    const bodyMid = document.querySelector('.body-mid');
    // 현재 창의 높이를 가져옵니다.
    const windowHeight = window.innerHeight;
    // body-mid의 max-height를 창 높이의 일정 비율로 설정합니다.
    // 예를 들어, 창 높이의 80%로 설정하려면 0.8을 곱합니다.
    const maxBodyMidHeight = windowHeight * 0.8;
    bodyMid.style.maxHeight = maxBodyMidHeight + 'px';
}

// 페이지 로드 시와 창 크기 변경 시 max-height 업데이트

window.addEventListener('resize', updateBodyMidMaxHeight);
//수면 차트
async function fetchDataSleepChart() {
    try {
        const bridge = new WebOSServiceBridge();
        const url = `${marigoldServiceUrl}/getSleepData`;

        const callback = (msg) => {
            let res = JSON.parse(msg);
            let data = res.Response;

            // const response = await fetch('http://10.50.10.182:9002/api/sleepdata'); // 서버 API 엔드포인트로 변경해주세요
            // const data = await response.json();
            
            // 서버에서 받은 데이터를 최근 5일로 필터링
            const recentData = data.slice(0, 5);
            console.log("서버 데이터: ",recentData);
            // 날짜를 기준으로 오름차순으로 정렬
            recentData.sort((a, b) => {
                const dateA = new Date(a.Stages[0]['Start Time']);
                const dateB = new Date(b.Stages[0]['Start Time']);
                return dateA - dateB;
            });

            // 최근 5일의 날짜와 수면 점수 데이터 추출
            const labels = recentData.map(data => {
                const startTime = new Date(data.Stages[0]['Start Time']);
                return `${startTime.getMonth() + 1}/${startTime.getDate()}`;
            });

            const sleepScores = recentData.map(data => {
                const stages456 = data.Stages.filter(stage => stage.Stage >= 4 && stage.Stage <= 6);
                const score = (stages456.length / data.Stages.length) * 100;
                return score.toFixed(2);
            });
            console.log("수면점수: ",sleepScores);
            // 차트 생성
            const ctx = document.getElementById('sleepChart').getContext('2d');
            const sleepChart = new Chart(ctx, {
                type: 'bar', 
                data: {
                    labels: labels,
                    datasets: [{
                        label: '수면 점수',
                        data: sleepScores,
                        backgroundColor: 'rgba(75, 192, 192, 0.7)', // 막대 색상
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '수면 점수 (%)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: '날짜'
                            }
                        }
                    }
                }
            });
        };

        bridge.onservicecallback = callback;
        bridge.call(url, JSON.stringify({}));
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
    }
}

//onload 전용
function fetchData() {
    fetchDataSleepCircle();
    updateBodyMidMaxHeight();
    fetchDataSleepChart();
}