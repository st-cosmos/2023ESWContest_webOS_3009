const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};

let selectedNavId;

const navClick = (element) => {
    if(selectedNavId) {
        document.getElementById(selectedNavId).classList.toggle("active");
    }

    selectedNavId = element.id;
    document.getElementById(selectedNavId).classList.toggle("active");

    // console.log(selectedNavId);
    if(selectedNavId == "nv-auto") {
        document.getElementById("main-section-auto").style.display = "block";
        document.getElementById("main-section-passive").style.display = "none";
    }

    else if(selectedNavId == "nv-passive") {
        document.getElementById("main-section-auto").style.display = "none";
        document.getElementById("main-section-passive").style.display = "block";
    }
};

let hslState = {
    h: 180,
    s: 100,
    l: 50,
};

const cvtRGBToHSL = (rVal, gVal, bVal) => {
    // Normalize RGB values
    let r = rVal / 255;
    let g = gVal / 255;
    let b = bVal / 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
        h = s = 0; // Grayscale
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
            case g:
            h = (b - r) / d + 2;
            break;
            case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
    }
  
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

const cvtHSLtoRGB = (hVal, sVal, lVal) => {
    // Normalize HSL values
    let h = (hVal % 360 + 360) % 360; // Ensure h is between 0 and 359
    let s = Math.min(100, Math.max(0, sVal)); // Ensure s is between 0 and 100
    let l = Math.min(100, Math.max(0, lVal)); // Ensure l is between 0 and 100
  
    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s / 100;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l / 100 - c / 2;
  
    let r, g, b;
  
    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }
  
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
  
    return { r, g, b };
};

const rgbStringToValue = (rgbString) => {
    // Use a regular expression to extract the numeric values
    const match = rgbString.match(/\d+/g);

    if (match && match.length === 3) {
        const r = parseInt(match[0], 10);
        const g = parseInt(match[1], 10);
        const b = parseInt(match[2], 10);

        return { r, g, b };
    } else {
        throw new Error("Invalid RGB string format");
    }
}

const getHueValue = () => {
    const hueSlider = document.getElementById("slider-hue");
    const input = hueSlider.querySelector("input[type=range]");
    return parseInt(input.value);
};

const getLightnessValue = () => {
    const lightnessSlider = document.getElementById("slider-lightness");
    const input = lightnessSlider.querySelector("input[type=range]");
    return parseInt(input.value);
};

const updatePreview = () => {
    const previewCircle = document.getElementById("preview-circle");
    previewCircle.style.backgroundColor = `hsl(${hslState.h}, ${hslState.s}%, ${hslState.l}%)`;
};

const setHueSlider = () => {
    const hueSlider = document.getElementById("slider-hue");
	const input = hueSlider.querySelector("input[type=range]");
	const min = input.getAttribute("min");
	const max = input.getAttribute("max");
	const valueElem = hueSlider.querySelector(".value");

	const setValueElem = () => {
        let h = parseInt(input.value);
        valueElem.style.backgroundColor = `hsl(${h}, 100%, 50%)`;
		
        let percent = (input.value - min) / (max - min) * 100;
		valueElem.style.left = percent + "%";
	}
	setValueElem();

	input.addEventListener("input", setValueElem);
	input.addEventListener("mousedown", () => {
		valueElem.classList.add("up");
	});
    input.addEventListener("touchstart", () => {
        valueElem.classList.add("up");
	});
    input.addEventListener("mouseup", () => {
        valueElem.classList.remove("up");
        // console.log(getHueValue());
        hslState.h = getHueValue();
        updatePreview();
        updateDescription();
        presetClick();
    });
	input.addEventListener("touchend", () => {
		valueElem.classList.remove("up");
        // console.log(getHueValue());
        hslState.h = getHueValue();
        updatePreview();
        updateDescription();
        presetClick();
	});
};

const setLightnessSlider = () => {
    const lightnessSlider = document.getElementById("slider-lightness");
	const input = lightnessSlider.querySelector("input[type=range]");
	const min = input.getAttribute("min");
	const max = input.getAttribute("max");
	const valueElem = lightnessSlider.querySelector(".value");

	const setValueElem = () => {
        let value = parseInt(input.value);
        valueElem.innerText = value;
        // valueElem.style.backgroundColor = `rgb(${value}, ${value}, ${value})`;
		
        let percent = (input.value - min) / (max - min) * 100;
		valueElem.style.left = percent + "%";
	}
	setValueElem();

	input.addEventListener("input", setValueElem);
	input.addEventListener("mousedown", () => {
		valueElem.classList.add("up");
	});
    input.addEventListener("touchstart", () => {
		valueElem.classList.add("up");
	});
	input.addEventListener("mouseup", () => {
		valueElem.classList.remove("up");
        // console.log(getLightnessValue());
        hslState.l = getLightnessValue();
        updatePreview();
        updateDescription();
        presetClick();
	});
    input.addEventListener("touchend", () => {
		valueElem.classList.remove("up");
        // console.log(getLightnessValue());
        hslState.l = getLightnessValue();
        updatePreview();
        updateDescription();
        presetClick();
	});
};

let selectedPresetItem;

const updateHueSlider = () => {
    const hueSlider = document.getElementById("slider-hue");
	const input = hueSlider.querySelector("input[type=range]");
	const min = input.getAttribute("min");
	const max = input.getAttribute("max");
	const valueElem = hueSlider.querySelector(".value");
    input.value = hslState.h;
    // let percent = (input.value - min) / (max - min) * 100;
    // valueElem.style.left = percent + "%";
    const event = new Event("input", {});
    input.dispatchEvent(event);
};

