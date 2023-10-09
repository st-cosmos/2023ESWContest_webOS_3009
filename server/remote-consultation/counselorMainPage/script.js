const counselors = [
    {
        id: "client01",
        name: "홍길동",
        cause: "우울증",
        count: "9",
        time: "23.09.30 17시",
        last: "23.09.30",
        detail: ["ㅠㅠ", "ㅠㅠㅠㅠㅠ"]
    },
    {
        id: "client02",
        name: "홍동동",
        cause: "불안장애",
        count: "4",
        time: "23.10.05 20시",
        last: "23.09.15",
        detail: ["ㅠㅠ", "ㅠㅠㅠㅠㅠ"]
    },
    {
        id: "client03",
        name: "길동동",
        cause: "공황장애",
        count: "1",
        time: "23.10.10 17시",
        last: "23.09.01",
        detail: ["ㅠㅠ", "ㅠㅠㅠㅠㅠ"]
    },
    {
        id: "client04",
        name: "홍길동",
        cause: "우울증",
        count: "9",
        time: "23.09.30 17시",
        last: "23.09.30",
        detail: ["ㅠㅠ", "ㅠㅠㅠㅠㅠ"]
    },
    {
        id: "client05",
        name: "홍동동",
        cause: "불안장애",
        count: "4",
        time: "23.10.05 20시",
        last: "23.09.15",
        detail: ["ㅠㅠ", "ㅠㅠㅠㅠㅠ"]
    },
    {
        id: "client06",
        name: "길동동",
        cause: "공황장애",
        count: "1",
        time: "23.10.10 17시",
        last: "23.09.01",
        detail: ["ㅠㅠ", "ㅠㅠㅠㅠㅠ"]
    },
    {
        id: "client07",
        name: "홍길동",
        cause: "우울증",
        count: "9",
        time: "23.09.30 17시",
        last: "23.09.30",
        detail: ["ㅠㅠ", "ㅠㅠㅠㅠㅠ"]
    },
    {
        id: "client08",
        name: "홍동동",
        cause: "불안장애",
        count: "4",
        time: "23.10.05 20시",
        last: "23.09.15",
        detail: ["ㅠㅠ", "ㅠㅠㅠㅠㅠ"]
    },
    {
        id: "client09",
        name: "길동동",
        cause: "공황장애",
        count: "1",
        time: "23.10.10 17시",
        last: "23.09.01",
        detail: ["ㅠㅠ", "ㅠㅠㅠㅠㅠ"]
    },
];

const counselorList = [];

let selectedCounselor;

const clearCounselorList = () => {
    const container = document.getElementById("counselor-list");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

const loadCounselorList = () => {
    counselors.forEach(counselor => {
        applyCounselorListToUi(counselor);
    });
};

const createCounselorInnerHtml = (counselorItem) => {
    const detailListHtml = counselorItem.detail.map(detailItem => `<p class="card-text">${detailItem}</p>`).join('');

    return `           
    <div class="card-title">
        <p class="card-reser">상담 일시</p>
    </div>
    <div class="card-reser-time">
        <p class="card-text">${counselorItem.time}</p>
    </div>

    <div class="card-title">
        <p class="card-profile">client</p>
    </div>

    <div class="card-profile-cont">
        <div class="card-img">
            <span id = "card-img" class="material-symbols-outlined">person</span>
        </div>
        <div class="card-name">
            <p class="card-profile-text">${counselorItem.name}</p>
        </div>
        <div class="card-cause">
            <p class="card-profile-text">${counselorItem.cause}</p>
        </div>
    </div>

    <div class="card-title">
        <p class="card-history">상담이력</p>
    </div>
    <div class="card-history-count">
        <p class="card-text">${counselorItem.count}</p>
    </div>

    <div class="card-title">
        <p class="card-last">마지막 상담</p>
    </div>
    <div class="card-last-date">
        <p class="card-text">${counselorItem.last}</p>
    </div>

    <div class="card-title">
        <p class="card-detail">세부사항</p>
    </div>
    <div class="card-detail-list">
        ${detailListHtml}
    </div>

    <div class="card-button">
        <button class="style-button" id="start-button" onclick="start()">상담 시작</button>
    </div>
    `;
};

const cardView = (counselorItem) => {
    const container = document.getElementById('counselor-card');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const subitem = document.createElement('div');
    subitem.className = "counselor-card-inner";
    subitem.innerHTML = createCounselorInnerHtml(counselorItem);

    container.appendChild(subitem);
};

const counselorItemOnClickHandler = (element) => {
    const elementId = element.id;

    const counselorItem = counselors.find(counselorItem => counselorItem.id === elementId);

    if (selectedCounselor) {
        document.getElementById(selectedCounselor).classList.toggle("active");
    }

    document.getElementById(elementId).classList.toggle("active");
    selectedCounselor = elementId;

    cardView(counselorItem);
};


const createCounselorItemInnerHtml = (counselorItem) => {
    return  `
    <div id="${counselorItem.id}" class="list-item" onclick="counselorItemOnClickHandler(this)">
      
        <div class="list-img">
            <span id ="list-img" class="material-symbols-outlined">person</span>
        </div>

        <div class="list-name">
            <p class="font-list-name">${counselorItem.name}</p>
        </div>

        <div class="list-depart">
            <p class="font-list-depart">${counselorItem.cause}</p>
        </div>

        <div class="list-time">
            <p class="font-list-time">${counselorItem.time}</p>
        </div>
 
    </div>
    `;
};

const applyCounselorListToUi = (counselorItem) => {
    const subitem = document.createElement("div");
    subitem.innerHTML = createCounselorItemInnerHtml(counselorItem);

    const container = document.getElementById("counselor-list");
    container.appendChild(subitem);
};

window.onload = () => {
    clearCounselorList();
    loadCounselorList();
};

const goToBackPage = () => {
    window.location.href = "./remote-cons.html";
};

const start = () => {
    window.location.href = "https://10.50.8.198:9000/client/";
};

goToMain
counselorMainPage
const goToMain = () => {
    window.location.href = "./counselorMainPage/"
};