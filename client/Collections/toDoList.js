Meteor.subscribe('toDoMessage');

Template.lop.helpers({

    toDoMessage: () => {
        return toDoMessage.find({}, {sort: {toDoStatus: 1}}).fetch();
    },

    'selectedMessage': function(){
        const openToDo = this._id;
        const selectedToDoItem = Session.get('selectedToDoItem');
        if (selectedToDoItem === openToDo) {
            return "selected";
        }
    }


});

Template.lop.events({

    'submit .toDoMessanger': () => {
        event.preventDefault();
        let toDoUser = Meteor.user().username;
        let toDoText = event.target.messageId.value;
        let needDate = event.target.newDate.value;
        let dateNow = moment().format('L');
        Meteor.call('submitToDo', toDoText, dateNow, needDate, toDoUser);
    },

    'click .textMessage': function () {
        const selectedToDo = this._id;
        Session.set('selectedToDoItem', selectedToDo);
    }

});

Template.adminLop.events({

   'click .inProcessToDo': () => {
       event.preventDefault();
       let status = 1;
       inProcessItem = Session.get('selectedToDoItem');
       Meteor.call('setToDo', inProcessItem, status);
   },

    'click .cancelToDo': () => {
        event.preventDefault();
        let status = 0;
        inProcessItem = Session.get('selectedToDoItem');
        Meteor.call('setToDo', inProcessItem, status);
    },

    'click .finishedToDo': () => {
        event.preventDefault();
        let status = 2;
        inProcessItem = Session.get('selectedToDoItem');
        Meteor.call('setToDo', inProcessItem, status);
    },

    'click .reOpenToDo': () => {
        event.preventDefault();
        let status = 0;
        inProcessItem = Session.get('selectedToDoItem');
        Meteor.call('setToDo', inProcessItem, status);
    }



});