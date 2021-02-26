Template.joinPdiMachine.helpers({

    'joinMachineNow': function () {
        try {
            const user = Meteor.user().username;
            Session.set('currentLoggedInUser', user);
            Session.set('selectedPdiMachineId', localStorage.getItem('joinMachine'));
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const selectedPdiMachineId = Session.get('selectedPdiMachineId');
            const pdiMachine = MachineReady.findOne({_id: selectedPdiMachineId});
            Session.set('pdiMachine', pdiMachine);
            let machineId = pdiMachine.machineId;
            let omms = pdiMachine.omms;
            Session.set('omms', omms);
            let pdiPerformer = pdiMachine.pdiPerformer
            Session.set('selectedPdiMachineNr', machineId);
            Meteor.call('coAuditor', machineId, user);
            return {machine: machineId, coAuditor: user, pdiFirst: pdiPerformer};
        } catch (e) {}
    },



    // drop down profi cam


    'selectedProfiCam': function () {
        let partNumbers = this._id;
        let selected = Session.get('selectedValue');
        if (partNumbers === selected) {
            Session.set('selectedProfiCam', 1);
            return 'selected'
        }
    },

    omProfiCam: () => {
        return oms.find({}).fetch();
    },

    ommSaved: function() {
        try {
            const result = Session.get('pdiMachine');
            let omms = result.omms;
            Session.set('omms', omms);
            if(omms) {
                return "OMM's successfully saved";
            } else {
                return "Error, OMM not saved";
            }
        } catch (e) {
            console.log('error ', e)
        }
    },

    fuelStart: () => {
        try {
            return Session.get('omms').fuelStart;
        } catch (e) {}
    },

    ommMain: () => {
        try {
            return Session.get('omms').ommMain;
        } catch (e) {}
    },

    ommSupp: () => {
        try {
            return Session.get('omms').ommSupp;
        } catch (e) {}
    },

    ommUnload: () => {
        try {
            return Session.get('omms').ommUnload;
        } catch (e) {}
    },
    profiCam: () => {
        try {
            let result = Session.get('profiCam');
            if (result) {

                return result;
            } else {
             return Session.get('omms').ommProfiCam;
            }
        } catch (e) {}
    },

    ommCebis: () => {
        try {
            return Session.get('omms').ommCebis;
        } catch (e) {}
    },

    ommCebisTouch: () => {
        try {
            return Session.get('omms').ommCebisTouch;
        } catch (e) {}
    },

    ommTerra: () => {
        try {
            return Session.get('omms').ommTerra;
        } catch (e) {}
    },

    ommDuals: () => {
        try {
            return Session.get('omms').ommDuals;
        } catch (e) {}
    },


    machineConfig: function() {
        try {
           const result = Session.get('pdiMachine');
           return result.machineConfig;
        }  catch (e) {}
    },

    checkList: function() {
        try {
            const result = Session.get('pdiMachine');
            return result.checkList;
        }  catch (e) {}
    },

    'selectedComponent': function () {
        let component = this._id;
        let selected = Session.get('selectedComponent');
        if (component === selected) {
            Session.set('componentChosen', 1);
            return 'selected'
        }
    },

    mainComponent: function () {
        return mainComponents.find({}).fetch();
    },

    issueComponent: () => {
        try {
            return Session.get('issueComp');
        } catch (e) {

        }
    },

    newIssue: function() {
        try {
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            let repairInfos = Session.get('repairInfos');
            let newIssuesFound = [];
            const machineId = Session.get('selectedPdiMachineId');
            if (machineId) {
                newIssuesFound = MachineReady.findOne({_id: machineId}).newIssues;
            }
            newIssuesFound.forEach((element) => {
                element.pictureLocation = repairInfos + element.pictureLocation;
            });
            return newIssuesFound;
        } catch {}
    },

    'selectedFailure': function(){
        const failure = this._id;
        const selectedFailure = Session.get('openFailure');
        if (failure === selectedFailure) {
            return "selected";
        }
    },

    battSaved: function() {
        try {
            const result = Session.get('pdiMachine');
            let batteries = result.batteries;
            Session.set('batteries', batteries);
            if (batteries) {
                return "Battery successfully saved";
            } else {
                return "Error, Battery not saved";
            }
            } catch (e) {
              }
    },

    battC13CCA: () => {
        try {
            return Session.get('batteries').battC13CCA;
        } catch (e) {}
    },

    battC13Volt: () => {
        try {
            return Session.get('batteries').battC13Volt;
        } catch (e) {}
    },

    mtuG001CCA: () => {
        try {
            return Session.get('batteries').mtuG001CCA;
        } catch (e) {}
    },

    mtuG001Volt: () => {
        try {
            return Session.get('batteries').mtuG001Volt;
        } catch (e) {}
    },

    mtuG005CCA: () => {
        try {
            return Session.get('batteries').mtuG005CCA;
        } catch (e) {}
    },

    mtuG005Volt: () => {
        try {
            return Session.get('batteries').mtuG005Volt;
        } catch (e) {}
    },

    mtuG004CCA: () => {
        try {
            return Session.get('batteries').mtuG004CCA;
        } catch (e) {}
    },

    mtuG004Volt: () => {
        try {
            return Session.get('batteries').mtuG004Volt;
        } catch (e) {}
    },

    configImage: () => {
        let choice = Session.get('imageOnOff');
        if (choice === 1) {
            return Session.get('imagePathId')
        } else if (choice === 0) {
            return '';
        }

    }

});

