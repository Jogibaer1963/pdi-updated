Meteor.subscribe('supplyAreaList');
Meteor.subscribe('machineCommTable');

Template.commissionAdmin.helpers ({

    machineCommList: function () {
        return machineCommTable.find();
    },


    'selectedMachine': function(){
        const commMachine = this._id;
        const selectedMachine = Session.get('selectedMachine');
        if (selectedMachine === commMachine) {
            return "selected"
        }
    }

});



Template.commissionAdmin.events ({

    'click .supplyAreaList': function(e) {
        e.preventDefault();
        const pickedSupplyArea = this._id;
        Session.set('selectedArea', pickedSupplyArea);
    },

    'click .commissionMachine': function(e) {
        e.preventDefault();
        const pickedMachineId = this._id;
        Session.set('selectedMachine', pickedMachineId);
    },

    'submit .newCommMachine': (e) => {
        e.preventDefault();
        const newMachine = e.target.newMachine.value;
        Meteor.call('newCommMachine', newMachine);
        e.target.newMachine.value = '';
    },

    'click .removeMachine': function (e) {
        e.preventDefault();
        const removableMachine = Session.get('selectedMachine');
        Meteor.call('removeCommMachine', removableMachine);
    },


});