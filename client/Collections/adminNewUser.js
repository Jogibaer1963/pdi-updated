Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});



Template.adminNewUser.events({
    'submit .adminRegisterNewUser': function (event) {
        event.preventDefault();
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
            roleConst = 'outBound'
        } else if (role === 'Loading') {
            roleConst = 'outBound'
        }
        event.target.registerUser.value = '';
        event.target.registerPassword.value = '';
        const createdAt =  new Date().toISOString();
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