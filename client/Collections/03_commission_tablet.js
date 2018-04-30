
Template.commTablet.helpers ({


    userLoggedIn: () => {

    },

    machineCommList: function () {
        return machineCommTable.find();
    },

    supplyAreaList: function() {
        const commMachine = Session.get('selectedMachine');
        return machineCommTable.findOne({_id: commMachine});
    },

    selectedSupplyMachine: () => {
      const machineNr = Session.get('commMachine');
      if(machineNr) {
          let pickedMachine = machineCommTable.findOne({_id: machineNr}).machineId;
          Session.set('pickedMachine', pickedMachine);
          return pickedMachine;
      }
    },

    supplyStart: () => {
        const supply = Session.get('selectedArea');
        if(supply) {
            let pickedArea = supplyAreaList.findOne({_id: supply}).supplyArea;
            Session.set('pickedArea', pickedArea);
            return pickedArea;
        }
    },

    'selectedMachine': function(){
        const commMachine = this._id;
        const selectedMachine = Session.get('selectedMachine');
        if (selectedMachine === commMachine) {
            Session.set('commMachine', selectedMachine);
            return "selectedMachine";
        }
    },

    'selectedArea': function(){
        const selectedSupplyArea = this._id;
        const selectedArea = Session.get('selectedArea');
        if (selectedArea === selectedSupplyArea) {
            return "selectedArea";
        }
    }

});

Template.commTablet.events ({

    'click .pickedMachine': function(e)  {
        e.preventDefault();
        const pickedMachineId = this._id;
        Session.set('selectedMachine', pickedMachineId);
    },

    'click .supplyAreaList': function(e) {
        e.preventDefault();
        const pickedSupplyArea = this._id;
        Session.set('selectedArea', pickedSupplyArea);
    },


    'click .commStart': function(e) {
        e.preventDefault();
        const userStart = Meteor.user().username;
        let status = 2;
        let pickedMachineId = Session.get('selectedMachine');
        let pickedSupplyAreaId = Session.get('selectedArea');
        Meteor.call('startPicking', pickedMachineId, pickedSupplyAreaId, status, userStart);

    },

    'click .commFinished': function(e) {
        e.preventDefault();
        const userFinished = Meteor.user().username;
        let status = 1;
        let pickedMachineId = Session.get('selectedMachine');
        let pickedSupplyAreaId = Session.get('selectedArea');
        Meteor.call('finishedPicking', pickedMachineId, pickedSupplyAreaId, status, userFinished);

    },

    'click .commCanceled': function(e) {
        e.preventDefault();
        const userCanceled = Meteor.user().username;
        let status = 0;
        let pickedMachineId = Session.get('selectedMachine');
        let pickedSupplyAreaId = Session.get('selectedArea');
        Meteor.call('canceledPicking', pickedMachineId, pickedSupplyAreaId, status, userCanceled);

    }

});