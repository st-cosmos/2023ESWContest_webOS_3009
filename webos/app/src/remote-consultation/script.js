const reservationList = [
    {
        id: "reservation01",
        name: "홍길동",
        depart: "정신의학과",
        detail_depart: "00병원 정신건강의학과 전문의",
        count: "9",
        time: "23.09.30 17시",
        last: "23.09.30",
        career: ["전) 중랑구보건소 마음건강상담소 객원상담사", "전) 중랑구보건소 마음건강상담소 객원상담사"]
    },
    {
        id: "reservation02",
        name: "홍동동",
        depart: "상담심리학과",
        detail_depart: "00대학교 상담심리대학원 겸임교수",
        count: "4",
        time: "23.10.05 20시",
        last: "23.09.15",
        career: ["전) 중랑구보건소 마음건강상담소 객원상담사"]
    },
    {
        id: "reservationr03",
        name: "길동동",
        depart: "심리상담학과",
        detail_depart: "00상담센터 00점 심리상담사",
        count: "1",
        time: "23.10.10 17시",
        last: "23.09.01",
        career: ["전) 중랑구보건소 마음건강상담소 객원상담사", "전) 중랑구보건소 마음건강상담소 객원상담사"]
    },
];

const counselors = [
    {
        id: "counselor01",
        name: "홍길동",
        depart: "정신의학과",
        detail_depart: "00병원 정신건강의학과 전문의",
        count: "9",
        time: "23.10.10 17시",
        last: "23.09.30",
        career: ["전) 중랑구보건소 마음건강상담소 객원상담사", "전) 중랑구보건소 마음건강상담소 객원상담사"]
    },
    {
        id: "counselor02",
        name: "홍동동",
        depart: "상담심리학과",
        detail_depart: "00대학교 상담심리대학원 겸임교수",
        count: "4",
        time: "23.10.20 20시",
        last: "23.09.15",
        career: ["전) 중랑구보건소 마음건강상담소 객원상담사"]
    },
    {
        id: "counselor03",
        name: "길동동",
        depart: "심리상담학과",
        detail_depart: "00상담센터 00점 심리상담사",
        count: "1",
        time: "23.10.30 17시",
        last: "23.09.01",
        career: ["전) 중랑구보건소 마음건강상담소 객원상담사", "전) 중랑구보건소 마음건강상담소 객원상담사"]
    },
];

let selectedCounselor;

const clearReservationList = () => {
    const container = document.getElementById("reservation-list");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

const clearCounselorList = () => {
    const container = document.getElementById("counselor-list");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

const loadReservationList = () => {
    reservationList.forEach(counselor => {
        applyReservationListToUi(counselor);
    });
};

const loadCounselorList = () => {
    counselors.forEach(counselor => {
        applyCounselorListToUi(counselor);
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
        <button class="style-button" id="reservation-button" onclick="removeReservation()">상담 예약</button>
    </div>
    `;
};

const ReservationcardView = (counselorItem) => {
    const container = document.getElementById('reservation-card');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const subitem = document.createElement('div');
    subitem.className = "reservation-card-inner";
    subitem.innerHTML = createReservationInnerHtml(counselorItem);

    container.appendChild(subitem);
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

const ReservationItemOnClickHandler = (element) => {
    const elementId = element.id;

    const counselorItem = reservationList.find(counselorItem => counselorItem.id === elementId);

    if (selectedCounselor) {
        document.getElementById(selectedCounselor).classList.toggle("active");
    }

    document.getElementById(elementId).classList.toggle("active");
    selectedCounselor = elementId;

    ReservationcardView(counselorItem);
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


const createReservationItemInnerHtml = (counselorItem) => {
    return  `
    <div id="${counselorItem.id}" class="list-item" onclick="ReservationItemOnClickHandler(this)">
      
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

const createCounselorItemInnerHtml = (counselorItem) => {
    return  `
    <div id="${counselorItem.id}" class="counselorlist-item" onclick="counselorItemOnClickHandler(this)">
      
        <div class="counselorlist-img">
            <span id ="counselorlist-img" class="material-symbols-outlined">person</span>
        </div>

        <div class="counselorlist-name">
            <p class="font-list-name">${counselorItem.name}</p>
        </div>

        <div class="counselorlist-depart">
            <p class="font-list-depart">${counselorItem.depart}</p>
        </div>

        <div class="counselorlist-time">
            <p class="font-list-time">${counselorItem.time}</p>
        </div>
 
    </div>
    `;
};

const applyReservationListToUi = (counselorItem) => {
    const subitem = document.createElement("div");
    subitem.innerHTML = createReservationItemInnerHtml(counselorItem);

    const container = document.getElementById("reservation-list");
    container.appendChild(subitem);
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

    clearReservationList();
    loadReservationList();
};

const removeCounselor = () => {
    if (selectedCounselor) {
        // selectedCounselor에 해당하는 counselorItem을 찾습니다.
        const counselorIndex = reservationList.findIndex(counselorItem => counselorItem.id === selectedCounselor);

        if (counselorIndex !== -1) {
            // counselorItem을 배열에서 제거합니다.
            reservationList.splice(counselorIndex, 1);
            // 선택된 counselor 초기화
            selectedCounselor = null;

            // UI에서 해당 counselorItem을 제거합니다.
            const container = document.getElementById('reservation-card');
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            // 업데이트된 counselorList를 UI에서 다시 렌더링합니다.
            clearReservationList();
            loadReservationList();
        }
    }
};

const removeReservation = () => {
    if (selectedCounselor) {
        // selectedCounselor에 해당하는 counselorItem을 찾습니다.
        const counselorIndex = counselors.findIndex(counselorItem => counselorItem.id === selectedCounselor);

        if (counselorIndex !== -1) {
            // counselorItem을 배열에서 제거합니다.
            counselors.splice(counselorIndex, 1);
            // 선택된 counselor 초기화
            selectedCounselor = null;

            // UI에서 해당 counselorItem을 제거합니다.
            const container = document.getElementById('reservation-card');
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            // 업데이트된 counselorList를 UI에서 다시 렌더링합니다.
            clearCounselorList();
            loadCounselorList();
        }
    }
};

const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};

const start = () => {
    window.location.href = "https://10.50.8.198:9000/client/";
};

let selectedNavId;

const showContent = (element) => {
    if(selectedNavId) {
        document.getElementById(selectedNavId).classList.toggle("active");
    }
    selectedNavId = element.id;
    document.getElementById(selectedNavId).classList.toggle("active");

    if(selectedNavId == "mylist") {
        document.getElementById("content-mylist").style.display = "grid";
        document.getElementById("content-find").style.display = "none";
    }
    else if(selectedNavId == "find") {
        document.getElementById("content-mylist").style.display = "none";
        document.getElementById("content-find").style.display = "grid";
    }
    else {
        document.getElementById("content-mylist").style.display = "none";
        document.getElementById("content-find").style.display = "none";
    }
};