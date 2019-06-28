    Meteor.subscribe("overView");

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
//-----------------------------  Over View counter --------------------------------------------------------
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
        },

//------------------------------  Machine Table -----------------------------------------------------------

       machineOverView: function() {
        return MachineReady.find({$or: [{shipStatus: 0}]}, {sort: {date: -1}});
        },

//------------------------------- Header Table --------------------------------------------------------------

        headerOverView: function() {
            return newHeadYear.find( {newHeadId: {$gt:'00'}, $or: [{shipStatus: 0},
              {shipStatus: 2}]}, {sort: {date: 1}});
        },

//-------------------------------- Pre Series Table and Counter  --------------------------------------------

        preOverViewCheckList: () => {
                   Meteor.call('preSeriesOverView', (error, result) => {
                       if (error) {
                       } else {
                           Session.set('preOverView', result);
                       }
                   });
                   setInterval(() => {
                   Meteor.call('preSeriesOverView', (error, result) => {
                       if (error) {
                       } else {
                           Session.set('preOverView', result);
                       }
                   });
                   }, 60000);
            return Session.get('preOverView');
        }


    });







