

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
    },

    'submit .pdiMachine': (e) => {
        e.preventDefault();
        let machine = e.target.machineId.value;
        Session.set('issuePdiMachine', machine);
        e.target.machineId.value = '';
    },

    'submit .inputNewIssue': (e) => {
        e.preventDefault();
        let newIssue = e.target.newIssue.value;
        let machineId = Session.get('issuePdiMachine');
        Meteor.call('newPdiIssue', machineId, newIssue);
        e.target.newIssue.value = '';
    },

    'click .removeIssue': (e) => {
        e.preventDefault();
        let machineId = Session.get('issuePdiMachine');
        let pdiIssue = Session.get('selectedPdiIssue');
        Meteor.call('removePdiIssue', machineId, pdiIssue);
    }



});