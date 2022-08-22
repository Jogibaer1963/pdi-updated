
Meteor.subscribe('oms');


    Template.pdiToDoList.helpers({

        'machineNow': function () {
            const user = Meteor.user().username;
            Session.set('currentLoggedInUser', user);
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const selectedPdiMachineNr = Session.get('selectedPdiMachineNr');
            try {
                let coAuditor = MachineReady.findOne({machineId: selectedPdiMachineNr}).coAuditor
                return {machine: selectedPdiMachineNr, userLoggedIn: user, coAuditor: coAuditor};
            } catch {}

        },

        teamList: () => {
            return TeamList.find().fetch();
        },

        machineConfig: function() {
            try {
                Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
                const machineId = Session.get('selectedPdiMachineNr');
                return MachineReady.findOne({machineId: machineId}).machineConfig;
            } catch (e) {
            }
        },

        reConfigList: function() {
            try {
                Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
                const machineId = Session.get('selectedPdiMachineNr');
                return MachineReady.findOne({machineId: machineId}).reConfigArray;
            } catch (e) {
            }
        },

        checkList: function() {
            try {
                Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
                const machineId = Session.get('selectedPdiMachineNr');
                return MachineReady.findOne({machineId: machineId}).checkList;
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
                    return "OMM's successfully saved";
                } else {
                    return "Error, OMM not saved";
                }
            } catch (e) {
            }
        },
/*
        fuelStart: () => {
            try {
                return Session.get('omms').fuelStart;
            } catch (e) {}
        },

 */

        ommMain: () => {
            try {
                return Session.get('omms').ommMain;
            } catch (e) {}
        },
/*
        ommSupp: () => {
            try {
                return Session.get('omms').ommSupp;
            } catch (e) {}
        },

 */

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

        ommTerra: () => {
            try {
                return Session.get('omms').ommTerra;
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
                newIssuesFound.forEach((element) => {
                    element.pictureLocation = repairInfos + element.pictureLocation;
                });
                return newIssuesFound;
            } catch {}
        },

        'click .openFailure': function (e) {
            e.preventDefault();
            const confirmRepair = this._id;
            console.log(confirmRepair);
            Session.set('confirmRepair', confirmRepair);
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
/*
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


 */
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
/*
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

 */

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
         //   const fuelMe = event.target.fuelMe.value;
            const ommMain = event.target.omMain.value;
        //    const ommSupp = "N/A" // event.target.omSupp.value;
            const ommUnload = event.target.omUnload.value;
            const ommProfiCam = event.target.omProfiCam.value;
            const ommCebis = event.target.omCebis.value;
            const ommTerra = event.target.omTerra.value;
            Meteor.call('pdiMachineOmm', pdiMachineId, loggedInUser, ommMain,
                ommUnload,ommProfiCam, ommCebis, ommTerra);
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
            let configInfos = Session.get('configInfos');
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            const selectedPdiMachineId = Session.get('selectedPdiMachineId');
            let imagePathId = event.currentTarget.name;
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
            let errorDescription = event.target.name;
            if(selectedPdiMachineId) {
                Meteor.call('nokButton', selectedPdiMachineId, idFailure, errorDescription);
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

        'click .pdi-estimate': (e) => {
            e.preventDefault();
            const selectedPdiMachineId = Session.get('selectedPdiMachineId');
            const openFailure = Session.get('openFailure');
            if(selectedPdiMachineId) {
                Meteor.call('pdiEstimate', selectedPdiMachineId, openFailure);
            } else {
                console.log('Lost Machine Number');
            }
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

        'submit .addNewIssue': function(e) {
            e.preventDefault();
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            const selectedPdiMachineId = Session.get('selectedPdiMachineId');
            let addNewFailure = e.target.addIssue.value;
            if(selectedPdiMachineId) {
                Meteor.call('addNewFailure', selectedPdiMachineId, addNewFailure);
            } else {
                console.log("Lost Machine Number")
            }
            e.target.addIssue.value = '';
            Session.set('componentChosen', 0);
            Session.set('selectedComponent', '');
            Session.set('issueComp', '');
        },

        'change input': function(ev) {
            const openFailure = Session.get('openFailure');
            if(openFailure) {
                _.each(ev.target.files, function(file) {
                    Meteor.saveFile(file, file.name);
                });
            } else {
            }
        },

        'click .machineInspect': function (e) {
            e.preventDefault();
            let failureId = this._id;
            Session.set('newIssueId', failureId);
        },


        'change  #category-select': function (e) {
            e.preventDefault();
            const selectedTeam = $(e.currentTarget).val();
            let issueId = Session.get('newIssueId');
            let machineId = Session.get('selectedPdiMachineId');
            if (issueId !== 'undefined' && selectedTeam !== 'undefined') {
                Meteor.call('choseTeam', selectedTeam, issueId, machineId)
            }
            Session.set('failureId', '');
        },


        'submit .pdiRepairConfirmText': function (e) {
            e.preventDefault();
            const repairUser = Meteor.user().username;
            const repairComment = e.target.message.value;
            const repairTime = e.target.repTime.value;
            let repairId = Session.get('openFailure');
            let machineId = Session.get('selectedPdiMachineId');
            console.log(repairId, repairUser, repairComment, repairTime, machineId)
            Meteor.call('confirmRepair', repairId, repairUser, repairComment, repairTime, machineId);
            e.target.message.value = '';
            e.target.repTime.value = '';
        },


        'submit .addressToWashBay': function(e) {
            e.preventDefault();
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
            e.target.addWashBay.value = '';
        },

        'submit .batts': function(e)  {
            e.preventDefault();
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            const loggedInUser = Session.get('currentLoggedInUser');
            const pdiMachineId = Session.get('selectedPdiMachineId');
          //  const battC13CCA = e.target.batteryC13CCA.value;
           // const battC13Volt = e.target.batteryC13Volt.value;
            const mtuG001CCA = e.target.mtuG001CCA.value;
            const mtuG001Volt = e.target.mtuG001Volt.value;
          //  const mtuG005CCA = e.target.mtuG005CCA.value;
          //  const mtuG005Volt = e.target.mtuG005Volt.value;
            const mtuG004CCA = e.target.mtuG004CCA.value;
            const mtuG004Volt = e.target.mtuG004Volt.value;
            Meteor.call('pdiMachineBattery', pdiMachineId, loggedInUser,
                mtuG001CCA, mtuG001Volt, mtuG004CCA, mtuG004Volt);
        },

        'submit .afterPdiFuel': (event) => {
            event.preventDefault();
            Session.set('selectedPdiMachineId', localStorage.getItem('pdiMachineId'));
            Session.set('selectedPdiMachineNr', localStorage.getItem('pdiMachineNr'));
            const selectedPdiMachineId = Session.get('selectedPdiMachineId');
            const selectedPdiMachineNr = Session.get('selectedPdiMachineNr');
        //    let fuelAfter = event.target.afterFuel.value;
            let k = 0;
            if(selectedPdiMachineId) {
               let result =  MachineReady.findOne({_id: selectedPdiMachineId},
                                                        {fields: {newIssues: 1, omms: 1, batteries: 1}});
               try {
                   if (result.omms === undefined) {
                      k = 1;
                      console.log('omms', k)
                   }
                    result.newIssues.forEach((element) => {
                        if (element.responsible === '') {
                           k = 1;
                           console.log('new Issue', k)
                        }
                    })
                   if (result.batteries === undefined) {
                       k = 1;
                       console.log('batteries', k, result.batteries)
                   }
               } catch(e) {
                      }
            } else {
           //     console.log("Lost Machine Number")
            }
            if (k === 0) {
                Meteor.call('fuelAfterPdi', selectedPdiMachineId, selectedPdiMachineNr);
                FlowRouter.go('/inspectionStart');
            } else if (k === 1) {
                window.alert('One or more Issues were not assigned to a Team or Omms are not saved')
            }
        }



    });





