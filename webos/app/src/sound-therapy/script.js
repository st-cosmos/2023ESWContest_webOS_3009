const API_KEY = "AIzaSyBqW_KcOqo9-qHMa4-qcTRGF8m2WsILqF8";
const BASE_URL = "https://www.googleapis.com/youtube/v3/videos?";

const videoList = [
    {
        id: "vid01",
        videoId: "JWtWc3bvDy4",
        title: "[Delta] Peaceful Night",
        detailedInfo: "델타파란 어쩌구 저쩌구",
    },
    {
        id: "vid02",
        videoId: "ws8ofAF0Gxk",
        title: "[Alpha] Alpha Waves Music",
        detailedInfo: "알파파란 어쩌구 저쩌구",
    },
    {
        id: "vid03",
        videoId: "ws8ofAF0Gxk",
        title: "[Alpha] Alpha Waves Music",
        detailedInfo: "알파파란 어쩌구 저쩌구",
    },
];

const playList = [];

let selectedVideo;

const clearPlayList = () => {
    const container = document.getElementById("play-list");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const loadPlayList = () => {

    videoList.forEach(video => {
        const url = `${BASE_URL}id=${video.videoId}&key=${API_KEY}&part=snippet,contentDetails`;
        
        fetch(url)
        .then(res=>res.json())
        .then(data=>{
            const videoInfo = data.items[0];
            const snippet = videoInfo.snippet;
            const contentDetails = videoInfo.contentDetails;

            // console.log(snippet.thumbnails.medium.url);
            // console.log(snippet.title);
            // console.log(parseDuration(contentDetails.duration));

            applyPlayItemToUi(
                {
                    id: video.id,
                    title: video.title,
                    videoId: video.videoId,
                    detailedInfo: video.detailedInfo,
                    imgUrl: snippet.thumbnails.medium.url,
                    description: snippet.title,
                    duration: parseDuration(contentDetails.duration),
                }
            );
        })
        .catch(error => console.error('Error:', error));
    });
};

const createPlayerInnerHtml = (playItem) => {
    return `
    <div class="pc-title">
        <p class="font-pc-title">${playItem.title}</p>
    </div>
    <div class="pc-description">
        <p class="font-pc-description">${playItem.description}</p>
    </div>
    <div class="pc-info">
        <p class="font-pc-info">${playItem.detailedInfo}</p>
    </div>
    <div class="pc-video">
        <iframe id="youtubeVideo" class="style-pc-video" src="https://www.youtube.com/embed/${playItem.videoId}?autoplay=1&rel=0&enablejsapi=1" frameborder="0" allow="autoplay; fullscreen"></iframe>
    </div>
    `;
};


const playMusic = (playItem) => {
    const container = document.getElementById('play-card');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const subitem = document.createElement('div');
    subitem.className = "play-card-inner";
    subitem.innerHTML = createPlayerInnerHtml(playItem);

    container.appendChild(subitem);
};

const stopMusic = () => {
    console.log(selectedVideo);
    if(selectedVideo) {
        let iframe = document.getElementById("youtubeVideo").contentWindow;
        iframe.postMessage(
            JSON.stringify({
                event: "command",
                func: "pauseVideo",
                args: ""
            }), '*'
        );
        console.log('{"event":"command", "func":"stopVideo", "args":""}');
    }
};

const playItemOnClickHandler = (element) => {
    const elementId = element.id;

    const playItem = playList.find(playItem => playItem.id == elementId);
    // console.log(playItem);

    if(selectedVideo) {
        document.getElementById(selectedVideo).classList.toggle("active");
    }

    document.getElementById(elementId).classList.toggle("active");
    selectedVideo = elementId;

    playMusic(playItem);
};

const createPlayItemInnerHtml = (playItem) => {
    return  `
    <div id="${playItem.id}" class="play-item" onclick="playItemOnClickHandler(this)">
        <div class="pi-img">
            <img src="${playItem.imgUrl}" class="img-pi-img">
        </div>
        <div class="pi-title">
            <p class="font-pi-tile">${playItem.title}</p>
        </div>
        <div class="pi-description">
            <p class="font-pi-text">${playItem.description}</p>
        </div>
        <div class="pi-time">
            <p class="font-pi-text">${playItem.duration}</p>
        </div>
        <p class="video-id">${playItem.videoId}</p>
    </div>
    `;
};

const applyPlayItemToUi = (playItem) => {
    playList.push(playItem);

    const subitem = document.createElement("div");
    subitem.innerHTML = createPlayItemInnerHtml(playItem);
    
    const container = document.getElementById("play-list");
    container.appendChild(subitem);
};

// === timer
let seconds = 0;
let minutes = 0;
let hours = 0;
let timerInterval;

const timerStart = () => {
    const startButton = document.getElementById("timer-start-button");
    startButton.style.display = 'none';

    const resetButton = document.getElementById("timer-reset-button");
    resetButton.style.display = 'inline-block';

    hours = parseInt(document.getElementById('timer-hours').value);
    minutes = parseInt(document.getElementById('timer-minutes').value);
    seconds = parseInt(document.getElementById('timer-seconds').value);
    if(!hours) hours = 0;
    if(!minutes) minutes = 0;
    if(!seconds) seconds = 0;
    
    setTimerInput(false);
    updateTimerDisplay();

    timerInterval = setInterval(updateTimer, 1000);
};

const timerReset = (isFinished) => {
    if(isFinished) {
        stopMusic();
        // alert('Finished!');
    }

    const startButton = document.getElementById("timer-start-button");
    startButton.style.display = 'inline-block';

    const resetButton = document.getElementById("timer-reset-button");
    resetButton.style.display = 'none';

    clearInterval(timerInterval);
    seconds = 0;
    minutes = 10;
    hours = 0;
    updateTimerDisplay();
    setTimerInput(true);
};

const setTimerInput = (isAble) => {
    document.getElementById("timer-hours").disabled = !isAble;
    document.getElementById("timer-minutes").disabled = !isAble;
    document.getElementById("timer-seconds").disabled = !isAble;
};

const updateTimer = () => {
    seconds--;
    if (seconds < 0) {
        seconds = 59;
        minutes--;
        
        if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
                timerReset(true);
                return;
            }
        }
    }
    updateTimerDisplay();
}

const updateTimerDisplay = () => {
    document.getElementById("timer-hours").value = hours;
    document.getElementById("timer-minutes").value = minutes;
    document.getElementById("timer-seconds").value = seconds;
}

window.onload = () => {
    clearPlayList();
    loadPlayList();
};

const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};