Meteor.subscribe('addIssues');

if(Meteor.isClient) {

    Template.repairMachine.helpers({


        issueAdded: () => {
          return addIssues.find();
        },

        choice: () => {
          return Session.get('repair');
        },

        shippList: function () {
            // Order of shipping date
            let k = Session.get('toggleRepair');
            if (k === 0) {
                Session.set('repair', '**** Repair ****');
                return  MachineReady.find({
                    $and: [
                        {pdiStatus: 1},
                        {$or: [{repairStatus: 0}, {repairStatus: 2}]}
                    ]
                }, {sort: {date: 1}});
            } else {
                Session.set('repair', '**** Upcoming Shipments****');
                return MachineReady.find({$and: [{pdiStatus: 0},
                            {$or: [{shipStatus: 0}, {shipStatus: 2}]}]},
                    {sort: {date: 1}});
            }
        },

        'selectedClass': function () {
            const upcomingMachineId = this._id;
            const selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId === upcomingMachineId) {
                return "selected"
            }
        },

        'selectedClass2': function () {
            const selectedRepair = this._id;
            const selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId === selectedRepair) {
                return "selected"
            }
        },

        'selectedClass3': function () {
            const selectedRepair = this._id;
            const selectedMachineId = Session.get('addIssueToMachine');
            if (selectedMachineId === selectedRepair) {
                return "selected"
            }
        },

        washMachine: () => {
            const machine_id = Session.get('selectedMachineId');
            if(machine_id) {
                const machineTestId = MachineReady.findOne({_id: machine_id}).machineId;
                Session.set('washMachine', machineTestId);
                return Session.get('washMachine');
            }
        },

        machineToRepair: () => {
            let newIssuesFound = [];
          const machineToRepair = Session.get('machineToRepair');
          if (machineToRepair) {
              newIssuesFound = MachineReady.findOne({_id: machineToRepair}).newIssues;
          }
          return newIssuesFound;
        },

    });

    Template.repairMachine.events({

        'click .openInspections': function () {
            const openRepair = this._id;
            Session.set('selectedMachineId', openRepair);

        },

        'click .addIssueToPdi': function () {
            const openRepair = this._id;
            Session.set('addIssueToMachine', openRepair);

        },

        'submit .repairFinnish': function (e) {
            e.preventDefault();
            const machineRepaired = Session.get('selectedMachineId');
            const workingHour = e.target.workingHours.value;
            Meteor.call('machineRep', machineRepaired, workingHour);
        },


        'click .toggleRepairUpcoming': function (e) {
            e.preventDefault();
            let choice = Session.get('toggleRepair');
            if(choice === 0) {
                Session.set('toggleRepair', 1)
            } else {
                Session.set('toggleRepair', 0);
            }
        },

        'click .addToList': function (e) {
            e.preventDefault();
            const KitStatus = 1;
            const machineId = Session.get('selectedMachineId');
            Meteor.call('listPrinted', machineId, KitStatus);
            Session.set('selectedMachineId', '');
        },

        'click .removeFromList': function (e) {
            e.preventDefault();
            const KitStatus = 0;
            const machineId = Session.get('selectedMachineId');
            Meteor.call('listRemoved', machineId, KitStatus);
        },

        'submit .messageToWashBay': function (e) {
            e.preventDefault();
            const washMessage = e.target.message.value;
            if(Session.get('selectedMachineId') === 'undefined') {
                Session.set('errorMachine', 'Choose Machine first');
            } else {
                const machine_id = Session.get('selectedMachineId');
                const machineTestId = MachineReady.findOne({_id: machine_id}).machineId;
                Meteor.call('messageToWashBay', machine_id, machineTestId, washMessage);
            }
            e.target.message.value = '';
        },

        'click .addIssueToList': (e) => {
            e.preventDefault();
            const selectedMachineId = Session.get('addIssueToMachine');
            Meteor.call('issueNoticed', selectedMachineId);
        },

        'click .repairList': (e) => {
            e.preventDefault();
            const machineToRepair = Session.get('selectedMachineId');
            Session.set('machineToRepair', machineToRepair);
        }




    });

}
