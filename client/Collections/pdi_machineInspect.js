
Meteor.subscribe('oms');


    Template.pdiToDoList.helpers({

        'machineNow': function () {
            const user = Meteor.user().username;
            Session.set('currentLoggedInUser', user);
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const selectedPdiMachineNr = Session.get('selectedPdiMachineNr');
            return {machine: selectedPdiMachineNr, userLoggedIn: user};
        },


        checkList: function() {
            try {
                Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
                const machineId = Session.get('selectedPdiMachineNr');
                return MachineReady.findOne({machineId: machineId}).checkList;
            } catch (e) {
            }
        },

        preCheck: () => {
            const machine_Nr = Session.get('selectedPdiMachineNr');
            let checkResult = {} ;
            try {
                const result = preSeriesMachine.findOne({preMachineId: machine_Nr},
                    {fields: {checkItems: 1}}).checkItems;
                const resultArray = result.filter((fail) => {
                    return fail.failureStatus === 2;
                });
                let path1 = Session.get('ipAndPort');
                return resultArray.map(resultExtract => {
                    let nods = "?a=" + Math.random();
                        checkResult = {id : resultExtract._id,
                        failureStatus: resultExtract.failureStatus,
                        imagePath : path1 + resultExtract.imagePath + nods,
                        errorDescription: resultExtract.errorDescription};
                    return checkResult;
                });
            }
            catch (e) {
            }
        },

        machineConfig: function() {
            try {
                Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
                const machineId = Session.get('selectedPdiMachineNr');
                return MachineReady.findOne({machineId: machineId}).machineConfig;
            } catch (e) {
            }
        },

        'selectedFailure': function(){
           const failure = this._id;
           const selectedFailure = Session.get('openFailure');
           if (failure === selectedFailure) {
               return "selected";
           }
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
                Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
                const machineId = Session.get('selectedPdiMachineNr');
                const result = MachineReady.findOne({machineId: machineId}).omms;
                Session.set('omms', result);
                if(result) {
                    return "OMM's successfull saved";
                } else {
                    return "Error, OMM not saved";
                }
            } catch (e) {
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
                console.log(newIssuesFound);
                newIssuesFound.forEach((element) => {
                    element.pictureLocation = repairInfos + element.pictureLocation;
                });
                console.log(newIssuesFound);
                return newIssuesFound;
            } catch {}
        },

        battSaved: function() {
            try {
                Session.set('batteries', '');
                Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
                const machineId = Session.get('selectedPdiMachineNr');
                const result = MachineReady.findOne({machineId: machineId}).batteries;
                Session.set('batteries', result);
                if(result) {
                    return "Battery successful saved";
                } else {
                    return "Error, Battery not saved";
                }
            } catch (e) {}
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
    Session.set('selectedValue', '');
    Session.set('imagePathId', '');
    Session.set('imageOnOff', 0);

    Template.pdiToDoList.events({

        'click .profiCam': function () {
            const selected = this._id;
            let textProfiCam = this.partNumbers;
            Session.set('selectedValue', selected);
            Session.set('profiCam', textProfiCam );
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
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
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
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
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
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            const selectedPdiMachineId = Session.get('selectedPdiMachineId');
            let imagePathId = event.currentTarget.name;
            Session.set('imagePathId', imagePathId);
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
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
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
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
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
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            const selectedPdiMachineId = Session.get('selectedPdiMachineId');
            let idFailure = event.currentTarget.id;
            if(selectedPdiMachineId) {
                Meteor.call('naButton', selectedPdiMachineId, idFailure);
            } else {
                console.log("Lost Machine Number")
            }
        },

        // drop down select component

        'click .comp': function () {
            const selected = this._id;
            let textMainComp = this.component;
            Session.set('selectedComponent', selected);
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
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
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

        'submit .add-image-to-repair': function (e) {
            e.preventDefault();
            let chosenFailure = Session.get('openFailure');
            if (chosenFailure) {
                console.log('inside', chosenFailure)
            }
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




        'submit .addressToWashBay': (event) => {
            event.preventDefault();
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
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

        'submit .batts': (event) => {
            event.preventDefault();
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
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
            Meteor.call('pdiMachineBattery', pdiMachineId, loggedInUser, battC13CCA, battC13Volt,
                mtuG001CCA, mtuG001Volt, mtuG005CCA, mtuG005Volt, mtuG004CCA, mtuG004Volt);
        },

        'submit .afterPdiFuel': (event) => {
            event.preventDefault();
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
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

            }
        }

    });

Meteor.saveFile = function(blob, name, path, typeFile, callback) {
    const openFailure = Session.get('openFailure');
    const selectedPdiMachineId = Session.get('selectedPdiMachineId');
    let fileReader = new FileReader(),
        method, encoding = 'binary', type = typeFile || 'binary';
    switch (type) {
        case 'text':
            // Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
            method = 'readAsText';
            encoding = 'utf8';
            break;
        case 'binary':
            method = 'readAsBinaryString';
            encoding = 'binary';
            break;
        default:
            method = 'readAsBinaryString';
            encoding = 'binary';
            break;
    }
    fileReader.onload = function(file) {
        Meteor.call('saveFile', file.target.result, name, path, encoding, openFailure, selectedPdiMachineId, callback);
    };
    fileReader[method](blob);
    Session.set('openFailure', '');
};



Handlebars.registerHelper('inActive_Input', () => {
    let inActiveState = Session.get('componentChosen');
    if(inActiveState === 0) {
        return 'in-active-button';
    }
});



