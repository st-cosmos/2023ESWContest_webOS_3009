const clickCancle = () => {
    window.location.href = "./diary.html";
};

// === webOS service call
const bridge = new WebOSServiceBridge();
const marigoldServiceUrl = "luna://com.marigold.app.service";

const saveDiary = (text) => {
    const url = `${marigoldServiceUrl}/addDiary`;
    const params = JSON.stringify({
        "data" : {
            "createdAt": (new Date()).toISOString(),
            "text": text
        }
    });
    
    const callback = (msg) => {
        console.log(msg);
        diaryList = JSON.parse(JSON.parse(msg).Response);
    };

    bridge.onservicecallback = callback;
    bridge.call(url, params);
};

const clickSave = () => {
    const text = document.getElementById("diary-input").value;
    // console.log(text);
    saveDiary(text);
};

const showDate = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const searchParams = url.searchParams;

    const dateString = searchParams.get('date');
    
    if(dateString) {
        document.getElementById("text-date").innerText = dateString;
    }
};

window.onload = () => {
    showDate();
};