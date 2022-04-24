    Meteor.subscribe("overView");
    Meteor.subscribe("preOverView");

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
        let choice = Session.get('toggleSort');
        return MachineReady.find({$or: [{shipStatus: 0}]}, {sort: {date: choice}}).fetch();
        },

//------------------------------- Header Table --------------------------------------------------------------

        headerOverView: function() {
            return newHeadYear.find( {newHeadId: {$gt:'00'}, $or: [{shipStatus: 0},
              {shipStatus: 2}]}, {sort: {date: 1}});
        },

    });

    Session.set('toggleSort', -1)

    Template.overView.events({

        'click .sortButton': function (e) {
            e.preventDefault();
            let choice = Session.get('toggleSort');
            if(choice === -1) {
                Session.set('toggleSort', 1)
            } else {
                Session.set('toggleSort', -1);
            }
        },

        'submit .pdiReleaseButton': function(e) {
            e.preventDefault();
            let machineNr = e.target.machineNr.value;
            Meteor.call('pdiBlocker', machineNr, 0)
            e.target.machineNr.value = ""
        },

        'submit .pdiBlockButton': function(e) {
            e.preventDefault();
            let machineNr = e.target.machineNr.value;
            Meteor.call('pdiBlocker', machineNr, 1)
            e.target.machineNr.value = ""
        },


    });







