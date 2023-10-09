const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};

const diaryList = [
    {
        createdAt: "2023-01-12T07:01:46.687Z",
        text: "나는 오늘 끝내주게 숨을 쉬었다."
    },
    {
        createdAt: "2023-01-20T07:01:46.687Z",
        text: "나는 오늘 멋지게 숨을 쉬었다."
    },
];

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

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

const createDiaryPreviewInnerHtml = (diary) => {
    if(diary) {
        const diaryDate = new Date(diary.createdAt);
        const dateString = diaryDate.toLocaleDateString();
        const dayString = `${dayNames[diaryDate.getDay()]}요일`;
    
        return `
        <div class="right-section-item" id="it5">
            <span id="day">${dateString}</span>
            <span id="friday">${dayString}</span>
        </div>
        <div class="right-section-item" id="it6"></div>
        <div class="right-section-item" id="it7">
            ${diary.text}
        </div>
        <div class="right-section-item" id="it8">
        </div>
        `;
    }
    else {
        return `
        <div class="rs-placeholder">일기를 선택하세요.</div>
        `;
    }
};
let selectedDate;

const showDiary = (datetime) => {
    const year1 = datetime.getFullYear();
    const month1 = datetime.getMonth();
    const day1 = datetime.getDate();

    const diary = diaryList.find(diary => {
        const diaryDate = new Date(diary.createdAt);
        const year2 = diaryDate.getFullYear();
        const month2 = diaryDate.getMonth();
        const day2 = diaryDate.getDate();
        
        if (year1 == year2 && month1 == month2 && day1 == day2) {
            return diary;
        }
    });
    console.log(diary);
    
    const container = document.getElementById("right-box");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const subitem = document.createElement('div');
    subitem.innerHTML = createDiaryPreviewInnerHtml(diary);
    container.appendChild(subitem);
};

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

        // 클릭한 날짜에 대한 처리
        dayElement.addEventListener('click', () => {
            // 모든 날짜 요소에서 선택된 클래스를 제거합니다.
            daysContainer.querySelectorAll('.day').forEach((el) => {
                el.classList.remove('selected-day');
            });

            // 클릭한 날짜 요소에 선택된 클래스를 추가합니다.
            dayElement.classList.add('selected-day');

            // 선택된 날짜를 저장합니다.
            selectedDate = new Date(year, month - 1, i);
            showDiary(selectedDate);

            // 글쓰기 버튼을 보이게 합니다.
            writeButton.style.display = 'block';

            // 선택된 날짜를 이용하여 글쓰기 버튼의 링크를 생성합니다.
            const writingPageLink = `글쓰기페이지의_경로.html?date=${selectedDate.toISOString()}`;
            writeButton.setAttribute('href', writingPageLink);
        });

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

// "글쓰기" 버튼에 클릭 이벤트 리스너를 추가하고 초기에는 숨김 처리
const writeButton = document.getElementById('writeButton');
writeButton.addEventListener('click', () => {
    // const selectedDate = new Date();
    const writingPageLink = `./editpage.html?date=${selectedDate.toISOString()}`;
    window.location.href = writingPageLink;
});
writeButton.style.display = 'none'; // 초기에는 숨김 처리
