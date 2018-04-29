
Template.commTablet.helpers ({



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
          return machineCommTable.findOne({_id: machineNr}).machineId;
      }

    },

    supplyStart: () => {
        const supply = Session.get('selectedArea');
        if(supply) {
            return supplyAreaList.findOne({_id: supply}).supplyArea;
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

    'click .pickedMachine':function(e)  {
        e.preventDefault();
        const pickedMachineId = this._id;
        Session.set('selectedMachine', pickedMachineId);
    },

    'click .supplyAreaList':function(e)  {
        e.preventDefault();
        const pickedSupplyArea = this._id;
        Session.set('selectedArea', pickedSupplyArea);
    },


    'click .loadSupply': (e) => {
        e.preventDefault();
        const supplyMachine = Session.get('selectedMachine');
        console.log(supplyMachine);

    },

    'click .tabletStart': (e) => {
        e.preventDefault();
        let commMachine = Session.get('commMachine');
        let commArea = Session.get('commArea');
        //   Meteor.call('commissionStart', commMachine, commArea);
    }




});