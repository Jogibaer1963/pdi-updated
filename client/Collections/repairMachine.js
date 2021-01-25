Meteor.subscribe('addIssues');

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
           // Session.set('machineToRepair', '');
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

        'selectedConfirm': function () {
          const selectedConfirm = this._id;
          const confirmRepair = Session.get('confirmRepair');

          if (selectedConfirm === confirmRepair) {
              return "selected";
          }
        },

        washMachine: () => {
            try {
                const machine_id = Session.get('selectedMachineId');
                if(machine_id) {
                    const machineTestId = MachineReady.findOne({_id: machine_id}).machineId;
                    Session.set('washMachine', machineTestId);
                    return Session.get('washMachine');
                }
            } catch {}
        },

        machineToRepair: () => {
           try {
              let repairInfos = Session.get('repairInfos');
              let newIssuesFound = [];
              const machineToRepair = Session.get('selectedMachineId');
              if (machineToRepair) {
                  newIssuesFound = MachineReady.findOne({_id: machineToRepair}).newIssues;
              }
              newIssuesFound.forEach((element) => {
                  element.pictureLocation = repairInfos + element.pictureLocation;
              });
              return newIssuesFound;
           } catch {}
        },

        repairUser: () => {
            return Meteor.user().username;
        },

        machineRepairList: () => {
           let machine = Session.get('selectedMachineId');
            return MachineReady.findOne({_id: machine}).machineId;
        },

        issueResponsible: () => {

        }
    });

    Template.repairMachine.events({

        'click .openInspections': function (e) {
            e.preventDefault();
            const openRepair = this._id;
            Session.set('selectedMachineId', openRepair);
        },

        'click .addIssueToPdi': function (e) {
            e.preventDefault();
            const openRepair = this._id;
            Session.set('addIssueToMachine', openRepair);
        },

        'submit .reActivateRepair': function(e) {
          e.preventDefault();
          const machineNumber = e.target.reActivate.value;
          if(machineNumber) {
              Meteor.call('reActivate', machineNumber);
          } else {
          }
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

        'click .repairConfirm': function (e) {
            e.preventDefault();
            const confirmRepair = this._id;
            Session.set('confirmRepair', confirmRepair);
        },

        'submit .repairConfirmText': function (e) {
            e.preventDefault();
            const repairUser = Meteor.user().username;
            const repairComment = e.target.message.value;
            const repairTime = e.target.time.value;
            let repairId = Session.get('confirmRepair');
            let machineId = Session.get('selectedMachineId');
            Meteor.call('confirmRepair', repairId, repairUser, repairComment, repairTime, machineId);
        },

        //---------------------------------  Buttons for specifying the issuer  -------------------------

        'click .submitButton1': (e) => {
            e.preventDefault();
            let team = 'Team 1';
            let issueId = e.target.id;
            let machineId = Session.get('selectedMachineId');
            console.log('button 1', 'Team: ', team, 'Issue Id: ', issueId, 'Machine Id: ', machineId);
            Meteor.call('teamSpecifier', machineId, team, issueId);
        },

        'click .submitButton2': (e) => {
            e.preventDefault();
            let team = 'Team 2';
            let issueId = e.target.id;
            let machineId = Session.get('selectedMachineId');
            Meteor.call('teamSpecifier', machineId, team, issueId);
        },

        'click .submitButton3': (e) => {
            e.preventDefault();
            let team = 'Team 3';
            let issueId = e.target.id;
            let machineId = Session.get('selectedMachineId');
            Meteor.call('teamSpecifier', machineId, team, issueId);
        },
        'click .submitButton4': (e) => {
            e.preventDefault();
            let team = 'Team 4';
            let issueId = e.target.id;
            let machineId = Session.get('selectedMachineId');
            Meteor.call('teamSpecifier', machineId, team, issueId);
        },
        'click .submitButton5': (e) => {
            e.preventDefault();
            let team = 'Team 5';
            let issueId = e.target.id;
            let machineId = Session.get('selectedMachineId');
            Meteor.call('teamSpecifier', machineId, team, issueId);
        },

        'click .submitButtonRepair': (e) => {
            e.preventDefault();
            let team = 'Repair';
            let issueId = e.target.id;
            let machineId = Session.get('selectedMachineId');
            Meteor.call('teamSpecifier', machineId, team, issueId);
        },

        'click .submitButtonTestBay': (e) => {
            e.preventDefault();
            let team = 'Test Bay';
            let issueId = e.target.id;
            let machineId = Session.get('selectedMachineId');
            Meteor.call('teamSpecifier', machineId, team, issueId);
        },

        'click .submitButtonSupplier': (e) => {
            e.preventDefault();
            let team = 'Supplier';
            let issueId = e.target.id;
            let machineId = Session.get('selectedMachineId');
            Meteor.call('teamSpecifier', machineId, team, issueId);
        },

        'click .submitButtonUnknown': (e) => {
            e.preventDefault();
            let team = 'Unknown';
            let issueId = e.target.id;
            let machineId = Session.get('selectedMachineId');
            Meteor.call('teamSpecifier', machineId, team, issueId);
        }

    });


