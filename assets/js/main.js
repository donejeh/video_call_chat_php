'use strict';

let callBtn = $('#callBtn');// document.querySelector('#call-btn');

let pc;
let sendTo = callBtn.data('user')

//video elements
const localVideo = document.querySelector('#local-video');
const remoteVideo = document.querySelector('#remote-video');

//media constraints
const mediaConstraints = {
    video: true,
}

function getConnect() {
    if (!pc) {
        pc = new RTCPeerConnection();
    }
}

//ask for media input
async function getCam() {
    let mediaStream;
    try {

        if (!pc) {
            await getConnect();
        }

        mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        localVideo.srcObject = mediaStream;
        localStream = mediaStream;
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    } catch (error) {
        console.log(error)
    }
}

$("#callBtn").on('click', function () {
    getCam();
});

conn.onopen = e => {
    console.log("Connection established!");
}

conn.onmessage = e => {
    console.log(e.data);
}

function send(type, data, sendTo) {
    conn.send(JSON.stringify({ 
        type:type, 
        data:data,
        sendTo:sendTo
     }));
}

//send('is-client-is-ready',null, sendTo)

conn.onclose = e => {
    console.log("Connection closed!");
}