Session.set('selectedComponent', '');
Session.set('componentChosen', 0);

Template.joinPdiMachine.events({

    'click .profiCam': function () {
        const selected = this._id;
        let textProfiCam = this.partNumbers;
        Session.set('selectedValue', selected);
        Session.set('profiCam', textProfiCam );
    },

    'submit .batts': (e) => {
        e.preventDefault();
        const loggedInUser = Session.get('currentLoggedInUser');
        const pdiMachineId = Session.get('selectedPdiMachineId');
        const battC13CCA = e.target.batteryC13CCA.value;
        const battC13Volt = e.target.batteryC13Volt.value;
        const mtuG001CCA = e.target.mtuG001CCA.value;
        const mtuG001Volt = e.target.mtuG001Volt.value;
        const mtuG005CCA = e.target.mtuG005CCA.value;
        const mtuG005Volt = e.target.mtuG005Volt.value;
        const mtuG004CCA = e.target.mtuG004CCA.value;
        const mtuG004Volt = e.target.mtuG004Volt.value;
        Meteor.call('pdiMachineBattery', pdiMachineId, loggedInUser, battC13CCA, battC13Volt,
            mtuG001CCA, mtuG001Volt, mtuG005CCA, mtuG005Volt, mtuG004CCA, mtuG004Volt,
           );
    },

    'submit .omms': (e) => {
        e.preventDefault();
        const loggedInUser = Session.get('currentLoggedInUser');
        const pdiMachineId = Session.get('selectedPdiMachineId');
        const fuelMe = e.target.fuelMe.value;
        const ommMain = e.target.omMain.value;
        const ommSupp = e.target.omSupp.value;
        const ommUnload = e.target.omUnload.value;
        const ommProfiCam = e.target.omProfiCam.value;
        const ommCebis = e.target.omCebis.value;
        const ommTouch = e.target.omTouch.value;
        const ommTerra = e.target.omTerra.value;
        const ommDual = e.target.dualTire.value;
        Meteor.call('pdiMachineOmm', pdiMachineId, loggedInUser, fuelMe, ommMain, ommSupp,
            ommUnload,ommProfiCam, ommCebis, ommTouch, ommTerra, ommDual);
    },

    'click .configButtonOK': (event) => {
        event.preventDefault();
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        let idFailure = event.currentTarget.id;
        if(selectedPdiMachineId) {
            Meteor.call('configOkButton', selectedPdiMachineId, idFailure);
        } else {
            console.log("Lost Machine Number")
        }
    },

    'click .configButtonNOK': (event) => {
        event.preventDefault();
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        let idFailure = event.currentTarget.id;
        let idIdentifier = event.currentTarget.name;
        if(selectedPdiMachineId) {
            Meteor.call('configNokButton', selectedPdiMachineId, idFailure, idIdentifier);
        } else {
            console.log("Lost Machine Number")
        }
    },

    'click .configButtonInfo': (event) => {
        event.preventDefault();
        let configInfos = Session.get('configInfos');
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        let imagePathId = event.currentTarget.name;
        console.log(imagePathId);
        let imagePath = configInfos + imagePathId;
        Session.set('imagePathId', imagePath);
        if(selectedPdiMachineId) {
            let choice = Session.get('imageOnOff');
            if (choice === 0) {
                Session.set('imageOnOff', 1);
            } else if (choice === 1) {
                Session.set('imageOnOff', 0);
            }

        } else {
            console.log("Lost Machine Number")
        }

    },



    'click .buttonOK': (event) => {
        event.preventDefault();
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        let idFailure = event.currentTarget.id;
        if(selectedPdiMachineId) {
            Meteor.call('okButton', selectedPdiMachineId, idFailure);
        } else {
            console.log("Lost Machine Number")
        }
    },

    'click .buttonNOK': (event) => {
        event.preventDefault();
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        let idFailure = event.target.id;
        let errorDescription = event.target.name;
        console.log('error ', errorDescription);
        if(selectedPdiMachineId) {
            Meteor.call('nokButton', selectedPdiMachineId, idFailure, errorDescription);
        } else {
            console.log("Lost Machine Number")
        }
    },

    'click .buttonNA': (event) => {
        event.preventDefault();
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        let idFailure = event.currentTarget.id;
        if(selectedPdiMachineId) {
            Meteor.call('naButton', selectedPdiMachineId, idFailure);
        } else {
            console.log("Lost Machine Number")
        }
    },

    'click .comp': function () {
        const selected = this._id;
        let textMainComp = this.component;
        Session.set('selectedComponent', selected);
        Session.set('issueComp', textMainComp + ' - ');
    },

    'click .subComp': function () {
        const subComp = this._id;
        let textMainComp = this.component;
        Session.set('selectedSub', subComp);
        Session.set('issueComp', textMainComp + ' - ');
    },

    'click .openFailure': function () {
        const openFailure = this._id;
        Session.set('openFailure', openFailure);
    },

    'click .deleteRepair': (e) => {
        e.preventDefault();
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        const openFailure = Session.get('openFailure');
        if(selectedPdiMachineId) {
            Meteor.call('removeFailure', selectedPdiMachineId, openFailure);
        } else {
            console.log('Lost Machine Number');
        }
    },

    'submit .addNewIssue': (event) => {
        event.preventDefault();
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        let addNewFailure = event.target.addIssue.value;
        if(selectedPdiMachineId) {
            Meteor.call('addNewFailure', selectedPdiMachineId, addNewFailure);
        } else {
            console.log("Lost Machine Number")
        }
        event.target.addIssue.value = '';
        Session.set('componentChosen', 0);
        Session.set('selectedComponent', '');
        Session.set('issueComp', '');
    },

    'click .submitButton1': (e) => {
        e.preventDefault();
        let team = 'Team 1';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedPdiMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },

    'click .submitButton2': (e) => {
        e.preventDefault();
        let team = 'Team 2';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedPdiMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },

    'click .submitButton3': (e) => {
        e.preventDefault();
        let team = 'Team 3';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedPdiMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },
    'click .submitButton4': (e) => {
        e.preventDefault();
        let team = 'Team 4';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedPdiMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },
    'click .submitButton5': (e) => {
        e.preventDefault();
        let team = 'Team 5';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedPdiMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },

    'click .submitButtonRepair': (e) => {
        e.preventDefault();
        let team = 'Repair';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedPdiMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },

    'click .submitButtonTestBay': (e) => {
        e.preventDefault();
        let team = 'Test Bay';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedPdiMachineId');
        Meteor.call('teamSpecifier', machineId, team, idCheck);
    },

    'click .submitButtonSupplier': (e) => {
        e.preventDefault();
        let supplier = 'Supplier';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedPdiMachineId');
        Meteor.call('teamSpecifier', machineId, supplier, idCheck);
    },

    'click .submitButtonUnknown': (e) => {
        e.preventDefault();
        let unknown = 'Unknown';
        let idCheck = e.currentTarget.id;
        let machineId = Session.get('selectedPdiMachineId');
        Meteor.call('teamSpecifier', machineId, unknown, idCheck);
    },

    'submit .pdiRepairConfirmText': function (e) {
        e.preventDefault();
        const repairUser = Meteor.user().username;
        const repairComment = e.target.message.value;
        const repairTime = e.target.repTime.value;
        let repairId = Session.get('openFailure');
        let machineId = Session.get('selectedPdiMachineId');
        Meteor.call('confirmRepair', repairId, repairUser, repairComment, repairTime, machineId);
        e.target.message.value = '';
        e.target.repTime.value = '';
    },

    'submit .addressToWashBay': (event) => {
        event.preventDefault();
        const selectedPdiMachineNr = Session.get('selectedPdiMachineNr');
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        let addWashBay = event.target.addWashBay.value;
        if(selectedPdiMachineId) {
            Meteor.call('messageToWashBay_3',selectedPdiMachineId, selectedPdiMachineNr, addWashBay);
        } else {
            console.log("Lost Machine Number")
        }
        event.target.addWashBay.value = '';
    },

    'submit .afterPdiFuel': (event) => {
        event.preventDefault();
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        const selectedPdiMachineNr = Session.get('selectedPdiMachineNr');
        let fuelAfter = event.target.afterFuel.value;
        if(selectedPdiMachineId) {
            Meteor.call('fuelAfterPdi', selectedPdiMachineId, selectedPdiMachineNr, fuelAfter);
        } else {
            console.log("Lost Machine Number")
        }
        FlowRouter.go('/inspectionStart');
    },

    'change input': function(ev) {
        const openFailure = Session.get('openFailure');
        if(openFailure) {
            _.each(ev.target.files, function(file) {
                Meteor.saveFile(file, file.name);
            });
        } else {
            console.log('choose issue first')
        }
    }

});





Handlebars.registerHelper('inActive_Input', () => {
    let inActiveState = Session.get('componentChosen');
    if(inActiveState === 0) {
        return 'in-active-button';
    }
});