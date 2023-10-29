// === webOS service call
const marigoldServiceUrl = "luna://com.marigold.app.service";

const goToMenuPage = () => {
    window.location.href = "../activity-analysis/activity-analysis.html";
};

//stepChart
// 최근 5일 데이터 (더미 데이터)
const recentData = [
    /*{
        incomHR: '2023-10-01 02:18:57',
        totalHR: 'PT30M',
        totalcal: '0.00145 kcal',
        totalsteps: '5000',
        uid: '843c360f-5122-45e6-91ce-9ac4f6c0b50d'
    },
    {
        incomHR: '2023-10-02 02:23:11',
        totalHR: 'PT30M',
        totalcal: '0.00156 kcal',
        totalsteps: '7000',
        uid: '9a91a639-85a7-4d2b-9ea8-944211fd8deb'
    },
    {
        incomHR: '2023-10-03 02:18:57',
        totalHR: 'PT30M',
        totalcal: '0.00145 kcal',
        totalsteps: '8500',
        uid: '843c360f-5122-45e6-91ce-9ac4f6c0b50d'
    },
    {
        incomHR: '2023-10-04 02:23:11',
        totalHR: 'PT30M',
        totalcal: '0.00156 kcal',
        totalsteps: '6000',
        uid: '9a91a639-85a7-4d2b-9ea8-944211fd8deb'
    },
    {
        incomHR: '2023-10-05 02:18:57',
        totalHR: 'PT30M',
        totalcal: '0.00145 kcal',
        totalsteps: '7500',
        uid: '843c360f-5122-45e6-91ce-9ac4f6c0b50d'
    }
*/];
async function fetchDataStepChart() {
    try {
        const bridge = new WebOSServiceBridge();
        const url = `${marigoldServiceUrl}/getWalkData`;

        const callback = (msg) => {
            let res = JSON.parse(msg);
            const data = res.Response;

            // const response = await fetch('http://10.50.10.182:9002/api/walkdata');
            // const data = await response.json();

            // 최근 5일의 날짜와 걸음 수 데이터 추출
            const labels = data.map(data => data.incomHR.split(' ')[0]);
            const stepsData = data.map(data => parseInt(data.totalsteps));

            // 평균 걸음 수 계산
            const totalSteps = stepsData.reduce((total, steps) => total + steps, 0);
            const averageSteps = totalSteps / stepsData.length;

            // 목표 걸음 수
            const goalSteps = 10000;

            // 목표 대비 백분율 계산
            const percentGoal = ((averageSteps / goalSteps) * 100).toFixed(2);

            // 차트 생성
            const ctx = document.getElementById('StepChart').getContext('2d');
            const StepChart = new Chart(ctx, {
                type: 'bar', // 막대 그래프
                data: {
                    labels: labels,
                    datasets: [{
                        label: '걸음 수',
                        data: stepsData,
                        backgroundColor: 'rgba(75, 192, 192, 0.7)', // 막대 색상
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        responsive: true,
                        maintainAspectRatio: false,
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '걸음 수'
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

            // 결과를 HTML에 표시
            const averageStepsElement = document.getElementById('left-section-contents-1');
            let resultTextContent;
            if (averageSteps > goalSteps){
                resultTextContent = `평균 걸음수는 ${Math.round(averageSteps)} 걸음으로 목표 대비 ${percentGoal}% 높습니다. \n목표한 걸음수는 ${goalSteps}걸음 입니다.`;
            }
            else{
                resultTextContent = `평균 걸음수는 ${Math.round(averageSteps)} 걸음으로 목표 대비 ${percentGoal}% 낮습니다. \n목표한 걸음수는 ${goalSteps}걸음 입니다.`;
            }
            averageStepsElement.textContent = resultTextContent;

        };
        bridge.onservicecallback = callback;
        bridge.call(url, JSON.stringify({})); 
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
    }
}


//stepCircla


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
async function fetchDataStepCircle() {
    try {
        const bridge = new WebOSServiceBridge();
        const url = `${marigoldServiceUrl}/getWalkData`;

        const callback = (msg) => {
            let res = JSON.parse(msg);
            const data = res.Response;
            
            // const response = await fetch('http://10.50.10.182:9002/api/walkdata'); 
            // const data = await response.json();
            
            // 가져온 데이터를 배열로 저장
            const dataFromServer = data;

            console.log("넘어온 데이터: ",dataFromServer);
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
                const ctx = document.getElementById('StepCircle').getContext('2d');

                // 만약 stepsToday가 goalSteps보다 크다면, 그래프를 100%로 그립니다.
                const goalReached = stepsToday >= goalSteps;

                const StepCircle = new Chart(ctx, {
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
                        cutout: '80%', // 두께
                        animation: {
                            animateScale: true,
                        },
                        plugins: {
                            maintainAspectRatio: false,
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
            let resultWalkText;
            if (stepsToday > goalSteps) {
                resultWalkText = `오늘은 목표한 ${goalSteps}보 대비 ${stepsToday}보 만큼 걸었습니다. \n
                잘했어요!`;
            }else{
                resultWalkText = `오늘은 목표한 ${goalSteps}보 대비 ${stepsToday}보 만큼 걸었습니다. \n
                산책을 나가보는건 어때요?`;
            }
            resultStepElement.textContent =resultWalkText; 


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
function fetchData() {
    fetchDataStepChart();
    fetchDataStepCircle();
}