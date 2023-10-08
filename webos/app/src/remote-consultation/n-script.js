const counselors = [
    {
        id: "counselor01",
        name: "홍길동",
        depart: "정신의학과",
        detail_depart: "00병원 정신건강의학과 전문의",
        count: "9",
        time: "23.09.30 17시",
        last: "23.09.30",
        career: ["전) 중랑구보건소 마음건강상담소 객원상담사", "전) 중랑구보건소 마음건강상담소 객원상담사"]
    },
    {
        id: "counselor02",
        name: "홍동동",
        depart: "상담심리학과",
        detail_depart: "00대학교 상담심리대학원 겸임교수",
        count: "4",
        time: "23.10.05 20시",
        last: "23.09.15",
        career: ["전) 중랑구보건소 마음건강상담소 객원상담사"]
    },
    {
        id: "counselor03",
        name: "길동동",
        depart: "심리상담학과",
        detail_depart: "00상담센터 00점 심리상담사",
        count: "1",
        time: "23.10.10 17시",
        last: "23.09.01",
        career: ["전) 중랑구보건소 마음건강상담소 객원상담사", "전) 중랑구보건소 마음건강상담소 객원상담사"]
    },
];
const counselorList = [];

let selectedCounselor;

const clearReservationList = () => {
    const container = document.getElementById("reservation-list");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

const loadReservationList = () => {
    counselors.forEach(counselor => {
        applyReservationListToUi(counselor);
    });
};

const createReservationInnerHtml = (counselorItem) => {
    return `           
    <div class="reservationCard-title">
        <p class="reservationCard-reser">상담 일시</p>
    </div>
    <div class="reservationCard-reser-time">
        <p class="reservationCard-text">${counselorItem.time}</p>
    </div>

    <div class="reservationCard-title">
        <p class="reservationCard-profile">상담사</p>
    </div>

    <div class="reservationCard-profile-cont">
        <div class="reservationCard-img">
            <span id = "reservationCard-img" class="material-symbols-outlined">person</span>
        </div>
        <div class="reservationCard-depart">
            <p class="reservationCard-profile-text">${counselorItem.detail_depart}</p>
        </div>
        <div class="reservationCard-name">
            <p class="reservationCard-profile-text">${counselorItem.name}</p>
        </div>
    </div>

    <div class="reservationCard-title">
        <p class="reservationCard-history">상담이력</p>
    </div>
    <div class="reservationCard-history-count">
        <p class="reservationCard-text">${counselorItem.count}</p>
    </div>

    <div class="reservationCard-title">
        <p class="reservationCard-last">마지막 상담</p>
    </div>
    <div class="reservationCard-last-date">
        <p class="reservationCard-text">${counselorItem.last}</p>
    </div>
    
    <div class="reservationCard-button">
        <button class="style-reservationCardbutton" id="cancel-button" onclick="removeCounselor()">예약 취소</button>
        <button class="style-reservationCardbutton" id="start-button" onclick="start()">상담 시작</button>
    </div>
    `;
};

const reservationCardView = (counselorItem) => {
    const container = document.getElementById('reservation-card');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const subitem = document.createElement('div');
    subitem.className = "reservationCard-card-inner";
    subitem.innerHTML = createReservationCardrInnerHtml(counselorItem);

    container.appendChild(subitem);
};

const reservationItemOnClickHandler = (element) => {
    const elementId = element.id;

    const counselorItem = counselors.find(counselorItem => counselorItem.id === elementId);

    if (selectedCounselor) {
        document.getElementById(selectedCounselor).classList.toggle("active");
    }

    document.getElementById(elementId).classList.toggle("active");
    selectedCounselor = elementId;

    cardView(counselorItem);
};


const createReservationItemInnerHtml = (counselorItem) => {
    return  `
    <div id="${counselorItem.id}" class="list-item" onclick="reservationItemOnClickHandler(this)">
      
        <div class="list-img">
            <span id ="list-img" class="material-symbols-outlined">person</span>
        </div>

        <div class="list-name">
            <p class="font-list-name">${counselorItem.name}</p>
        </div>

        <div class="list-depart">
            <p class="font-list-depart">${counselorItem.depart}</p>
        </div>

        <div class="list-time">
            <p class="font-list-time">${counselorItem.time}</p>
        </div>
 
    </div>
    `;
};

const applyReservationListToUi = (counselorItem) => {
    const subitem = document.createElement("div");
    subitem.innerHTML = createCounselorItemInnerHtml(counselorItem);

    const container = document.getElementById("reservation-list");
    container.appendChild(subitem);
};

window.onload = () => {
    clearCounselorList();
    loadCounselorList();
};

const removeCounselor = () => {
    if (selectedCounselor) {
        // selectedCounselor에 해당하는 counselorItem을 찾습니다.
        const counselorIndex = counselors.findIndex(counselorItem => counselorItem.id === selectedCounselor);

        if (counselorIndex !== -1) {
            // counselorItem을 배열에서 제거합니다.
            counselors.splice(counselorIndex, 1);
            // 선택된 counselor 초기화
            selectedCounselor = null;

            // UI에서 해당 counselorItem을 제거합니다.
            const container = document.getElementById('counselor-card');
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            // 업데이트된 counselorList를 UI에서 다시 렌더링합니다.
            clearCounselorList();
            loadCounselorList();
        }
    }
};

const showContent = (tabName) => {
    // 모든 컨텐츠를 숨김
    var contentElements = document.getElementsByClassName('contents');
    for (var i = 0; i < contentElements.length; i++) {
        contentElements[i].classList.remove('active');
    }

    // 클릭한 탭에 해당하는 컨텐츠를 활성화
    document.getElementById(tabName).classList.add('active');
}

const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};

const goToPlusPage = () => {
    window.location.href = "./remote-cons-pluspage.html";
};

const start = () => {
    window.location.href = "https://10.50.8.198:9000/client/";
};

//////////////////////////////////////////

//상담사 찾기

/////////////////////////////////////////
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
    const careerListHtml = counselorItem.career.map(careerItem => `<p class="card-text">${careerItem}</p>`).join('');

    return `           
    <div class="card-title">
        <p class="card-reser">상담 일시</p>
    </div>
    <div class="card-reser-time">
        <p class="card-text">${counselorItem.time}</p>
    </div>

    <div class="card-title">
        <p class="card-profile">상담사</p>
    </div>

    <div class="card-profile-cont">
        <div class="card-img">
            <span id = "card-img" class="material-symbols-outlined">person</span>
        </div>
        <div class="card-depart">
            <p class="card-profile-text">${counselorItem.detail_depart}</p>
        </div>
        <div class="card-name">
            <p class="card-profile-text">${counselorItem.name}</p>
        </div>
    </div>

    <div class="card-title">
        <p class="card-career">경력</p>
    </div>
    <div class="card-career-list">
        ${careerListHtml}
    </div>

    
    <div class="card-button">
        <button class="style-button" id="reservation-button">상담 예약</button>
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
            <p class="font-list-depart">${counselorItem.depart}</p>
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