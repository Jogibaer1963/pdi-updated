Meteor.subscribe("overView");

Session.set('toggleShipList', 0);

    Template.inputMachine.helpers({

        editMachine: function() {
            const selectedMachine = Session.get('selectedMachine');
            return MachineReady.findOne({_id: selectedMachine});
        },

        shippList: function () {
            // Order of shipping date
            let shipToggleList = Session.get('toggleShipList');
            switch(shipToggleList) {
                case 1:
                    return MachineReady.find({shipStatus: 0},
                                              {sort: {date: -1}}
                                              );
                case 0:
                    let changeDate = new Date("2020-09-31").getTime() / 1000
                   return MachineReady.find({$and: [{unixShipDate : {$gt: changeDate}}, {shipStatus: 1}]},
                        {sort: {date: -1}}).fetch();
            }
        },
/*
        returnList: function () {
             return MachineReady.find({machineReturn: "Yes"}, {sort: {date: -1}});
        },

 */

        'selected': function() {
            const shippingMachine = this._id;
            const selectedMachine = Session.get('selectedMachine');
            if (shippingMachine === selectedMachine) {
                let result = MachineReady.findOne({_id: selectedMachine}).machineId;
                Session.set('myMachine', result);
                return "selected"
            }
        },

        myMachine: () => {
            return Session.get('myMachine');
        }

    });

    Template.inputMachine.events({
        "submit .inputNewMachine": function(e) {
            e.preventDefault();
            const createUnixTime = ((Date.now())/1000).toFixed(0);
           // console.log(createUnixTime);
            const startDate = moment.tz(createUnixTime, "America/Chicago").format().slice(0, 19);
            const createDate = startDate.slice(0,10);
            const createTime = startDate.slice(-8);
            const newMachineInput = e.target.newMachine.value;
            const newShippingDate = e.target.newDate.value;
            const newShippingDestination = e.target.newDestination.value;
            const newShippingTransporter = e.target.newTransporter.value;
            const newShippingKit= [];
            $('input[name = newKit]:checked').each(function() {
                newShippingKit.push($(this).val());
            });
            const newShippingTireTrack = e.target.newTireTrack.value;
            const newShippingReturns = e.target.newReturn.value;
            const newShippingComment = e.target.newComment.value;
            Meteor.call('addToShipList', newMachineInput, newShippingDate,
                createUnixTime, createDate, createTime, newShippingDestination,
                newShippingTransporter, newShippingKit, newShippingTireTrack,
                newShippingReturns, newShippingComment );
            e.target.newMachine.value="";
            e.target.newDate.value="";
            e.target.newDestination.value="";
            e.target.newTransporter.value="";
            document.getElementById('noKit').checked= false;
            document.getElementById('newKit1').checked= false;
            document.getElementById('newKit2').checked= false;
            document.getElementById('newKit3').checked= false;
            document.getElementById('newKit4').checked= false;
            document.getElementById('newKit5').checked= false;
            document.getElementById('newKit6').checked= false;
            document.getElementById('newKit7').checked= false;
            document.getElementById('newKit8').checked= false;
            document.getElementById('newKit9').checked= false;
            document.getElementById('newKit10').checked= false;
            document.getElementById('newKit11').checked= false;
            document.getElementById('newKit12').checked= false;
            e.target.newTireTrack.value="";
            e.target.newReturn.value = "";
            e.target.newComment.value="";
        },

        'submit .find_Machine': function(e) {
            e.preventDefault();
            const selectedMachine = e.target.inputSearch.value;
            const idFinder = MachineReady.find({machineId: selectedMachine}, {fields: {_id: 1}}).fetch();
            const idString = JSON.stringify(idFinder);
            const idExtract = idString.slice(9, 26);
            if(typeof idExtract === 'string' ) {
                Session.set('editSelectedMachine', idExtract);
                FlowRouter.go('editMachine');
            }
        },

        'click .deleteMachine': (e) => {
            e.preventDefault();
            const deleteMachine = Session.get('selectedMachine');
            Meteor.call('removeFromShipList', deleteMachine);
        },

        'click .shippingMachine': function () {
            const newMachine = this._id;
            Session.set('selectedMachine', newMachine);
        },
/*
        'click .changeUnixTime': (e) => {
            e.preventDefault();
            Meteor.call('changeUnixTime');
        },

 */

        'submit .truckDate': function(e) {
            e.preventDefault();
            const confirmedShipDate = e.target.inputDate.value;
            const truckStatus = 1;
            const machineId = Session.get('selectedMachine');
            Meteor.call('truckOrdered', machineId, truckStatus, confirmedShipDate);
        },

        'click .removeTruck': function(e) {
            e.preventDefault();
            const truckStatus = 0;
            const machineId = Session.get('selectedMachine');
            Meteor.call('truckRemoved', machineId, truckStatus);
        },

        'click .toggleShippedAll': (e) => {
            e.preventDefault();
            let choice = Session.get('toggleShipList');
            if(choice === 0) {
                Session.set('toggleShipList', 1)
            } else {
                Session.set('toggleShipList', 0);
            }
        }


    });



