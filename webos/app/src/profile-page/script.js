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