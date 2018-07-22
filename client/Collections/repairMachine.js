

if(Meteor.isClient) {

    Template.repairMachine.helpers({





        shippList: function () {
            // Order of shipping date
            let k = Session.get('toggleRepair');
            if (k === 0) {
                return MachineReady.find({
                    $and: [
                        {pdiStatus: 1},
                        {$or: [{repairStatus: 0}, {repairStatus: 2}]}
                    ]
                }, {sort: {date: 1}});
            } else {
                return MachineReady.find({$and: [{pdiStatus: 0},
                            {$or: [{shipStatus: 0}, {shipStatus: 2}]}]},
                    {sort: {date: 1}});
            }
        },

        'selectedClass2': function () {
            const selectedRepair = this._id;
            const selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId === selectedRepair) {
                return "selected"
            }
        },
   /*
        upcomingList: function () {
            return MachineReady.find({$and: [{pdiStatus: 0},
                    {$or: [{shipStatus: 0}, {shipStatus: 2}]}]},
                    {sort: {date: 1}});
        },
*/
        'selectedClass': function () {
            const upcomingMachineId = this._id;
            const selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId === upcomingMachineId) {
                return "selected"
            }
        },

        washMachine: () => {
            const machine_id = Session.get('selectedMachineId');
            const machineTestId = MachineReady.findOne({_id: machine_id}).machineId;
            Session.set('washMachine', machineTestId);
            return Session.get('washMachine');
        },

    });

    Template.repairMachine.events({

        'click .openInspections': function () {
            const openRepair = this._id;
            Session.set('selectedMachineId', openRepair);

        },

        'submit .repairFinnish': function (event) {
            event.preventDefault();
            const machineRepaired = Session.get('selectedMachineId');
            const workingHour = event.target.workingHours.value;
            Meteor.call('machineRep', machineRepaired, workingHour);
        },


        'click .toggleRepairUpcoming': function () {
            event.preventDefault();
            let choice = Session.get('toggleRepair');
            if(choice === 0) {
                Session.set('toggleRepair', 1)
            } else {
                Session.set('toggleRepair', 0);
            }



        },

        'click .addToList': function () {
            event.preventDefault();
            const KitStatus = 1;
            const machineId = Session.get('selectedMachineId');
            Meteor.call('listPrinted', machineId, KitStatus);
            Session.set('selectedMachineId', '');
        },

        'click .removeFromList': function () {
            event.preventDefault();
            const KitStatus = 0;
            const machineId = Session.get('selectedMachineId');
            Meteor.call('listRemoved', machineId, KitStatus);
        },

        'submit .messageToWashBay': function () {
            event.preventDefault();
            const washMessage = event.target.message.value;
            if(Session.get('selectedMachineId') === 'undefined') {
                console.log('test');
                Session.set('errorMachine', 'Choose Machine first');
            } else {
                const machine_id = Session.get('selectedMachineId');
                const machineTestId = MachineReady.findOne({_id: machine_id}).machineId;
                Meteor.call('messageToWashBay', machine_id, machineTestId, washMessage);
            }
            event.target.message.value = '';
        }


    });

}
