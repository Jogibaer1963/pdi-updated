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

    listOutput: () => {
        const selectedPreMachineId = Session.get('selectedPreMachine');
        let checkResult = {} ;
        try {
            const result = preSeriesMachine.findOne({_id: selectedPreMachineId},
                                                    {fields: {checkItems: 1}}).checkItems;
            let path1= "http://192.168.0.109:3300/images/";
            return resultArray = result.map(resultExtract => {
                    checkResult = {id : resultExtract._id,
                            active: resultExtract.activeStatus,
                            failure: resultExtract.failureStatus,
                            imagePath : path1 + resultExtract.imagePath,
                            position : resultExtract.position,
                            issue : resultExtract.issueDescription};
                    return checkResult;
            });
                   }
            catch (e) {
            }
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

});


Template.preCheckToDoList.events({

    'click .PreOk': (e) => {
        e.preventDefault();
        const user = Meteor.user().username;
        const selectedPreMachineId = Session.get('selectedPreMachine');
        let target = e.currentTarget.id;
        let result = false;
        Meteor.call('preCheckNok',selectedPreMachineId, target, result, user);
    },

    'click .PreNok': (e) => {
        e.preventDefault();
        const user = Meteor.user().username;
        const selectedPreMachineId = Session.get('selectedPreMachine');
        let target =e.currentTarget.id;
        let result = true;
        Meteor.call('preCheckNok',selectedPreMachineId, target, result, user);
    }

});


