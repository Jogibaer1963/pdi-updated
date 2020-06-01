Meteor.subscribe("usersProfile");

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

Template.adminViewUser.helpers({

    userResult: function () {
        return usersProfile.find();
    },

    usersTotal: function () {
        let totalUsers = usersProfile.find().fetch();
        return totalUsers.length;
    }
});

Template.adminViewUser.events({
    "click .submitAdmin": function (e) {
        e.preventDefault();
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

    'click .dataRemove': (e) => {
      e.preventDefault();
      Meteor.call('removeMachines');
    },
});

Template.adminNewUser.events({
    'submit .adminRegisterNewUser': function (event) {
        event.preventDefault();
        let roleConst = "";
        const userConst = event.target.registerUser.value;
        const passwordConst = event.target.registerPassword.value;
        const role = event.target.userRole.value;
        if (role === 'Admin') {
           roleConst = 'admin'
        } else if (role === 'Logistics') {
            roleConst = 'shipping'
        } else if (role === 'Quality PDI') {
            roleConst = 'pdi'
        } else if (role === 'Repair Team') {
            roleConst = 'repair'
        } else if (role === 'Wash Bay') {
            roleConst = 'washBay'
        } else if (role === 'Loading') {
            roleConst = 'outBound'
        } else if (role === 'COA') {
            roleConst = 'salesPerson'
        }  else if (role === 'Operation Supervisor') {
            roleConst = 'Ops_admin'
        }   else if (role === 'Team Lead') {
            roleConst = 'teamLead'
        }else if (role === 'Commission') {
            roleConst = 'commission'
        }else if (role === 'Pdi Repair Crew') {
            roleConst = 'pdiRepCrew'
        }
        event.target.registerUser.value = '';
        event.target.registerPassword.value = '';
        const createdAt =  moment().format('MMMM Do YYYY, h:mm:ss a');
        const loggedUser = Meteor.user();
        Meteor.call('newUser', userConst, passwordConst, roleConst, createdAt, loggedUser, function(err) {
            if (err === undefined) {
                const messageSend = 'Attention: User ' + userConst + ' successfull created';
                Session.set('message', messageSend);
            } else {
                let message = 'Attention: ' + userConst + ' ' + err.message;
                Session.set('message', message);
            }
        });
    }
});

Template.adminNewUser.helpers({
    result: function () {
        return Session.get('message');
    }
});


Template.adminFiscalYear.helpers({

    machineLeft: () => {
    return MachineReady.find({machineId: {$gt:'C0000000'}, shipStatus: 0}, {sort: {date: -1}});
    },

    headerLeft: function() {
        return MachineReady.find( {newHeadId: {$gt:'00'}, $or: [{shipStatus: 0},
                {shipStatus: 2}]}, {sort: {date: 1}});
    }

});

Template.adminFiscalYear.events({
    'submit .moveMachine': () => {
        event.preventDefault();
        const newMoveMe = [];
        $('input[name = moveMe]:checked').each(function() {
            newMoveMe.push($(this).val());
        });
    Meteor.call('moveMachines', newMoveMe);
    },

    'submit .moveHead': () => {
        event.preventDefault();
        const newHeadMove = [];
        $('input[name = moveMe]:checked').each(function() {
            newHeadMove.push($(this).val());
        });
        Meteor.call('moveHeads', newHeadMove);
    }

});