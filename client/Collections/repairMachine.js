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
            let result;
            let k = Session.get('toggleRepair');
            if (k === 0) {
                Session.set('repair', '**** Repair ****');
                result =  MachineReady.find({
                    $and: [
                        {pdiStatus: 1},
                        {$or: [{repairStatus: 0}, {repairStatus: 2}]}
                    ]
                }, {fields: {machineId: 1, date: 1, truckStatus: 1, confirmedShipDate: 1,
                                      shippingComment: 1, kit: 1, repairStatus: 1, washStatus: 1,
                                      locationId: 1, kitStatus: 1, partsOnOrder: 1,
                                      newIssues: 1, pdiEstimate: 1}  }, {sort: {date: 1}}).fetch();
                try {
                    if (result[0].partsOnOrder > 0) {
                        result[0].partsOnOrder = 2;
                    }
                } catch (e) {
                   }
                   result.forEach((element) => {
                       element.newIssues.every(element2 => {
                           if (element2.pdiEstimate === 1) {
                               element.pdiEstimate = 1
                               return false
                           }
                       })
                   })
                return result;
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

        'failureRow': function () {
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

        repairUser: () => {
            return Meteor.user().username;
        },

        machineRepairList: () => {
            try {
                let machine = Session.get('selectedMachineId');
                return MachineReady.findOne({_id: machine}).machineId;
            } catch {}
        },

        pdiTech: () => {
            return Session.get('pdiTech')
        },

        // **************   Drop down Component list for new issue  ************************

        mainComponent: function () {
            return mainComponents.find({}).fetch();
        },

        'selectedComponent': function () {
            let component = this._id;
            let selected = Session.get('selectedComponent');
            if (component === selected) {
                Session.set('componentChosen', 1);
                return 'selected'
            }
        },

        issueComponent: () => {
            try {
                return Session.get('issueComp');
            } catch (e) {

            }
        },


        //   ******************** Repair Table  helpers ************************************

        teamList: () => {
            return TeamList.find().fetch();
        },

        machineToRepair: () => {
            try {
                const machineId = Session.get('selectedMachineId');
                let imageIp = Session.get('repairInfos')
                let returnedTarget = {};
                let returnResultTeam = []; // Team 1
                if (machineId) {
                    let result = MachineReady.findOne({_id: machineId}, {
                        fields: {
                            newIssues: 1,
                            machineId: 1,
                            omms: 1
                        }
                    });
                    Session.set('pdiTech', result.omms.user);
                    let machineNr = result.machineId;
                    let newIssues = result.newIssues;
                    let source = {
                        machineId: result._id,
                        machineNr: machineNr,
                    }
                    newIssues.forEach((element) => {
                        element.pictureLocation = imageIp + element.pictureLocation;
                        returnedTarget = Object.assign(element, source)
                        returnResultTeam.push(returnedTarget);
                    })
                }
                return returnResultTeam
            } catch (e) {
            }
        },

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
            let fuel = '';
            Meteor.call('machineRep', machineRepaired, workingHour, fuel);
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
            const new_machine_id = e.target.machineForWashBay.value;
            const washMessage = e.target.message.value;
            // console.log(new_machine_id)
            try {
                if (new_machine_id === '' && Session.get('selectedMachineId') === '') {
                    Bert.alert('No Machine Number for Wash Bay Text', 'danger', 'growl-top-left');
                } else  if (new_machine_id) {
                   let _id = MachineReady.findOne({machineId: new_machine_id})._id;
                //   console.log('manual entry', _id, new_machine_id, washMessage)
                    Meteor.call('messageToWashBay', _id, new_machine_id, washMessage);
                } else {
                    let _id = Session.get('selectedMachineId')
                    let machineNr = MachineReady.findOne({_id: _id}).machineId;
                //    console.log('from repair List', _id, machineNr, washMessage)
                    Meteor.call('messageToWashBay', _id, machineNr, washMessage);
                }
            } catch(e) {}
            Session.set('selectedMachineId', '')
            e.target.message.value = '';
            e.target.machineForWashBay.value = '';
        },

        'click .addIssueToList': (e) => {
            e.preventDefault();
            const selectedMachineId = Session.get('addIssueToMachine');
            Meteor.call('issueNoticed', selectedMachineId);
        },

        'click .failureRow': function (e) {
            e.preventDefault();
            const confirmRepair = this._id;
            Session.set('confirmRepair', confirmRepair);
        },

        'submit .repairConfirmText': function (e) {
            e.preventDefault();
            const repairUser = Meteor.user().username;
            const repairComment = e.target.message.value;
            let repairTimeHour = parseInt(e.target.timeHour.value);
            let repairTimeMin = parseInt(e.target.timeMin.value);
            if (!repairTimeMin) {
                repairTimeMin = 0;
            }
            if (repairTimeHour) {
                repairTimeMin = repairTimeHour * 60 + repairTimeMin
            }
            let repairId = Session.get('confirmRepair');
            let machineId = Session.get('selectedMachineId');
            Meteor.call('confirmRepair', repairId, repairUser, repairComment, repairTimeMin, machineId);
            e.target.message.value = '';
            e.target.timeHour.value = '';
            e.target.timeMin.value = '';
        },

        'click .comp': function () {
            const selected = this._id;
            let textMainComp = this.component;
            Session.set('selectedComponent', selected);
            Session.set('issueComp', textMainComp + ' - ');
        },

        'submit .addNewIssue': function(e) {
            e.preventDefault();
            let machineId = Session.get('selectedMachineId');
            let addNewFailure = e.target.addIssue.value;
            if(machineId ) {
                Meteor.call('addNewFailure', machineId , addNewFailure);
            } else {
                console.log("Lost Machine Number")
            }
            e.target.addIssue.value = '';
            Session.set('componentChosen', 0);
            Session.set('selectedComponent', '');
            Session.set('issueComp', '');
        },

        'change input': function(ev) {
            const openFailure = Session.get('confirmRepair');
            // switch sessions to proper id, call function file in handlebarsRegister.js
            Session.set('openFailure', openFailure)
            if(openFailure) {
                _.each(ev.target.files, function(file) {
                    Meteor.saveFile(file, file.name);
                });
            } else {
            }
            document.getElementById('img').value = '';
        },

    });


