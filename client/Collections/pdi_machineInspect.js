
Meteor.subscribe("pdiCheckList");
Meteor.subscribe("orderParts");


    Template.pdiToDoList.helpers({


        'machineNow': function () {
            const user = Meteor.user().username;
            Session.set('currentLoggedInUser', user);
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const selectedPdiMachineNr = Session.get('selectedPdiMachineNr');
            return {machine: selectedPdiMachineNr, userLoggedIn: user};
        },

        selectedProfiCam: function() {
            return Session.get('selectedProfiCam');
        },


        checkList: function() {
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const machineId = Session.get('selectedPdiMachineNr');
            result = MachineReady.findOne({machineId: machineId}).checkList;
            return result;
        },

        machineConfig: function() {
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const machineId = Session.get('selectedPdiMachineNr');
            result = MachineReady.findOne({machineId: machineId}).machineConfig;
            return result;
        },

        'selectedFailure': function(){
           const failure = this._id;
           const selectedFailure = Session.get('openFailure');
           if (failure === selectedFailure) {
               return "selected";
           }
        },

        newIssue: function() {
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const machineId = Session.get('selectedPdiMachineNr');
            result = MachineReady.findOne({machineId: machineId}).newIssues;
            return result;
        },

        battSaved: function() {
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const machineId = Session.get('selectedPdiMachineNr');
            result = MachineReady.findOne({machineId: machineId}).batteries;
            if(result) {
                return "Battery successfull saved";
            } else {
                return "Error, Battery not saved";
            }
        },

        ommSaved: function() {
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const machineId = Session.get('selectedPdiMachineNr');
            result = MachineReady.findOne({machineId: machineId}).omms;
            if(result) {
                return "OMM's successfull saved";
            } else {
                return "Error, OMM not saved";
            }
        }


    });


    Template.pdiToDoList.events({


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

        'click .openFailure': function () {
            const openFailure = this._id;
            Session.set('openFailure', openFailure);
        },

        'click .deleteRepair': () => {
            event.preventDefault();
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

        'submit .afterPdiFuel': (event) => {
            event.preventDefault();
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
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



