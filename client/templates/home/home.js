Template.Home.onCreated(function () {
    Meteor.subscribe("users");
   // Meteor.subscribe("presences");
});