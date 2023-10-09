const clickCancle = () => {
    window.location.href = "./diary.html";
};

const clickSave = () => {
    const text = document.getElementById("diary-input").value;
    console.log(text);
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