Meteor.subscribe("usersProfil");

Template.adminViewUser.helpers({

    userResult: function () {
       return usersProfil.find();
    },

    usersTotal: function () {
        let totalUsers = usersProfil.find().fetch();
        return totalUsers.length;
    }

});


Template.adminViewUser.events({

   "click .adminUserLog": function () {
       event.preventDefault();
        const logOutUser = [];
        const deleteUser = [];
        $('input[name=logOut]:checked').each(function () {
            logOutUser.push($(this).val());
        });
        Meteor.call('userManualLogout', logOutUser);

        $('input[name=deleteMe]:checked').each(function () {
            deleteUser.push($(this).val());
        });
        Meteor.call('userManualDelete', deleteUser);
        document.getElementById('logOut').checked=false;
   },


});

