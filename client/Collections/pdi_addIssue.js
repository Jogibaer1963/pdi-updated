

Session.set('issuePdiMachine', '');

Template.addingIssue.helpers({

    pdiMachine:() => {
        let machineIssue = Session.get('issuePdiMachine');
        return MachineReady.find({machineId: machineIssue}).fetch();
    },

    'selectedClass': function(){
        const pdiIssue = this._id;
        const selectedPdiIssue = Session.get('selectedPdiIssue');
        if (selectedPdiIssue === pdiIssue) {
            return "selected"
        }
    }

});




Template.addingIssue.events({

    'click .newIssue': function() {
        const pdiIssue = this._id;
        Session.set('selectedPdiIssue', pdiIssue);
        console.log(pdiIssue);
    },

    'submit .pdiMachine': () => {
        event.preventDefault();
        let machine = event.target.machineId.value;
        Session.set('issuePdiMachine', machine);
    },

    'submit .inputNewIssue': () => {
        event.preventDefault();
        let newIssue = event.target.newIssue.value;
        let machineId = Session.get('issuePdiMachine');
        Meteor.call('newPdiIssue', machineId, newIssue);
        event.target.newIssue.value = '';
    },

    'click .removeIssue': () => {
        event.preventDefault();
        let machineId = Session.get('issuePdiMachine');
        let pdiIssue = Session.get('selectedPdiIssue');
        Meteor.call('removePdiIssue', machineId, pdiIssue);
    }



});