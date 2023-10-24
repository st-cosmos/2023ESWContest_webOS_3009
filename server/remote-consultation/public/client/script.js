const peerConnections = {};
let peerConnection;
const config = {
  iceServers: [
    { 
      "urls": "stun:stun.l.google.com:19302",
    },
  ]
};

// setting video
const socket = io.connect('//');
const videoLeft = document.querySelector("#video-left");
const videoRight = document.querySelector("#video-right");

console.log(navigator);
navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
}).then(gotStream).catch(function(e) {
  alert('getUserMedia() error ' + e.name);
});

function gotStream(stream) {
  console.log('local stream');
  videoLeft.srcObject = stream;
  socket.emit("broadcaster"); // set the broadcaster
}

// rtc peer connection
// when broadcaster and watcher exist
socket.on("watcher", id => {
  console.log("a");
  const peerConnection = new RTCPeerConnection(config);
  peerConnections[id] = peerConnection;

  let stream = videoLeft.srcObject;
  stream.getTracks().forEach(track => {peerConnection.addTrack(track, stream); console.log(track);}); // add each track of the stream to peerConnection
  
  console.log("a");
  peerConnection.onicecandidate = event => {
    console.log("c");

    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
      console.log("d");
    }
  };

  peerConnection
    .createOffer()
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("offer", id, peerConnection.localDescription);
      console.log("e");
    });
});

socket.on("answer", (id, description) => {
  peerConnections[id].setRemoteDescription(description);
  console.log("f");
});

socket.on("watcher-candidate", (id, candidate) => {
  console.log('watcher-candidate', candidate)
  peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
  console.log("g");
});

socket.on("disconnectPeer", id => {
  peerConnections[id].close();
  delete peerConnections[id];
  console.log("h");
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
  peerConnection.close();
};

// ========================================

socket.on("offer", (id, description) => {
  console.log("1");
  peerConnection = new RTCPeerConnection(config);
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("answer", id, peerConnection.localDescription);
    });
  peerConnection.ontrack = event => {
    console.log("track", event.streams[0].getTracks());
    videoRight.srcObject = event.streams[0];
    console.log("2");
  };
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("watcher-candidate", id, event.candidate);
      console.log("3", event.candidate);
    }
  };
});

socket.on("candidate", (id, candidate) => {
  console.log("4", candidate);
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

socket.on("connect", () => {
  console.log("5");
  socket.emit("watcher");
});

socket.on("broadcaster", () => {
  console.log("6");
  socket.emit("watcher");
});

const playVideo = () => {
    videoRight.play();
};

let isMicMuted = false; // 마이크 음소거 플래그 추가

// 마이크 음소거 토글 함수 정의
function toggleMicrophone() {
    let stream = videoLeft.srcObject;

    if (stream) {
        const audioTracks = stream.getAudioTracks();
        
        if (audioTracks.length > 0) {
            const audioTrack = audioTracks[0];

            // 오디오 트랙 음소거 토글
            audioTrack.enabled = !audioTrack.enabled;
            isMicMuted = !audioTrack.enabled;

            // 버튼 아이콘 변경
            const bt1 = document.getElementById('bt1');
            bt1.textContent = isMicMuted ? 'mic_off' : 'mic';
        }
    }
}

let isCameraOff = false; // 카메라 상태 플래그 추가

// 카메라 토글 함수 정의
function toggleCamera() {
    let stream = videoLeft.srcObject;
    stream.getVideoTracks().forEach(track => {
        // 비디오 트랙 활성화/비활성화 토글
        track.enabled = !isCameraOff;
        isCameraOff = !isCameraOff;

        // 버튼 아이콘 변경
        const bt2 = document.getElementById('bt2');
        bt2.textContent = isCameraOff ? 'video_camera_front' : 'video_camera_front_off';
    });
}

const endCounseling = () => {
  window.history.back();
  // window.location.href = "../../esc23-marigold/remote-consultation/remote-cons.html";
};