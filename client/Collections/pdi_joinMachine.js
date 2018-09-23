

Template.joinPdiMachine.helpers({


    'joinMachineNow': function () {
        const user = Meteor.user().username;
        Session.set('currentLoggedInUser', user);
        Session.set('selectedPdiMachineId', localStorage.getItem('joinMachine'));
        const selectedPdiMachineId = Session.get('selectedPdiMachineId');
        const machineId = MachineReady.findOne({_id: selectedPdiMachineId}).machineId;
        Session.set('selectedPdiMachineNr', machineId);
        return {machine: machineId, userLoggedIn: user};
    },

    battSaved: function() {
        Session.set('batteries', '');
        const machineId = Session.get('selectedPdiMachineNr');
        if(machineId) {
            const result = MachineReady.findOne({machineId: machineId}).batteries;
            Session.set('batteries', result);
            if (result) {
                return "Battery successfull saved";
            } else {
                return "Error, Battery not saved";
            }
        }
    },

    battC13CCA: () => {
        try {
            return Session.get('batteries').battC13CCA;
        } catch (e) {

        }
    },

    battC13Volt: () => {
        try {
            return Session.get('batteries').battC13Volt;
        } catch (e) {

        }
    },

    mtuG001CCA: () => {
        try {
            return Session.get('batteries').mtuG001CCA;
        } catch (e) {

        }
    },

    mtuG001Volt: () => {
        try {
            return Session.get('batteries').mtuG001Volt;
        } catch (e) {

        }
    },

    mtuG005CCA: () => {
        try {
            return Session.get('batteries').mtuG005CCA;
        } catch (e) {

        }
    },

    mtuG005Volt: () => {
        try {
            return Session.get('batteries').mtuG005Volt;
        } catch (e) {

        }
    },

    mtuG004CCA: () => {
        try {
            return Session.get('batteries').mtuG004CCA;
        } catch (e) {

        }
    },

    mtuG004Volt: () => {
        try {
            return Session.get('batteries').mtuG004Volt;
        } catch (e) {

        }
    },

    manBatt_1CCA: () => {
        try {
            return Session.get('batteries').manBatt_1CCA;
        } catch (e) {

        }
    },

    manBatt_1Volt: () => {
        try {
            return Session.get('batteries').manBatt_1Volt;
        } catch (e) {

        }
    },

    manBatt_2CCA: () => {
        try {
            return Session.get('batteries').manBatt_2CCA;
        } catch (e) {

        }
    },

    manBatt_2Volt: () => {
        try {
            return Session.get('batteries').manBatt_2Volt;
        } catch (e) {

        }
    },

    ommSaved: function() {
        const machineId = Session.get('selectedPdiMachineNr');
        result2 = MachineReady.findOne({machineId: machineId}).omms;
        Session.set('omms', result2);
        if(result2) {
            return "OMM's successfull saved";
        } else {
            return "Error, OMM not saved";
        }
    },

    fuelStart: () => {
        try {
            return Session.get('omms').fuelStart;
        } catch (e) {
           }
    },

    ommMain: () => {
        try {
            return Session.get('omms').ommMain;
        } catch (e) {
            }
    },

    ommSupp: () => {
        try {
            return Session.get('omms').ommSupp;
        } catch (e) {
        }
    },

    ommUnload: () => {
        try {
            return Session.get('omms').ommUnload;
        } catch (e) {
        }
    },

    ommProfiCam: () => {
        try {
            return Session.get('omms').ommProfiCam;
        } catch (e) {
        }
    },

    ommCebis: () => {
        try {
            return Session.get('omms').ommCebis;
        } catch (e) {
        }
    },

    ommTouch: () => {
        try {
            return Session.get('omms').ommTouch;
        } catch (e) {
        }
    },

    ommTerra: () => {
        try {
            return Session.get('omms').ommTerra;
        } catch (e) {
        }
    },

    ommDual: () => {
        try {
            return Session.get('omms').ommDual;
        } catch (e) {
        }
    },


    machineConfig: function() {
        const machineId = Session.get('selectedPdiMachineNr');
        result = MachineReady.findOne({machineId: machineId}).machineConfig;
        return result;
    },

    checkList: function() {
        const machineId = Session.get('selectedPdiMachineNr');
        result = MachineReady.findOne({machineId: machineId}).checkList;
        return result;
    },

    'selectedComponent': function () {
        let component = this._id;
        let selected = Session.get('selectedComponent');
        if (component === selected) {
            Session.set('componentChosen', 1);
            return 'selected'
        }
    },

    'selectedSubComponent': function() {
        let subComponent = this._id;
        let selectedSub = Session.get('selectedSub');
        if (subComponent === selectedSub) {
            return 'selected';
        }
    },

    mainComponent: function () {
        return mainComponents.find({}).fetch();
    },

    subComp: function () {
        let id = Session.get('selectedComponent');
        Meteor.call('subComponent', id, (error, result) => {
            if(error) {
                console.log('error',error);
            } else {
                Session.set('componentResult', result);
            }
        });
        return Session.get('componentResult');
    },

    issueComponent: () => {
        try {
            let k = Session.get('issueComp');
            return k;
        } catch (e) {

        }
    },


    newIssue: function() {
        const machineId = Session.get('selectedPdiMachineNr');
        result = MachineReady.findOne({machineId: machineId}).newIssues;
        return result;
    },

});

