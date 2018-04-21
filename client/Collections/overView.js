
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
        }
    });
    






