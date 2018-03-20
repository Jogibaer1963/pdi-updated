

if(Meteor.isClient) {


    Template.ommBook.helpers({


        'machineNow': function () {
            event.preventDefault();
            const user = Meteor.user().username;
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const selectedPdiMachineNr = Session.get('selectedPdiMachineNr');
            return {machine: selectedPdiMachineNr, userLoggedIn: user};
        },


        selectedProfiCam: function() {
            event.preventDefault();
            return Session.get('selectedProfiCam');
        },


        checkList: function() {
            event.preventDefault();
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const machineId = Session.get('selectedPdiMachineNr');
            result = MachineReady.findOne({machineId: machineId}).checkList;
            return result;
        },

        machineConfig: function() {
            event.preventDefault();
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
            event.preventDefault();
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const machineId = Session.get('selectedPdiMachineNr');
            result = MachineReady.findOne({machineId: machineId}).newIssues;
            return result;
        },





    });


    Template.ommBook.events({


        'submit .omBooklets': function (event) {
            event.preventDefault();
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            const loggedInUser = Session.get('currentLoggedInUser');
            const pdiMachineId = Session.get('selectedPdiMachine');
            const fuelMe = event.target.fuelMe.value;
            Session.set('fuelBeforePdi', fuelMe);
            const ommMain = event.target.omMain.value;
            const ommSupp = event.target.omSupp.value;
            const ommFitting = event.target.omUnload.value;
            const ommCebis = event.target.omCebis.value;
            const ommTerra = event.target.omTerra.value;
            const ommProfiCam = event.target.omProfiCam.value;
            Meteor.call('pdiMachineInspected', pdiMachineId, loggedInUser, fuelMe, ommMain, ommSupp,
                ommFitting, ommTerra, ommCebis, ommProfiCam);
            Session.set('selectedProfiCam', '');
            Session.set('selectedTeraTrackOm', '');
            Session.set('selectedCemosOm', '');
            Session.set('selectedUnloadOm', '');
            Session.set('selectedSuppOm', '');
            Session.set('selectedMainOm', '');
            event.target.fuelMe.value = '';
            event.target.omMain.value = '';
            event.target.omSupp.value = '';
            event.target.omUnload.value = '';
            event.target.omCebis.value = '';
            event.target.omTerra.value = '';
            event.target.omProfiCam.value = '';
          //  FlowRouter.go('machineInspect_2');
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
            if(selectedPdiMachineId) {
                Meteor.call('configNokButton', selectedPdiMachineId, idFailure);
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
        }
    });

}

