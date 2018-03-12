

if(Meteor.isClient) {

    Template.repairMachine.helpers({

        shippList: function () {
            // Order of shipping date
            return MachineReady.find({
                $and: [
                    {pdiStatus: 1},
                    {$or: [{repairStatus: 0}, {repairStatus: 2}]}
                ]
            }, {sort: {date: 1}});
        },

        'selectedClass2': function () {
            const selectedRepair = this._id;
            const selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId === selectedRepair) {
                console.log(selectedMachineId, selectedRepair);
                return "selected"
            }
        },

        upcomingList: function () {
            return MachineReady.find({$and: [{pdiStatus: 0},
                    {$or: [{shipStatus: 0}, {shipStatus: 2}]}]},
                    {sort: {date: 1}});
        },

        'selectedClass': function () {
            const upcomingMachineId = this._id;
            const selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId === upcomingMachineId) {
                return "selected"
            }
        }
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


        'click .upcomingList': function () {
            const upcomingMachine = this._id;
            Session.set('selectedMachineId', upcomingMachine);
        },

        'click .addToList': function () {
            event.preventDefault();
            const KitStatus = 1;
            const machineId = Session.get('selectedMachineId');
            console.log('Machine', machineId);
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
            const machine_id = Session.get('selectedMachineId');
            const machineTestId = MachineReady.findOne({_id: machine_id}).machineId;
            Meteor.call('messageToWashBay', machineTestId, washMessage, machine_id);
            event.target.message.value = '';
        }


    });

}
