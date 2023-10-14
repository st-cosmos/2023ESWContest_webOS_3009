let selectedNavId;
let selectedAutoSettingId = "atp01";
let selectedPresetItem;
let ledButtonStatus = false;

let hslState = {
    h: 180,
    s: 100,
    l: 50,
};

let hslStateActive = {
    h: 180,
    s: 100,
    l: 50,
};

const colorDescriptions = {
    red : {
        title: '붉은 계열',
        text: '붉은 계열의 색은 따뜻한 느낌을 주어 긴장을 완화하는 효과가 있습니다. 다만 너무 채도가 높은 붉은 색을 오래 보는 것은 좋지 않으니 주의해 주세요!',
    },
    yellow : {
        title: '노랑 계열',
        text: '노란 색 계열의 빛들은 따뜻하면서도 경쾌하고 발랄한 느낌을 줍니다.',
    },
    green : {
        title: '초록 계열',
        text: '초록 색은 마음을 차분하고 편안하게 해줍니다.',
    },
    blue : {
        title: '푸른 계열',
        text: '푸른 색 계열의 빛들은 상쾌하고 신선한 느낌을 줄 수 있습니다.',
    },
    white : {
        title: '백색 계열',
        text: '백색 빛을 자주 보는 것은 햇빛은 보는 것과 같은 효과를 줄 수 있습니다.',
    },
};

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

const autoSettingItems = [
    {
        id: "atp01",
        timeDescription: "아침",
        h: 180,
        s: 100,
        l: 50,
        isOnOff: false,
    },
    {
        id: "atp02",
        timeDescription: "점심",
        h: 10,
        s: 100,
        l: 50,
        isOnOff: true,
    },
    {
        id: "atp03",
        timeDescription: "저녁",
        h: 200,
        s: 100,
        l: 50,
        isOnOff: true,
    },
    {
        id: "atp04",
        timeDescription: "취침",
        h: 180,
        s: 100,
        l: 50,
        isOnOff: false,
    },
];

const goToMenuPage = () => {
    window.location.href = "../menu-page/menu-page.html";
};

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
};

const cvtHSLtoRGB = (hVal, sVal, lVal) => {
    // Ensure h is within the range [0, 360]
  h = (hVal % 360 + 360) % 360;
  
  // Normalize s and l to the range [0, 1]
  s = Math.max(0, Math.min(1, sVal/100));
  l = Math.max(0, Math.min(1, lVal/100));

  // Calculate chroma (the "color")
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

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

  // Adjust the RGB values and convert to 8-bit integers
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
};

// === webOS service call
const bridge = new WebOSServiceBridge();
const marigoldServiceUrl = "luna://com.marigold.app.service";

const setLedStatus = (color) => {
    const url = `${marigoldServiceUrl}/light/setStatus`;

    let data;
    if(ledButtonStatus) {
        data = color;
    }
    else {
        data = {
            "r" : 0,
            "g" : 0,
            "b" : 0
        };
    }

    const params = JSON.stringify({
        "data" : data
    });
    
    const callback = (msg) => {
        console.log(msg);
    };

    bridge.onservicecallback = callback;
    bridge.call(url, params);
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
};

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
    // console.log(hslState.h, hslState.s, hslState.l);
    // console.log(cvtHSLtoRGB(hslState.h, hslState.s, hslState.l));
    setLedStatus(cvtHSLtoRGB(hslState.h, hslState.s, hslState.l));
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

const initAutoSettings = () => {
    document.getElementById(selectedAutoSettingId).classList.toggle("active");
    autoSettingItems.forEach(setting => {
        document.getElementById(`pc-${setting.id}`).style.backgroundColor = `hsl(${setting.h}, ${setting.s}%, ${setting.l}%)`;
    });
};

const clickAutoSetItem = (element) => {
    document.getElementById(selectedAutoSettingId).classList.toggle("active");
    selectedAutoSettingId = element.id;
    document.getElementById(selectedAutoSettingId).classList.toggle("active");

    let setting = autoSettingItems.find(item => item.id == element.id);
    document.getElementById("lightsettings-title").innerText = `${setting.timeDescription} 조명 설정`;

    hslStateActive.h = setting.h;
    hslStateActive.s = setting.s;
    hslStateActive.l = setting.l;
    updateSwitchActive(setting.isOnOff);
    updateHueSliderActive(hslStateActive.h);
    updateLightnessSliderActive(hslStateActive.l);
};

