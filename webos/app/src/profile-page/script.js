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
        if (deltaX < 0) {
            window.location.href = "../main-page/main-page.html";
        }
        isSwiping = false;
    }
});

swipeContainer.addEventListener('touchend', () => {
    isSwiping = false;
});

const goToMainPage = () => {
    window.location.href = "../main-page/main-page.html";
};

const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};

// === webOS service call
const bridge = new WebOSServiceBridge();
const marigoldServiceUrl = "luna://com.marigold.app.service";

const getUserInfo = () => {
    const url = `${marigoldServiceUrl}/getUserInfo`;
    const params = JSON.stringify({
        "id":"User001",
    });
    
    const callback = (msg) => {
        let res = JSON.parse(msg);
        let userInfo = JSON.parse(res.Response);
        console.log(userInfo);
        applyUserInfo(userInfo);
    };
    bridge.onservicecallback = callback;
    bridge.call(url, params);
};

const setUserInfo = (data) => {
    const url = `${marigoldServiceUrl}/setUserInfo`;
    const params = JSON.stringify({
        "data" : data
    });
    
    const callback = (msg) => {
        // let res = JSON.parse(msg);
        // let userInfo = JSON.parse(res.Response);
        // console.log(userInfo);
        // applyUserInfo(userInfo);
        console.log(msg);
    };
    bridge.onservicecallback = callback;
    bridge.call(url, params);
};

const editMode = () => {
    document.getElementById("text-name").style.display = "none";
    document.getElementById("text-birthdate").style.display = "none";
    document.getElementById("text-address").style.display = "none";
    document.getElementById("text-phonenumber").style.display = "none";

    document.getElementById("input-name").style.display = "block";
    document.getElementById("input-birthdate").style.display = "block";
    document.getElementById("input-address").style.display = "block";
    document.getElementById("input-phonenumber").style.display = "block";

    document.getElementById("input-name").value = document.getElementById("text-name").innerText;
    document.getElementById("input-birthdate").value = document.getElementById("text-birthdate").innerText;
    document.getElementById("input-address").value = document.getElementById("text-address").innerText;
    document.getElementById("input-phonenumber").value = document.getElementById("text-phonenumber").innerText;

    document.getElementById("button-edit").style.display = "none";
    document.getElementById("button-save").style.display = "block";
    document.getElementById("button-cancle").style.display = "block";
};

const editCancle = () => {
    document.getElementById("text-name").style.display = "block";
    document.getElementById("text-birthdate").style.display = "block";
    document.getElementById("text-address").style.display = "block";
    document.getElementById("text-phonenumber").style.display = "block";

    document.getElementById("input-name").style.display = "none";
    document.getElementById("input-birthdate").style.display = "none";
    document.getElementById("input-address").style.display = "none";
    document.getElementById("input-phonenumber").style.display = "none";

    document.getElementById("button-edit").style.display = "block";
    document.getElementById("button-save").style.display = "none";
    document.getElementById("button-cancle").style.display = "none";
};

const viewMode = () => {
    document.getElementById("text-name").style.display = "block";
    document.getElementById("text-birthdate").style.display = "block";
    document.getElementById("text-address").style.display = "block";
    document.getElementById("text-phonenumber").style.display = "block";

    document.getElementById("input-name").style.display = "none";
    document.getElementById("input-birthdate").style.display = "none";
    document.getElementById("input-address").style.display = "none";
    document.getElementById("input-phonenumber").style.display = "none";

    document.getElementById("text-name").innerText = document.getElementById("input-name").value;
    document.getElementById("text-birthdate").innerText = document.getElementById("input-birthdate").value;
    document.getElementById("text-address").innerText = document.getElementById("input-address").value;
    document.getElementById("text-phonenumber").innerText = document.getElementById("input-phonenumber").value;

    document.getElementById("button-edit").style.display = "block";
    document.getElementById("button-save").style.display = "none";
    document.getElementById("button-cancle").style.display = "none";

    let data = {
        "name" : document.getElementById("text-name").innerText,
        "birthdate" : document.getElementById("text-birthdate").innerText,
        "address" : document.getElementById("text-address").innerText,
        "phonenumber" : document.getElementById("text-phonenumber").innerText,
    };
    setUserInfo(data);
};

const applyUserInfo = (userInfo) => {
    document.getElementById("text-name").innerText = userInfo.name;
    document.getElementById("text-birthdate").innerText = userInfo.birthdate;
    document.getElementById("text-address").innerText = userInfo.address;
    document.getElementById("text-phonenumber").innerText = userInfo.phonenumber;
};

window.onload = () => {
    getUserInfo();
};