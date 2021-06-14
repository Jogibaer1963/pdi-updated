
Template.login.helpers({

    loading: () => {
        return Session.get('loading');
    }

})

    Template.login.events({

        'submit form': function (event) {
            event.preventDefault();
              const userVar = event.target.loginUser.value;
              const passwordVar = event.target.loginPassword.value;
              const dateLogin = moment().format('MM Do YYYY, h:mm:ss a');
            Session.set('loading', 'Loading.......')
            Meteor.loginWithPassword(userVar, passwordVar, function(){
               if(Meteor.userId()){
                   Meteor.call('successLogin', userVar, dateLogin);
                   Session.set('loading', '')
                   FlowRouter.go('/');
               } else {
                  Bert.alert('User or Password wrong', 'danger', 'growl-top-left');
                   }
            });
        }
    });


    Template.topNav.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
            FlowRouter.go('/login');
        }
    });