const getHueValueActive = () => {
    const hueSlider = document.getElementById("slider-hue-active");
    const input = hueSlider.querySelector("input[type=range]");
    return parseInt(input.value);
};

const getLightnessValueActive = () => {
    const lightnessSlider = document.getElementById("slider-lightness-active");
    const input = lightnessSlider.querySelector("input[type=range]");
    return parseInt(input.value);
};

const updatePreviewActive = (id, h, s, l) => {
    const previewCircle = document.getElementById(id);
    previewCircle.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
};

const setHueSliderActive = () => {
    const hueSlider = document.getElementById("slider-hue-active");
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
        hslStateActive.h = getHueValueActive();
        updatePreviewActive(`pc-${selectedAutoSettingId}`, hslStateActive.h, hslStateActive.s, hslStateActive.l);
        // updateDescription();
        // presetClick();
    });
	input.addEventListener("touchend", () => {
		valueElem.classList.remove("up");
        // console.log(getHueValue());
        hslStateActive.h = getHueValueActive();
        updatePreviewActive(`pc-${selectedAutoSettingId}`, hslStateActive.h, hslStateActive.s, hslStateActive.l);
        // updateDescription();
        // presetClick();
	});
};

const setLightnessSliderActive = () => {
    const lightnessSlider = document.getElementById("slider-lightness-active");
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
        hslStateActive.l = getLightnessValueActive();
        updatePreviewActive(`pc-${selectedAutoSettingId}`, hslStateActive.h, hslStateActive.s, hslStateActive.l);
        // updateDescription();
        // presetClick();
	});
    input.addEventListener("touchend", () => {
		valueElem.classList.remove("up");
        // console.log(getLightnessValue());
        hslStateActive.l = getLightnessValueActive();
        updatePreviewActive(`pc-${selectedAutoSettingId}`, hslStateActive.h, hslStateActive.s, hslStateActive.l);
        // updateDescription();
        // presetClick();
	});
};

const updateSwitchActive = (isOnOff) => {
    // console.log(document.getElementById("switch-active").checked);
    document.getElementById("switch-active").checked = isOnOff;
};

const updateHueSliderActive = (value) => {
    const hueSlider = document.getElementById("slider-hue-active");
	const input = hueSlider.querySelector("input[type=range]");
	const min = input.getAttribute("min");
	const max = input.getAttribute("max");
	const valueElem = hueSlider.querySelector(".value");
    input.value = value;
    // let percent = (input.value - min) / (max - min) * 100;
    // valueElem.style.left = percent + "%";
    const event = new Event("input", {});
    input.dispatchEvent(event);
};

const updateLightnessSliderActive = (value) => {
    const lightnessSlider = document.getElementById("slider-lightness-active");
	const input = lightnessSlider.querySelector("input[type=range]");
    const min = input.getAttribute("min");
	const max = input.getAttribute("max");
    const valueElem = lightnessSlider.querySelector(".value");
    input.value = value;
    // let percent = (input.value - min) / (max - min) * 100;
    // valueElem.style.left = percent + "%";
    const event = new Event("input", {});
    input.dispatchEvent(event);
};

const toggleActiveSwitch = (element) => {
    // console.log(document.getElementById(element.id).checked);
    let isOnOff = document.getElementById(element.id).checked;
    let setting = autoSettingItems.find(item => item.id == selectedAutoSettingId);
    setting.isOnOff = isOnOff;
};

const onSwitchToggle = () => {
    ledButtonStatus = document.getElementById("tgs").checked;
    console.log(ledButtonStatus);
    updatePreview();
};

// === timer ===
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
        // alert('타이머가 종료되었습니다.');
        ledButtonStatus = false;
        document.getElementById("tgs").checked = ledButtonStatus;
        updatePreview();
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
};

const updateTimerDisplay = () => {
    document.getElementById("timer-hours").value = hours;
    document.getElementById("timer-minutes").value = minutes;
    document.getElementById("timer-seconds").value = seconds;
}

window.onload = () => {
    setHueSliderActive();
    setLightnessSliderActive();
    initAutoSettings();
    setColorPreset();
    setHueSlider();
    setLightnessSlider();
    updatePreview();
    updateDescription();
};