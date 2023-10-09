const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};

const routineItems = [
    {
        "id" : "RT1",
        "type": "Medicine",
        "title" : "아침 약 먹기",
        "time" : "오전 08:00",
        "day" : ["월", "화", "수","목","금","토","일"],
        "isOnOff" : true,
    },
    {
        "id" : "RT2",
        "type": "dentist",
        "title" : "치과가기 ",
        "time" : "오전 10:00",
        "day" : ["월", "화", "수"],
        "isOnOff" : true,
    },
    {
        "id" : "RT3",
        "type": "diary",
        "title" : "일기쓰기",
        "time" : "오후 07:00",
        "day" : ["월", "화", "수","목","금","토","일"],
        "isOnOff" : true,
    },
    {
        "id" : "RT4",
        "type": "Medicine",
        "title" : "어쩌구 저쩌구",
        "time" : "오전 08:00",
        "day" : ["월", "화", "수"],
        "isOnOff" : true,
    }
];

const clearRoutineBlocks = () => {
    const container = document.getElementById("routine-list");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

const clearRoutineBlocksRight = () =>{
    const container = document.getElementById("right-box-section");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};
const createRoutineBlockRightInnerHtml = (routineItemRight) => {
    return `
    <div class="right-box">
          <div id="routine-name">
              <div id="routine-name-a">${routineItemRight.type}</div>
              <div id="routine-name-b">${routineItemRight.title}</div>
          </div>
          <div id="routine-time-detail">
              ${routineItemRight.time}
          </div>
          <div id="routine-day">
              ${routineItemRight.day}
          </div>
    </div>
    `;
};
const loadRoutineBlocksRight = (rightRoutineItems) =>{
    //console.log(rightRoutineItems);
    document.getElementById("input-container").style.display = "none";
    document.getElementById("del-button2").style.display = "block";
    document.getElementById("right-box-section").style.display = "block";
    const container = document.getElementById('right-box-section');
    const subitem = document.createElement('div');
     // subitem.id = routineItem.id;
     // subitem.className = "routine-block";
     subitem.innerHTML = createRoutineBlockRightInnerHtml(rightRoutineItems);
     container.appendChild(subitem);
 
};

let deleteItem;
const deleteRoutineItem = () => {
     // 경고창 표시
     const isConfirmed = window.confirm('삭제할 것입니까?');

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
             document.getElementById("del-button2").style.display = "none";
             document.getElementById("right-box-section").style.display = "none";
 
         } else {
             console.error(`Item with id ${id} not found.`);
         }
     } else {
         // 취소 버튼이 눌렸을 때의 동작
         console.log('삭제가 취소되었습니다.');
     }
};

const clickRoutineBlock = (element) => {
    console.log(element.id);
    const item = routineItems.find(routineItem => element.id == routineItem.id);
    console.log(item);
    clearRoutineBlocksRight();
    loadRoutineBlocksRight(item);
    deleteItem = element.id;
};

const createRoutineBlockInnerHtml = (routineItem) => {
    return `
    <div id="${routineItem.id}" class="routine-block" onclick="clickRoutineBlock(this)">
        <div id="routine-picture">${routineItem.type}</div>
        <div id="routine-time">${routineItem.time}</div>
        <div id="routine-to-do">${routineItem.title}</div>
        <div id="routine-everyday">${routineItem.day}</div>
        <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
        </label>
    </div>
    `;
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
    document.getElementById("del-button2").style.display = "none";
    document.getElementById("right-box-section").style.display = "none";
    const inputContainer = document.getElementById('input-container');
    if (inputContainer) {
        // + 버튼 클릭 시 입력창을 표시
        inputContainer.style.display = 'block';
    } else {
        console.error("Element with id 'input-container' not found.");
    }
};

// 입력을 제출하는 함수
function submitInput() {
    // 제목과 시간을 입력 필드에서 가져오기
    const title = document.getElementById("titleInput").value;
    const time = document.getElementById("timeInput").value;

    // 선택된 요일 가져오기
    const selectedDays = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach((checkbox) => {
        selectedDays.push(checkbox.value);
    });

    // 고유 ID 생성 (더 견고한 방법이 필요할 수 있음)
    const id = "RT" + (routineItems.length + 1);

    // 새로운 루틴 아이템 객체 생성
    const newRoutineItem = {
        "id": id,
        "type": "Medicine",  // 필요에 따라 조정 가능
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
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    // 박스 숨기기
    document.getElementById("input-container").style.display = "none";
}