Session.set('selectedComponent', '');
Session.set('selectedSub', '');
Session.set('componentChosen', 0);

Template.joinPdiMachine.events({

    'submit .batts': (event) => {
        event.preventDefault();
        const loggedInUser = Session.get('currentLoggedInUser');
        const pdiMachineId = Session.get('selectedPdiMachineId');
        const battC13CCA = event.target.batteryC13CCA.value;
        const battC13Volt = event.target.batteryC13Volt.value;
        const mtuG001CCA = event.target.mtuG001CCA.value;
        const mtuG001Volt = event.target.mtuG001Volt.value;
        const mtuG005CCA = event.target.mtuG005CCA.value;
        const mtuG005Volt = event.target.mtuG005Volt.value;
        const mtuG004CCA = event.target.mtuG004CCA.value;
        const mtuG004Volt = event.target.mtuG004Volt.value;
        const manBatt_1CCA = event.target.manBatt_1CCA.value;
        const manBatt_1Volt = event.target.manBatt_1Volt.value;
        const manBatt_2CCA = event.target.manBatt_2CCA.value;
        const manBatt_2Volt = event.target.manBatt_2Volt.value;
        Meteor.call('pdiMachineBattery', pdiMachineId, loggedInUser, battC13CCA, battC13Volt,
            mtuG001CCA, mtuG001Volt, mtuG005CCA, mtuG005Volt, mtuG004CCA, mtuG004Volt,
            manBatt_1CCA, manBatt_1Volt, manBatt_2CCA, manBatt_2Volt);



    },

    'submit .omms': (event) => {
        event.preventDefault();
        const loggedInUser = Session.get('currentLoggedInUser');
        const pdiMachineId = Session.get('selectedPdiMachineId');
        const fuelMe = event.target.fuelMe.value;
        const ommMain = event.target.omMain.value;
        const ommSupp = event.target.omSupp.value;
        const ommUnload = event.target.omUnload.value;
        const ommProfiCam = event.target.omProfiCam.value;
        const ommCebis = event.target.omCebis.value;
        const ommTouch = event.target.omTouch.value;
        const ommTerra = event.target.omTerra.value;
        const ommDual = event.target.dualTire.value;
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
        let idFailure = event.currentTarget.id;
        if(selectedPdiMachineId) {
            Meteor.call('nokButton', selectedPdiMachineId, idFailure);
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

    'click .deleteRepair': () => {
        event.preventDefault();
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
        let fuelAfter = event.target.afterFuel.value;
        if(selectedPdiMachineId) {
            Meteor.call('fuelAfterPdi', selectedPdiMachineId, fuelAfter);
        } else {
            console.log("Lost Machine Number")
        }
        FlowRouter.go('/inspectionStart');

    }

});

Handlebars.registerHelper('inActive_Input', () => {
    let inActiveState = Session.get('componentChosen');
    if(inActiveState === 0) {
        return 'in-active-button';
    }
});