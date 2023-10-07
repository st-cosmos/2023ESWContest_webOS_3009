const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};



let currentMonth = 1; // 현재 월
const calendar = document.querySelector('.calendar');
const monthsContainer = document.querySelector('.months');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

// 이전 월로 이동하는 함수
function goToPreviousMonth() {
    if (currentMonth > 1) {
        currentMonth--;
        renderCalendar(2023, currentMonth);
    }
}

// 다음 월로 이동하는 함수
function goToNextMonth() {
    if (currentMonth < 12) {
        currentMonth++;
        renderCalendar(2023, currentMonth);
    }
}

// 달력을 생성하고 화면에 표시하는 함수
function renderCalendar(year, month) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    calendar.querySelector('.year').textContent = `${year} 년`;

    const monthElement = document.createElement('div');
    monthElement.classList.add('month');

    const monthNameElement = document.createElement('h2');
    monthNameElement.classList.add('month-name');
    monthNameElement.textContent = `${month} 월`;

    monthElement.appendChild(monthNameElement);

    const daysContainer = document.createElement('div');
    daysContainer.classList.add('days');
    monthElement.appendChild(daysContainer);

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');

        if (i === 1) {
            const offset = firstDay.getDay();
            for (let j = 0; j < offset; j++) {
                const prevMonthDay = document.createElement('div');
                prevMonthDay.classList.add('day', 'prev-month');
                prevMonthDay.textContent = new Date(year, month - 1, -j).getDate();
                daysContainer.appendChild(prevMonthDay);
            }
         }

        if (i === new Date().getDate() && month === new Date().getMonth() + 1 && year === new Date().getFullYear()) {
            dayElement.classList.add('today');
        }

        dayElement.textContent = i;
        daysContainer.appendChild(dayElement);

        if (i === lastDay.getDate()) {
            const offset = 6 - lastDay.getDay();
            for (let j = 1; j <= offset; j++) {
                const nextMonthDay = document.createElement('div');
                nextMonthDay.classList.add('day', 'next-month');
                nextMonthDay.textContent = j;
                daysContainer.appendChild(nextMonthDay);
            }
        }
    }

    // 현재 월을 바꾸기 전에 이전 달력을 지웁니다.
    while (monthsContainer.firstChild) {
        monthsContainer.removeChild(monthsContainer.firstChild);
    }

    monthsContainer.appendChild(monthElement);
}

// 초기 달력 생성
renderCalendar(2023, currentMonth);

// 이전 월과 다음 월 버튼에 이벤트 리스너 추가
prevMonthButton.addEventListener('click', goToPreviousMonth);
nextMonthButton.addEventListener('click', goToNextMonth);
