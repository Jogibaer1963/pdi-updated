


    Template.login.events({
        'submit form': function (event) {
            event.preventDefault();
              const userVar = event.target.loginUser.value;
              const passwordVar = event.target.loginPassword.value;
              const dateLogin = new Date();
              Session.set('loginId', userVar);

            Meteor.loginWithPassword(userVar, passwordVar, function(){
               if(Meteor.userId()){
                   Meteor.call('successfullLogin', userVar, dateLogin);
                   FlowRouter.go('/');
               } else {
                  Bert.alert('User or Password wrong', 'danger', 'growl-top-left');
                  Meteor.call('unsuccessLogin', userVar, passwordVar, dateLogin);
                   }
            });
        }
    });


    Template.MainLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
        }
    });


    Template.repairLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
        }
    });

    Template.shippingLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
        }
    });

    Template.pdiLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
        }
    });

    Template.washLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
        }
    });

    Template.outBound.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
        }
    });
    Template.MainLayout_3.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
        }
    });

    Template.MainLayout_mary.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
        }
    });

