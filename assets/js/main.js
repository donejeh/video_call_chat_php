'use strict';

let callBtn = $('#callBtn');
let declineBtn = $('#declineBtn');
let answerBtn = $('#answerBtn');
let callBox  = $('#callBox');

let pc;
let sendTo = callBtn.data('user');
let localStream;

//video elements
const localVideo = document.querySelector('#localVideo');
const remoteVideo = document.querySelector('#remoteVideo');

//media constraints
const mediaConstraints = {
    video: true,
}

// what need to get from other user
const offerOptions = {
    offerToReceiveAudio: 1,
    //offerToReceiveVideo: 1
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

//create offer
async function createOffer(sendTo) {
    await sendIceCandidates(sendTo);
    pc.createOffer(offerOptions);
    pc.setLocalDescription(pc.localDescription);
    send('client-offer', pc.localDescription, sendTo);

    // await pc.createOffer(offerOptions).then(offer => {
    //     pc.setLocalDescription(offer);
    //     send('client-offer', offer, sendTo);
    // }).catch(error => {
    //     console.log(error);
    // });

    
}
function sendIceCandidates(sendTo) {
    pc.onicecandidate = e => {
        if (e.candidate !== null) {
            //send ice candidate to other peer
            send('client-candidate', e.candidate, sendTo);
        }
    }
}
$("#callBtn").on('click', function () {
    getCam();
    send('is-client-ready', null, sendTo);
});

conn.onopen = e => {
    console.log("Connection established!");
}

conn.onmessage = async e => {
    let message = JSON.parse(e.data);
    let by = message.by;
    let data = message.data;
    let type = message.type;
    let profileImage = message.profileImage;
    let username = message.username;

    $("#username").text(username);
    $("#profileImage").attr('src', profileImage);

    switch (type) {
        case 'is-client-ready':
            if(!pc){
               await getConnect();
            }
            if(pc.iceConnectionState == 'connected'){
                send('client-already-oncall');
            }else{
                //display pop
                displayCall();

                declineBtn.on('click', function () {
                    send('client-rejected', null, sendTo);
                    callBox.addClass('hidden');
                    $('.wrapper').removeClass('glass');
                    location.reload(true);
                });
            }
        break;
        case 'client-already-oncall':
            //display popup that user is already on call
            setTimeout('location.reload(true);', 3000);
        break;

        case 'client-rejected':
            //display popup that user rejrcted the call
            alert('User rejected the call');
        break;
    }
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

//this function will display the call box
function displayCall() {
    callBox.removeClass('hidden');
    $('.wrapper').addClass('glass');
}