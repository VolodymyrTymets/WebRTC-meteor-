Meteor.publish('presences', function() {
    return Presences.find({});
});
Meteor.publish("users", function () {
    return Meteor.users.find({}, {fields: {"profile.peerId": true, "emails.address": true} });
});