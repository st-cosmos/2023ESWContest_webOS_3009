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
        "type": "어쩌구",
        "title" : "어쩌구 ",
        "time" : "오전 08:00",
        "day" : ["월", "화", "수"],
        "isOnOff" : true,
    },
    {
        "id" : "RT3",
        "type": "Medicine",
        "title" : "저쩌구",
        "time" : "오전 08:00",
        "day" : ["월", "화", "수"],
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
              일 월 화 수 목 금 토
          </div>
          <div id="save-del-button">
              <div id="del-button">삭제</div>
              <div id="save-button">수정</div>
          </div>
    </div>
    `;
};
const loadRoutineBlocksRight = (rightRoutineItems) =>{
    console.log(rightRoutineItems);
    const container = document.getElementById('right-box-section');

    const subitem = document.createElement('div');
     // subitem.id = routineItem.id;
     // subitem.className = "routine-block";
     subitem.innerHTML = createRoutineBlockRightInnerHtml(rightRoutineItems);
     container.appendChild(subitem);
 
};

const clickRoutineBlock = (element) => {
    console.log(element.id);
    const item = routineItems.find(routineItem => element.id == routineItem.id);
    console.log(item);
    clearRoutineBlocksRight();
    loadRoutineBlocksRight(item);
};

const createRoutineBlockInnerHtml = (routineItem) => {
    return `
    <div id="${routineItem.id}" class="routine-block" onclick="clickRoutineBlock(this)">
        <div id="routine-picture">${routineItem.type}</div>
        <div id="routine-time">${routineItem.time}</div>
        <div id="routine-to-do">${routineItem.title}</div>
        <div id="routine-everyday">${routineItem.day}</div>
        <div id="routine-button">ON</div>
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


//입력창 설정
const onClinckPlusButton = (element) => {
    // + 버튼 클릭 시 입력창을 표시
    document.getElementById('input-container').style.display = 'block';
};

const submitInput = () => {
    // 입력창에 입력된 값을 가져와서 사용하거나 다른 처리 수행
    const inputValue = document.getElementById('input-field').value;
    console.log('Submitted input:', inputValue);

    // 입력 완료 후 입력창 감추기
    document.getElementById('input-container').style.display = 'none';
};

