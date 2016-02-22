Template.Chat.helpers({
    users: function () {
        //var userIds = Presences.find().map(function(presence) {return presence.userId;});
        // exclude the currentUser
        return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    }
})
Template.Chat.onCreated(function () {
    // Create a Peer instance
    window.peer = new Peer({
        key: 'pau7an6aeaxj38fr',  // get a free key at http://peerjs.com/peerserver
        debug: 3,
        config: {'iceServers': [
            { url: 'stun:stun.l.google.com:19302' },
            { url: 'stun:stun1.l.google.com:19302' },
        ]}
    });

    // Handle event: upon opening our connection to the PeerJS server
    peer.on('open', function () {
        $('#myPeerId').text(peer.id);
        console.log('user update')
        Meteor.users.update({_id: Meteor.userId()}, {
            $set: {
                profile: { peerId: peer.id}
            }
        });
    });

    // Handle event: remote peer receives a call
    peer.on('call', function (incomingCall) {
        window.currentCall = incomingCall;
        incomingCall.answer(window.localStream);
        incomingCall.on('stream', function (remoteStream) {
            window.remoteStream = remoteStream;
            var video = document.getElementById("theirVideo")
            video.src = URL.createObjectURL(remoteStream);
        });
    });

    navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia );

    // get audio/video
    navigator.getUserMedia({audio:true, video: true}, function (stream) {
            //display video
            var video = document.getElementById("myVideo");
            video.src = URL.createObjectURL(stream);
            window.localStream = stream;
        },
        function (error) { console.log(error); }
    );
});

Template.Chat.events({
    "submit form": function () {
        maceCall($('#remotePeerId').val())
    },
    'click [data-action="make-call"]': function (e,tmp) {
        var user = this;
        maceCall(user.profile.peerId);
    },
    'click [data-action="end-call"]': function () {
        window.currentCall.close();
    }
});

function maceCall(id){
    var outgoingCall = peer.call(id, window.localStream);
    window.currentCall = outgoingCall;
    outgoingCall.on('stream', function (remoteStream) {
        window.remoteStream = remoteStream;
        var video = document.getElementById("theirVideo")
        video.src = URL.createObjectURL(remoteStream);
    });
}