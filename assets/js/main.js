'use strict';

let callBtn = $('#callBtn');
let declineBtn = $('#declineBtn');
let answerBtn = $('#answerBtn');
let callBox = $('#callBox');

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

//get connection for peer to peer
function getConnect() {
    if (!pc) {
        pc = new RTCPeerConnection();
    }
}

// create answer for client to pick up the call
async function createAnswer(sendTo, data) {
    if (!pc) {
         getConnect();
    }
    if (!localStream) {
        await getCam(); 
    }

     sendIceCandidates(sendTo);
    await pc.setRemoteDescription(data);
    await pc.createAnswer()
    await  pc.setLocalDescription(pc.localDescription);
    send('client-answer', pc.localDescription, sendTo);
   
}

//ask for media input
async function getCam() {
    let mediaStream;
    try {

        if (!pc) {
             getConnect();
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
     sendIceCandidates(sendTo);
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
    pc.ontrack = e => {
        $('#videoBox').removeClass('hidden');
        $('#profile').addClass('hidden');
        remoteVideo.srcObject = e.streams[0];
    }
}

function hangUp() {
    send('client-hangup', null, sendTo);
    pc.close();
    pc = null;
}


$("#callBtn").on('click', function () {
    getCam();
    send('is-client-ready', null, sendTo);
});

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
        case 'client-candidate':
            if (pc.localDescription) {
                await pc.addIceCandidate(new RTCIceCandidate(data));
            }
        break
        case 'is-client-ready':
            if (!pc) {
                 getConnect();
            }
            if (pc.iceConnectionState == 'connected') {
                send('client-already-oncall');
            } else {
                //display pop
                displayCall();

                answerBtn.on('click', async function () {

                    callBox.addClass('hidden');
                    $('.wrapper').removeClass('glass');
                    send('client-is-ready', null, sendTo);
                });

                //when user click on rejected button
                declineBtn.on('click', function () {
                    send('client-rejected', null, sendTo);
                    callBox.addClass('hidden');
                    $('.wrapper').removeClass('glass');
                    location.reload(true);
                });
            }
            break;
        case 'client-answer':
            if (pc.localDescription) {          
                await pc.setRemoteDescription(data);
                $('#callTimer').timer({format: '%m:%s'});
               
            }
        break;

        case 'client-offer':
            createAnswer(sendTo, data);
            $('#callTimer').timer({format: '%m:%s'});
            break;
        case 'client-is-ready':
            createOffer(sendTo);
            break;
        case 'client-already-oncall':
            //display popup that user is already on call
            setTimeout('location.reload(true);', 3000);
            break;

        case 'client-rejected':
            //display popup that user rejrcted the call
            alert('User rejected the call');
            break;

        case 'client-hangup':
            //display popup that user is already on call
            alert('User hangup the call');
            setTimeout('location.reload(true);', 2000);
            break;
    }
    console.log(e.data);
}

function send(type, data, sendTo) {
    conn.send(JSON.stringify({
        type: type,
        data: data,
        sendTo: sendTo
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

