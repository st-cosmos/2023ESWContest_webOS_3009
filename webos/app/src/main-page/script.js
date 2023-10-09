const getUsername = () => {
    return '골댕이';
};

const getChatHistory = () => {
    let data = [
        {
            id: 0,
            content: '좋은 아침이에요. 🤗 오늘은 날씨가 좋은데, 산책을 나가보는 건 어떨까요? ☀',
            createAt: '2023-09-29T02:04:42.133Z',
        },
        {
            id: 1,
            content: '저녁식사 꼭 챙겨먹고 약도 잊지 말고 먹어요 💊',
            createAt: '2023-09-29T04:34:42.133Z',
        },
        {
            id: 2,
            content: '어제보다 수면 시간이 줄었어요. 오늘은 취침 전 사운드테라피를 해보는 건 어떨까요? 😴',
            createAt: '2023-09-29T05:34:42.133Z',
        },
        {
            id: 3,
            content: '좋은 아침이에요. 🤗 오늘은 날씨가 좋은데, 산책을 나가보는 건 어떨까요? ☀',
            createAt: '2023-09-29T02:04:42.133Z',
        },
        {
            id: 4,
            content: '저녁식사 꼭 챙겨먹고 약도 잊지 말고 먹어요 💊',
            createAt: '2023-09-29T04:34:42.133Z',
        },
        {
            id: 5,
            content: '어제보다 수면 시간이 줄었어요. 오늘은 취침 전 사운드테라피를 해보는 건 어떨까요? 😴',
            createAt: '2023-09-29T05:34:42.133Z',
        },
    ];

    return data;
};

const getQuote = () => {
    return {
        content: '어떠 사람들은<br>그저 평범하기 위해<br>엄청난 에너지를 소비한다는<br>사실을 깨닫지 못합니다.',
        name: '알베르 카뮈',
    };
};

// title에 이름 넣기
const applyUsernameToUi = (username) => {
    const contentTitle = document.getElementById('content-title');
    contentTitle.textContent = `안녕하세요, ${username} 님!`;
};

// chat histoy
const formatTimeString = (inputDateString) => {
    // Convert the input date string to a JavaScript Date object
    const date = new Date(inputDateString);

    // Extract the hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine whether it's AM or PM
    const period = hours >= 12 ? '오후' : '오전';

    // Convert 24-hour format to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Create the formatted time string
    const formattedTimeString = `${period} ${formattedHours}:${String(minutes).padStart(2, '0')}`;

    return formattedTimeString;
};

const createChatInnerHtml = (content, createAt) => {
    let tag = `
    <img src="../../assets/leaf-filled.svg" class="chat-icon">
    <div class="chat-content">
        <div class="chat-box">${content}</div>
        <div class="chat-time">${formatTimeString(createAt)}</div>
    </div>
    `;

    return tag;
}

const applyChatHistory = (chatHistory) => {
    const container = document.getElementById("chat-history");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    chatHistory.forEach(chat => {
        const subitem = document.createElement("div");
        subitem.className = "chat";
        subitem.innerHTML = createChatInnerHtml(chat.content, chat.createAt);
        
        container.appendChild(subitem);
    });
};

// 관용구 카드 
const applyQuoteToUi = (quote) => {
    const container = document.getElementById("quote-card-content");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const contentText = document.createElement("p");
    contentText.className = "font-quote-content-text";
    contentText.innerHTML = `${quote.content}<br><br><span style="font-weight:700;">-${quote.name}</span>`

    container.appendChild(contentText);
};

window.onload = () => {
    let username = getUsername();
    applyQuoteToUi(username);

    let chatHistory = getChatHistory();
    applyChatHistory(chatHistory);

    let quote = getQuote();
    applyQuoteToUi(quote);
};

// === swipe event ===
const swipeContainer = document.getElementById("main-content");

let startX = 0;
let isSwiping = false;

swipeContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
});

swipeContainer.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    // Minimum distance to consider it a swipe
    if (Math.abs(deltaX) > 50) {
        // const text = deltaX > 0 ? 'Swipe Right' : 'Swipe Left';
        // console.log(text);
        if(deltaX > 0) {
            window.location.href = "../profile-page/profile-page.html";
        }
        else if (deltaX < 0) {
            window.location.href = "../menu-page/menu-page.html";
        }
        isSwiping = false;
    }
});

swipeContainer.addEventListener('touchend', () => {
    isSwiping = false;
});

const goToProfilePage = () => {
    window.location.href = "../profile-page/profile-page.html";
};

const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};