const updateLightnessSlider = () => {
    const lightnessSlider = document.getElementById("slider-lightness");
	const input = lightnessSlider.querySelector("input[type=range]");
    const min = input.getAttribute("min");
	const max = input.getAttribute("max");
    const valueElem = lightnessSlider.querySelector(".value");
    input.value = hslState.l;
    // let percent = (input.value - min) / (max - min) * 100;
    // valueElem.style.left = percent + "%";
    const event = new Event("input", {});
    input.dispatchEvent(event);
};

const presetClick = (element) => {
    if(element) {
        // console.log(element.id);
        if(selectedPresetItem) {
            document.getElementById(selectedPresetItem).innerText ='';
        }
        
        selectedPresetItem = element.id;
        document.getElementById(selectedPresetItem).innerText = '✔';
    
        let rgbString = document.getElementById(selectedPresetItem).style.backgroundColor;
        let rgb = rgbStringToValue(rgbString);
        let hsl = cvtRGBToHSL(rgb.r, rgb.g, rgb.b);
        hslState.h = hsl.h;
        hslState.l = hsl.l;
    
        updateHueSlider();
        updateLightnessSlider();
        updatePreview();
        updateDescription();
    }
    else {
        if(selectedPresetItem) {
            document.getElementById(selectedPresetItem).innerText ='';
            selectedPresetItem = null;
        }
    }
}

const colorPresetList = [
    {
        id: 'cp0',
        hslString: `hsl(53, 100%, 87%)`,
    },
    {
        id: 'cp1',
        hslString: `hsl(103, 100%, 79%)`,
    },
    {
        id: 'cp2',
        hslString: `hsl(169, 100%, 79%)`,
    },
    {
        id: 'cp3',
        hslString: `hsl(237, 100%, 66%)`,
    },
    {
        id: 'cp4',
        hslString: `hsl(55, 100%, 94%)`,
    },
];

const getColorPresetItemInnerHtml = (colorPreset) => {
    return `
    <div id="${colorPreset.id}" class="color-preset-item" onclick="presetClick(this)"></div>
    `;
};

const setColorPreset = () => {
    const container = document.getElementById('tbc-preset');

    colorPresetList.forEach(colorPreset => {
        container.innerHTML += getColorPresetItemInnerHtml(colorPreset);
        document.getElementById(colorPreset.id).style.backgroundColor = colorPreset.hslString;
    });
};

const colorDescriptions = {
    red : {
        title: '붉은 계열',
        text: '붉은 색은 어쩌구 저쩌구',
    },
    yellow : {
        title: '노랑 계열',
        text: '노란 색은 어쩌구 저쩌구',
    },
    green : {
        title: '초록 계열',
        text: '초록 색은 어쩌구 저쩌구',
    },
    blue : {
        title: '푸른 계열',
        text: '푸른 색은 어쩌구 저쩌구',
    },
    white : {
        title: '백색 계열',
        text: '백색은 어쩌구 저쩌구',
    },
};

const setColorDescription = (des) => {
    document.getElementById('color-description-title').innerText = des.title;
    document.getElementById('color-description-text').innerText = des.text;
};

const updateDescription = () => {
    if(hslState.l > 97) {
        setColorDescription(colorDescriptions.white);
    }
    else {
        if(hslState.h < 30 || hslState.h >= 270) {
            setColorDescription(colorDescriptions.red);
        }
        else if(hslState.h >= 30 && hslState.h < 70) {
            setColorDescription(colorDescriptions.yellow);
        }
        else if(hslState.h >= 70 && hslState.h < 170) {
            setColorDescription(colorDescriptions.green);
        }
        else if(hslState.h >= 170 && hslState.h < 270) {
            setColorDescription(colorDescriptions.blue);
        }        
    }
};

window.onload = () => {
    setColorPreset();
    setHueSlider();
    setLightnessSlider();
    updatePreview();
    updateDescription();
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
        alert('타이머가 종료되었습니다.');
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

//창바꾸기//
const items = document.querySelectorAll('.preview-item');
const resultTitle = document.getElementById('lightsettings-title');
const switchInput = document.getElementById('switch2');
const sliderInput = document.getElementById('slider2');

const itemContents = [
    { title: '아침 조명 설정' },
    { title: '점심 조명 설정' },
    { title: '저녁 조명 설정' },
    { title: '취침 조명 설정' }
];

// 클릭 이벤트 핸들러를 모듈화하여 재사용
function onItemClick(index) {
    resultTitle.innerHTML = itemContents[index].title;

    // 스위치와 슬라이더 초기값 설정
    const itemSettings = JSON.parse(localStorage.getItem(`itemSettings_${index}`)) || {
        switch: false,
        sliderValue: 50
    };

    switchInput.checked = itemSettings.switch;
    sliderInput.value = itemSettings.sliderValue;
}

let selectedIndex = -1; // 선택한 항목의 인덱스

items.forEach((item, index) => {
    item.addEventListener('click', () => {
        selectedIndex = index;
        onItemClick(index); // 항목 클릭 시 초기 설정 적용
    });
});

switchInput.addEventListener('change', () => {
    if (selectedIndex !== -1) {
        const itemSettings = {
            switch: switchInput.checked,
            sliderValue: sliderInput.value
        };
        localStorage.setItem(`itemSettings_${selectedIndex}`, JSON.stringify(itemSettings));
    }
});

// 페이지 로드 시 선택된 항목에 대한 초기 설정 적용
window.addEventListener('load', () => {
    if (selectedIndex !== -1) {
        onItemClick(selectedIndex);
    }
});