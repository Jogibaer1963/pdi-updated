Template.pdiCrewHome.helpers({


    pdiShippList: function () {
        // Order of shipping date  let k = Session.get('toggleRepair');
        let toggleView = Session.get('toggleView');
        if (toggleView === 0) {
            return MachineReady.find({
                $and: [
                    {pdiStatus: 1},
                    {$or: [{repairStatus: 0}, {repairStatus: 2}]}
                ]
            }, {sort: {date: 1}}).fetch();
        } else if (toggleView === 1) {
            return MachineReady.find({
                $and: [
                    {pdiStatus: 1},
                    {$or: [{repairStatus: 1}]}
                ]
            }, {sort: {date: 1}}).fetch();
        }

    },

    roadTestList: () => {
        let toggleView = Session.get('roadTestView');
        if (toggleView === 0) {
            return machineCommTable.find({$and: [{$or: [{roadTest: false},{roadTest: 2}]},
                    {dateOfCreation: {$gt: '2022-09-01'}}]}
            , {sort: {date: 1}}).fetch();
        } else if (toggleView === 1) {
            return machineCommTable.find({roadTest: 1}, {sort: {date: 1}}).fetch();
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
        // Session.set('machineToRepair', '');
        const selectedRoadTest = this.machineId;
        const selectedMachineId = Session.get('selectedRoadTest');
        if (selectedMachineId === selectedRoadTest) {
            return "selected"
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

    // ******************    repair Box  **************

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

            let machineNr = result.machineId;
            let newIssues = result.newIssues;
            Session.set('pdiTech', result.omms.user);
            Session.set('repairMachine', machineNr);
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
        Session.set('repairResult', returnResultTeam);
        return returnResultTeam
        } catch (e) {
        }
    },

    teamList: () => {
        return TeamList.find().fetch();
    },

    'failureRow': function () {
        let result = this._id;
        const selectedRow = Session.get('failureId');
        if (result === selectedRow) {
            return "selected";
        }
    },

    user: () => {
        return Session.get('pdiTech');
    },

    machineNr: () => {
        return Session.get('repairMachine');
    },

    //  ******************  end Repair Box  ********************

    //  ******************  Adding new issue with image  ***************

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

    //  ************************** end adding issue  ***********************

    roadTestComments: () => {
        let machine = Session.get('selectedRoadTest')
        let result = MachineReady.findOne({machineId: machine}, {fields: {roadTestComment: 1}})
        return result.roadTestComment
    }

});

Session.set('toggleView', 0);
Session.set('roadTestView', 0);

Template.pdiCrewHome.events({

    'click .toggle-repair-view': (e) => {
      e.preventDefault();
      if (Session.get('toggleView') === 0) {
            Session.set('toggleView', 1)
      } else if (Session.get('toggleView') === 1) {
          Session.set('toggleView', 0)
      }
    },

    'submit .repair-finnish': function (e) {
      e.preventDefault();
      let summary = 0;
      let hours = e.target.workingHours.value;
      let fuel = e.target.fuel.value;
      let machineId = Session.get('selectedMachineId');
      let result = Session.get('repairResult')
      let summaryRepairs = result.length;
      result.forEach((element) => {
          summary = summary + element.repairStatus;
      })
        if (summaryRepairs - summary !== 0) {
            window.alert("Still unclosed Repairs for this Machine. Closing not possible !!")
        } else {
            Meteor.call('machineRep', machineId, hours, fuel)
            e.target.workingHours.value = '';
            e.target.fuel.value = '';
            Session.set('selectedMachineId', '')
        }
    },

    'click .openInspections': function () {
        const openRepair = this._id;
        Session.set('selectedMachineId', openRepair);
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

    'click .failureRow': function (e) {
        e.preventDefault();
      const machineRow = this._id;
      Session.set('failureId', machineRow);
    },

    'submit .repairConfirmText': function (e) {
        e.preventDefault();
        let repairTime = '';
        const repairUser = Meteor.user().username;
        const repairComment = e.target.message.value;
        let repairTimeHours = e.target.timeHour.value;
        let repairTimeMin = e.target.timeMin.value;
        if (repairTimeHours === '') {
            repairTimeHours = 0;
        }
        if (repairTimeMin === '') {
            repairTimeMin = 0
        }
            repairTime = parseInt(repairTimeHours) * 60 + parseInt(repairTimeMin);
        let failureId = Session.get('failureId');
        let machineId = Session.get('selectedMachineId');
        Meteor.call('confirmRepair', failureId, repairUser, repairComment, repairTime, machineId);
        e.target.message.value = '';
        e.target.timeHour.value = '';
        e.target.timeMin.value = '';
        Session.set('failureId', '');
    },

    'change  #category-select': function (event) {
        event.preventDefault();
        const selectedTeam = $(event.currentTarget).val();
        let machineNr = Session.get('selectedMachineId');
        let issueId = Session.get('failureId');
        if (issueId !== 'undefined' && selectedTeam !== 'undefined') {
            Meteor.call('choseTeam', selectedTeam, issueId, machineNr)
        }
        Session.set('failureId', '');
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
        const openFailure = Session.get('failureId');
        // switch sessions to proper id, call function file in handlebarsRegister.js
        Session.set('openFailure', openFailure)
        if(openFailure) {
            _.each(ev.target.files, function(file) {
                Meteor.saveFile(file, file.name);
            });
        } else {
        }
    },
//  *************************  Road Test Section  ********************************************
    'click .road-test-view': (e) => {
        e.preventDefault();
        if (Session.get('roadTestView') === 0) {
            Session.set('roadTestView', 1)
        } else if (Session.get('roadTestView') === 1) {
            Session.set('roadTestView', 0)
        }
    },

    'click .openRoadTest': function () {
        const openRoadTest = this.machineId
        Session.set('selectedRoadTest', openRoadTest);
    },

    'click .road-test-start': function (e) {
        e.preventDefault()
        Meteor.call('roadTest', Session.get('selectedRoadTest'), 2)
    },

    'click .road-test-end': function (e) {
        e.preventDefault()
        const machine = this.machineId;
        Meteor.call('roadTest', Session.get('selectedRoadTest'), 1)
    },

    'submit .road-test-comments': function (e) {
        e.preventDefault()
        let comment = e.target.roadTestComments.value;
        Meteor.call('roadTestComments', Session.get('selectedRoadTest'), comment)
    },





});


