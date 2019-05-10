


    Template.login.events({
        'submit form': function (event) {
            event.preventDefault();
              const userVar = event.target.loginUser.value;
              const passwordVar = event.target.loginPassword.value;
              const dateLogin = moment().format('MM Do YYYY, h:mm:ss a');
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


    Template.topNav.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
            FlowRouter.go('/login');
        }
    });
