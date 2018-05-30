
    Meteor.subscribe("MachineReady");

    Session.set('selectedPdiMachine', '');
    Session.set('pdiMachineNumber', '');
    Session.set('selectedErrorId', '');
    Session.set('selectedNewErrorId', '');
    Session.set('findMachine', '');
    Session.set('selectedMainOm', '');
    Session.set('selectedSuppOm', '');
    Session.set('selectedUnloadOm', '');
    Session.set('selectedCemosOm', '');
    Session.set('selectedTeraTrackOm', '');
    Session.set('selectedProfiCam', '');
    Session.set('selectedProfiId', '');

    Template.overView.helpers({

       machineOverView: function() {
          return MachineReady.find({machineId: {$gt: 'C00000'}, $or: [{shipStatus: 0},
               {shipStatus: 2}]}, {sort: {date: -1}});
        },

        headerOverView: function() {
            return MachineReady.find( {newHeadId: {$gt:'00'}, $or: [{shipStatus: 0},
              {shipStatus: 2}]}, {sort: {date: 1}});
        },

        countPdi: function() {
            return MachineReady.find({$or:[{pdiStatus: 0},{pdiStatus: 2}]}, {sort: {date: 1}}).count();
        },

        countRepair: function() {
            return MachineReady.find({$and:[{repairStatus: 0},{pdiStatus: 1}]}).count();
        },

        countWash: function() {
            return MachineReady.find({$or:[{washStatus: 0},{washStatus: 2}]}, {sort: {date: 1}}).count();
        },

        countShip: function() {
          return  MachineReady.find({$and: [{pdiStatus:1}, {washStatus:1}, {repairStatus:1}, {shipStatus:0}]}).count();
        }
    });
    






