if (Meteor.isClient) {

    Template.inputMachine.events({
        "submit .inputNewMachine": function(event) {
            event.preventDefault();
            const createUnixTime = Date.now();
            const startDate = moment.tz(createUnixTime, "America/Chicago").format().slice(0, 19);
            const createDate = startDate.slice(0,10);
            const createTime = startDate.slice(-8);
            const newMachineInput = event.target.newMachine.value;
            const newShippingDate = event.target.newDate.value;
            const newShippingDestination = event.target.newDestination.value;
            const newShippingTransporter = event.target.newTransporter.value;
            const newShippingKit= [];
            $('input[name=newKit]:checked').each(function() {
                newShippingKit.push($(this).val());
            });
            const newShippingTireTrack = event.target.newTireTrack.value;
            const newShippingComment = event.target.newComment.value;
            Meteor.call('addToShipList', newMachineInput, newShippingDate,
                createUnixTime, createDate, createTime, newShippingDestination,
                newShippingTransporter, newShippingKit, newShippingTireTrack, newShippingComment );
            event.target.newMachine.value="";
            event.target.newDate.value="";
            event.target.newDestination.value="";
            event.target.newTransporter.value="";
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
            event.target.newTireTrack.value="";
            event.target.newComment.value="";
        },

        'submit .find_Machine': function() {
            event.preventDefault();
            const selectedMachine = event.target.inputSearch.value;
            const idFinder = MachineReady.find({machineId: selectedMachine}, {fields: {_id: 1}}).fetch();
            const idString = JSON.stringify(idFinder);
            const idExtract = idString.slice(9, 26);
            if(typeof idExtract === 'string' ) {
                Session.set('editSelectedMachine', idExtract);
                FlowRouter.go('editMachine');
            }
        },

        'click .deleteMachine': () => {
            event.preventDefault();
            const deleteMachine = Session.get('selectedMachine');
            Meteor.call('removeFromShipList', deleteMachine);
        },

        'click .shippingMachine': function () {
            const newMachine = this._id;
            Session.set('selectedMachine', newMachine);
        },

        'submit .truckDate': function() {
            event.preventDefault();
            const confirmedShipDate = event.target.inputDate.value;
            const truckStatus = 1;
            const machineId = Session.get('selectedMachine');
            Meteor.call('truckOrdered', machineId, truckStatus, confirmedShipDate);
        },

        'click .removeTruck': function() {
            event.preventDefault();
            const truckStatus = 0;
            const machineId = Session.get('selectedMachine');
            Meteor.call('truckRemoved', machineId, truckStatus);
        }


    });

    Template.inputMachine.helpers({

        editMachine: function() {
            const selectedMachine = Session.get('selectedMachine');
           return MachineReady.findOne({_id: selectedMachine});
        },

        shippList: function () {
            // Order of shipping date
            return MachineReady.find({machineId: {$gt:'C0000000'}},
                {sort: {date: -1}});
        },

        'selected': function() {
            const shippingMachine = this._id;
            const selectedMachine = Session.get('selectedMachine');
            if (shippingMachine === selectedMachine) {
                return "selected"
            }
        }

    });

}

