
Template.commission.helpers ({

    supplyAreaList: function () {
        return supplyAreaList.find();
    },

    machineCommList: function () {
        return machineCommTable.find();
    },

    'selectedMachine': function(){
        const commMachine = this._id;
        const selectedMachine = Session.get('selectedMachine');
        console.log(selectedMachine);
        if (selectedMachine === commMachine) {
            return "selectedMachine";
        }
    },

    'selectedArea': function(){
        const supplyArea = this._id;
        const selectedArea = Session.get('selectedArea');
        if (selectedArea === supplyArea) {
            return "selectedArea";
        }
    }

});

Template.commission.events ({

    'click .pickedMachine': (e) => {
        e.preventDefault();
        const pickedMachineId = this._id;
        console.log(pickedMachineId);
        Session.set('selectedMachine', pickedMachineId);
    },

    'click .supplyAreaList': (e) => {
        e.preventDefault();
        const pickedSupplyArea = this._id;
        console.log(pickedSupplyArea);
        Session.set('selectedArea', pickedSupplyArea);
    },

    'click .tabletStart': (e) => {
        e.preventDefault();
        let commMachine = Session.get('commMachine');
        let commArea = Session.get('commArea');
     //   Meteor.call('commissionStart', commMachine, commArea);
        FlowRouter.go('tabletStart');








    }


});