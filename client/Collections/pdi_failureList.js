if (Meteor.isClient) {

    Template.input_new_failure.events({

           "submit .inputNewFailure": function(event) {
            event.preventDefault();
            var newErrorId = event.target.failureId.value;
            var newErrorDescrib = event.target.error_describe.value;
               Meteor.call('insertFailureId', newErrorId, newErrorDescrib);
            // Leeren des Eingabefeldes
            event.target.failureId.value = '';
            event.target.error_describe.value = '';
           }
    });




    Template.show_failure_List.helpers({
        failureList: function() {
            return FailuresList.find({}, {sort: {error_describ: 1}});
        },

        'selectedClass': function() {
            var failureList = this._id;
            var selectedFailurePoint = Session.get('selectedFailurePoint');
            if (selectedFailurePoint == failureList) {
                return "selected"
            }
        }
    });
    Template.show_failure_List.events({
        'click .showFailureList': function() {
            var FailureId = this._id;
            Session.set('selectedFailurePoint', FailureId);
        },

        'click .buttonPositionId4': function() {
            var selectedFailurePoint = Session.get('selectedFailurePoint');
            Meteor.call('removeFailureId', selectedFailurePoint);
        }
    });









}

