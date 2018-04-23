Meteor.subscribe('supplyAreaList');
Meteor.subscribe('machineCommTable');

Template.commissionAdmin.helpers ({

    supplyAreaList: function () {
        return supplyAreaList.find();
    },

    machineCommList: function () {
        return machineCommTable.find();
    },

    'selected': function(){
        const supplyArea = this._id;
        const selectedArea = Session.get('selectedArea');
        if (selectedArea === supplyArea) {
            return "selected"
        }
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

   'submit .newSupplyArea': (e) => {
       e.preventDefault();
       const newSupplyArea = e.target.supplyArea.value;
       Meteor.call('supplyArea', newSupplyArea);
       e.target.supplyArea.value = '';
   },

    'click .removeSupplyArea': function (e) {
        e.preventDefault();
        const removableSupply = Session.get('selectedArea');
        Meteor.call('removeSupply', removableSupply);
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