const buttons = document.querySelectorAll('.change-preview-contents-button');
const title = document.getElementById('title');
const content = document.getElementById('content');

// 각 버튼에 대한 클릭 이벤트 핸들러를 설정합니다.
buttons.forEach(function (button, index) {
    button.addEventListener('click', function () {
        // 클릭한 버튼에 따라 제목과 내용을 변경합니다.
        if (index === 0) {
            title.textContent = '버튼 1 제목';
            content.textContent = '버튼 1 내용';
        } else if (index === 1) {
            title.textContent = '버튼 2 제목';
            content.textContent = '버튼 2 내용';
        } else if (index === 2) {
            title.textContent = '버튼 3 제목';
            content.textContent = '버튼 3 내용';
        } else if (index === 3) {
            title.textContent = '버튼 3 제목';
            content.textContent = '버튼 3 내용';
        } else if (index === 4) {
            title.textContent = '버튼 3 제목';
            content.textContent = '버튼 3 내용';
        }
    });
});