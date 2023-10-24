const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};

const routineItems = [
    {
        "id" : "RT0",
        "type": "medicine",
        "icon" : "pill",
        "title" : "아침 약 먹기",
        "time" : "오전 08:00",
        "day" : ["월", "화", "수","목","금","토","일"],
        "isOnOff" : true,
    },
    {
        "id" : "RT1",
        "type": "consult",
        "icon" : "support_agent",
        "title" : "치과가기 ",
        "time" : "오전 10:00",
        "day" : ["월", "화", "수"],
        "isOnOff" : true,
    },
    {
        "id" : "RT2",
        "type": "diary",
        "icon" : "book_5",
        "title" : "일기쓰기",
        "time" : "오후 07:00",
        "day" : ["월", "화", "수","목","금","토","일"],
        "isOnOff" : true,
    },
    {
        "id" : "RT3",
        "type": "exercise",
        "icon" : "directions_run",
        "title" : "어쩌구 저쩌구",
        "time" : "오전 08:00",
        "day" : ["월", "화", "수"],
        "isOnOff" : true,
    },
];

const clearRoutineBlocks = () => {
    const container = document.getElementById("routine-list");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

const clearRoutineBlocksRight = () =>{
    const container = document.getElementById("rt-viewmode");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};
const createRoutineBlockRightInnerHtml = (routineItemRight) => {
    return `
    <div id="routine-name">
        <div id="routine-name-a">
            <span class="material-symbols-outlined icon-style2">${routineItemRight.icon}</span>
        </div>
        <div id="routine-name-b">${routineItemRight.title}</div>
    </div>
    <div id="routine-time-detail">
        ${routineItemRight.time}
    </div>
    <div id="routine-day">
        ${routineItemRight.day}
    </div>
    <div id="del-button2" onclick="deleteRoutineItem()">삭제</div>
    `;
};
const loadRoutineBlocksRight = (rightRoutineItems) =>{
    const container = document.getElementById("rt-viewmode");
    container.style.display = "block";
    container.innerHTML = createRoutineBlockRightInnerHtml(rightRoutineItems); 
};

let deleteItem;
const deleteRoutineItem = () => {
     // 경고창 표시
    //  const isConfirmed = window.confirm('삭제할 것입니까?');
    const isConfirmed = true;

     if (isConfirmed) {
         // 확인 버튼이 눌렸을 때의 동작
         id = deleteItem;
         const index = routineItems.findIndex(item => item.id === id);
         if (index !== -1) {
            // 해당 아이템을 배열에서 삭제
            routineItems.splice(index, 1);

            // UI 업데이트
            clearRoutineBlocks();
            loadRoutineBlocks();
            document.getElementById("rt-viewmode").style.display = "none";
 
         } else {
             console.error(`Item with id ${id} not found.`);
         }
     } else {
         // 취소 버튼이 눌렸을 때의 동작
         console.log('삭제가 취소되었습니다.');
     }
};

const clickRoutineBlock = (element) => {
    // console.log(element.id);
    const item = routineItems.find(routineItem => element.id == routineItem.id);
    // console.log(item);
    clearRoutineBlocksRight();
    loadRoutineBlocksRight(item);
    deleteItem = element.id;
};

const createRoutineBlockInnerHtml = (routineItem) => {
    return `
    <div id="${routineItem.id}" class="routine-block" onclick="clickRoutineBlock(this)">
        <div id="routine-picture">
            <span class="material-symbols-outlined icon-style">${routineItem.icon}</span>
        </div>
        <div id="routine-time">${routineItem.time}</div>
        <div id="routine-to-do">${routineItem.title}</div>
        <div id="routine-everyday">${routineItem.day}</div>
        <label class="switch">
            <input type="checkbox" ${routineItem.isOnOff ? 'checked' : ''} onchange="toggleSwitch('${routineItem.id}')">
            <span class="slider round"></span>
        </label>
    </div>
    `;
};
// 루틴 블록의 UI 업데이트 함수
const updateRoutineBlockUI = (itemId, isOnOff) => {
    const blockElement = document.getElementById(itemId);

    if (blockElement) {
        // 필요에 따라 배경 색상 및 글씨 색상 조절
        blockElement.style.backgroundColor = isOnOff ? '#FFF' : '#F5F5F5';
        blockElement.style.color = isOnOff ? '#000' : '#F8F8F8';

        // 그림자 제거
        blockElement.style.boxShadow = isOnOff ? '' : 'none';
    }
};

// 체크박스 상태 토글 함수
const toggleSwitch = (itemId) => {
    const item = routineItems.find(routineItem => itemId === routineItem.id);

    if (item) {
        // routineItem.isOnOff 값을 토글
        item.isOnOff = !item.isOnOff;

        // 여기서 필요에 따라 추가적인 로직 수행 가능
        //console.log(`Switch toggled for item with ID ${itemId}. New state: ${item.isOnOff}`);
        updateRoutineBlockUI(itemId, item.isOnOff);
    }
};

const loadRoutineBlocks = () => {
    const container = document.getElementById('routine-list');

    routineItems.forEach(routineItem => {
        const subitem = document.createElement('div');
        // subitem.id = routineItem.id;
        // subitem.className = "routine-block";
        subitem.innerHTML = createRoutineBlockInnerHtml(routineItem);
        container.appendChild(subitem);
    });
};
//

window.onload = () => {
    clearRoutineBlocks();
    loadRoutineBlocks();
};

const loadRoutineBlocksNew = (newRoutineItem) => {
    const container = document.getElementById('routine-list');
    const subitem = document.createElement('div');
    // subitem.id = routineItem.id;
    // subitem.className = "routine-block";
    subitem.innerHTML = createRoutineBlockInnerHtml(newRoutineItem);
    container.appendChild(subitem);
};

//입력창 설정
const onClinckPlusButton = (element) => {
    document.getElementById("rt-viewmode").style.display = "none";
    document.getElementById("rt-editmode").style.display = "block";

    // document.getElementById("del-button2").style.display = "none";
    // document.getElementById("right-box-section").style.display = "none";
    // const inputContainer = document.getElementById('input-container');
    // if (inputContainer) {
    //     // + 버튼 클릭 시 입력창을 표시
    //     inputContainer.style.display = 'block';
    // } else {
    //     console.error("Element with id 'input-container' not found.");
    // }
};

const getIconByType = {
    "medicine" : "pill",
    "consult" : "support_agent",
    "diary" : "book_5",
    "exercise" : "directions_run",
};

// 입력을 제출하는 함수
function submitInput() {
    // 제목과 시간을 입력 필드에서 가져오기
    const title = document.getElementById("titleInput").value;
    const time = document.getElementById("timeInput").value;
    const type = document.getElementById("routine-type").value;

    // 선택된 요일 가져오기
    const selectedDays = [];
    const container = document.getElementById("routine-day-picker");
    console.log(container);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    console.log(checkboxes);
    checkboxes.forEach((checkbox) => {
        selectedDays.push(checkbox.value);
    });

    // 고유 ID 생성 (더 견고한 방법이 필요할 수 있음)
    const id = "RT" + (routineItems.length + 1);

    // 새로운 루틴 아이템 객체 생성
    const newRoutineItem = {
        "id": id,
        "type": type,
        "icon" : getIconByType[type],
        "title": title,
        "time": time,
        "day": selectedDays,
        "isOnOff": true,
    };

    // 새로운 루틴 아이템을 배열에 추가
    routineItems.push(newRoutineItem);

    // 업데이트된 routineItems 배열 로깅 (테스트용)
    console.log(routineItems);
    cancelInput();
    //loadRoutineBlocksNew(newRoutineItem);
    clearRoutineBlocks();
    loadRoutineBlocks();
    // 여기서 UI 업데이트 또는 서버로 데이터 전송 등 다른 작업을 수행할 수 있습니다.
}

// 입력 취소하는 함수
function cancelInput() {
    // 입력 필드 초기화
    document.getElementById("titleInput").value = "";
    document.getElementById("timeInput").value = "";

    // 선택된 요일 해제
    const container = document.getElementById("routine-day-picker");
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    // 박스 숨기기
    document.getElementById("rt-editmode").style.display = "none";
}

