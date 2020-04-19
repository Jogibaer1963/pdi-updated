Template.pdiCrewHome.helpers({


    pdiShippList: function () {
        // Order of shipping date  let k = Session.get('toggleRepair');
            let k =   MachineReady.find({
                $and: [
                    {pdiStatus: 1},
                    {$or: [{repairStatus: 0}, {repairStatus: 2}]}
                ]
            }, {sort: {date: 1}}).fetch();
            return k;
    },


    'selectedClass2': function () {
        // Session.set('machineToRepair', '');
        const selectedRepair = this._id;
        const selectedMachineId = Session.get('selectedMachineId');
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
        try {
        let machine = Session.get('selectedMachineId');
        return MachineReady.findOne({_id: machine}).machineId;
        } catch {}
    }


});

Template.pdiCrewHome.events({

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

    'click .repairConfirm': function (e) {
        e.preventDefault();
        const confirmRepair = this._id;
        Session.set('confirmRepair', confirmRepair);
    },

    'submit .repairConfirmText': function (e) {
        e.preventDefault();
        const repairUser = Meteor.user().username;
        const repairComment = e.target.message.value;
        let repairId = Session.get('confirmRepair');
        let machineId = Session.get('selectedMachineId');
        Meteor.call('confirmRepair', repairId, repairUser, repairComment, machineId);
    },

    'click .submitButton1': (e) => {
        e.preventDefault();
        let team = 'Team 1';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },

    'click .submitButton2': (e) => {
        e.preventDefault();
        let team = 'Team 2';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },

    'click .submitButton3': (e) => {
        e.preventDefault();
        let team = 'Team 3';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },
    'click .submitButton4': (e) => {
        e.preventDefault();
        let team = 'Team 4';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },
    'click .submitButton5': (e) => {
        e.preventDefault();
        let team = 'Team 5';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },

    'click .submitButtonSupplier': (e) => {
        e.preventDefault();
        let supplier = 'Supplier';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedMachineId');
        Meteor.call('teamSpecifier', machineId, supplier, idCheck);
    },

    'click .submitButtonUnknown': (e) => {
        e.preventDefault();
        let unknown = 'Unknown';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedMachineId');
        Meteor.call('teamSpecifier', machineId, unknown, idCheck);
    },


});


