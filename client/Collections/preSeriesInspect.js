Meteor.subscribe('preSeriesMachine');


Template.preCheckToDoList.helpers({



    'preMachineNow': () => {
        const user = Meteor.user().username;
        Session.set('currentLoggedInUser', user);
        Session.set('selectedPreMachine', localStorage.getItem('preMachineNr'));
        const selectedPreMachineId = Session.get('selectedPreMachine');
        try {
            let result = preSeriesMachine.findOne({_id: selectedPreMachineId},
                                                  {fields: {preMachineId: 1}}).preMachineId;
            Session.set('preMachineNr', result);
            return {machine: result, userLoggedIn: user};
        }
        catch (err) {
        }
    },

    preMachineConfig: () => {
          const selectedPreMachineId = Session.get('selectedPreMachine');
          try {
               return preSeriesMachine.findOne({_id: selectedPreMachineId}).machineConfig;
          }
          catch (e) {
          }
    },

    countDown: () => {
        const selectedPreMachineId = Session.get('selectedPreMachine');
        try {
           return preSeriesMachine.findOne({_id: selectedPreMachineId},
                {fields: {progressBar: 1}}).progressBar;
        } catch (e) {
        }

     },

    listOutput: () => {
        const selectedPreMachineId = Session.get('selectedPreMachine');
        let checkResult = {} ;
        try {
            const result = preSeriesMachine.findOne({_id: selectedPreMachineId},
                                                    {fields: {checkItems: 1}}).checkItems;
            let path1= "http://192.168.0.103:3300/images/";
            return resultArray = result.map(resultExtract => {
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

    //---------------  Drop down main components ---------------------

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
            const machineId = Session.get('selectedPreMachine');
            return preSeriesMachine.findOne({_id: machineId}).newIssues;
        } catch (e) {
        }
    },

    'selectedPreFailure': function(){
        const failure = this._id;
        const selectedFailure = Session.get('openPreFailure');
        if (failure === selectedFailure) {
            return "selected";
        }
    },

});


Template.preCheckToDoList.events({

    'click .configButtonOK': (e) => {
        e.preventDefault();
        const machineId = Session.get('selectedPreMachine');
        let target = e.currentTarget.id;
        let result = 1;
        Meteor.call('configPreResult',machineId, target, result);
    },

    'click .configButtonNOK': (e) => {
        e.preventDefault();
        const machineId = Session.get('selectedPreMachine');
        let target = e.currentTarget.id;
        let result = 2;
        Meteor.call('configPreResult',machineId, target, result);
    },


    'click .PreOk': (e) => {
        e.preventDefault();
        const user = Meteor.user().username;
        const selectedPreMachineId = Session.get('selectedPreMachine');
        let target = e.currentTarget.id;
        let result = 1;
        Meteor.call('preCheckNok',selectedPreMachineId, target, result, user);
    },

    'click .PreNok': (e) => {
        e.preventDefault();
        const user = Meteor.user().username;
        const selectedPreMachineId = Session.get('selectedPreMachine');
        let target =e.currentTarget.id;
        let result = 2;
        Meteor.call('preCheckNok',selectedPreMachineId, target, result, user);
    },

    'click .preComp': function () {
        const selected = this._id;
        let textMainComp = this.component;
        Session.set('selectedComponent', selected);
        Session.set('issueComp', textMainComp + ' - ');
    },

    'submit .addressToRepair': (e) => {
        e.preventDefault();
        const selectedPreMachineId = Session.get('selectedPreMachine');
        let message = e.currentTarget.addMessage.value;
        let target = e.currentTarget.id;
        Meteor.call('addMessageToPic',selectedPreMachineId, target, message);
    },

    'submit .addNewIssue': (e) => {
        e.preventDefault();
        const selectedPdiMachineId = Session.get('selectedPreMachine');
        let addNewFailure = e.target.addIssue.value;
            Meteor.call('addNewPreFailure', selectedPdiMachineId, addNewFailure);
        e.target.addIssue.value = '';
        Session.set('componentChosen', 0);
        Session.set('selectedComponent', '');
        Session.set('issueComp', '');
    },

    'click .openPreFailure': function () {
        const openFailure = this._id;
        Session.set('openPreFailure', openFailure);
    },

    'click .deletePreRepair': () => {
        event.preventDefault();
        const selectedPdiMachineId = Session.get('selectedPreMachine');
        const openFailure = Session.get('openPreFailure');
        if(selectedPdiMachineId) {
            Meteor.call('removePreFailure', selectedPdiMachineId, openFailure);
        } else {
            console.log('Lost Machine Number');
        }
    },

    'click .finished': (e) => {
        e.preventDefault();
        const selectedId = Session.get('selectedPreMachine');
        Meteor.call('preSeriesFinished', selectedId);
        FlowRouter.go('/preSeriesStart');

     }

});


