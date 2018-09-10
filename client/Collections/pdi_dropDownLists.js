Meteor.subscribe("mainComponents");



Template.dropDownIssue.helpers({


    mainComponent: function () {
        return mainComponents.find({}).fetch();
    },

    subComp: function () {
        let id = Session.get('selectedComp');
        Meteor.call('subComponent', id, (error, result) => {
            if(error) {
                console.log('error',error);
            } else {
                Session.set('componentResult', result);
            }
        });
        return Session.get('componentResult');
    },



    'selectedClass': function() {
        let singleComp = this._id;
        let textComp = JSON.stringify(singleComp);
        let selectedComp = Session.get('selectedComp');
        let textCompare = JSON.stringify(selectedComp);
        if (textComp === textCompare) {
            return "selected";
        } else {
        }
    }

});

Session.set('selectedComp', '');

Template.dropDownIssue.events({


    'submit .addNewDropDownItem': function () {
        event.preventDefault();
        let newComponent = event.target.component.value;
        Meteor.call('addNewComponent', newComponent);
        event.target.component.value = '';
    },

    'submit .addSubComponent': function () {
        event.preventDefault();
        let component_id = Session.get('selectedComp');
        let newSubComponent = event.target.subComponent.value;
        Meteor.call('addSubComponent', component_id, newSubComponent);
        event.target.subComponent.value = '';
    },



    'click .mainComp': function () {
        const component = this._id;
        Session.set('selectedComp', component);
    },



});