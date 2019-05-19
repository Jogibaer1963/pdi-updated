Meteor.subscribe('preSeriesMachine');

Template.preInspection.helpers({

   preCheckList: () => {
       return preSeriesMachine.find({}, {sort: {preMachineId: 1}}).fetch();
   },

    countPreCheck: () => {
      return preSeriesMachine.find().count();
    },

    'selectedClass': function(){
        const openInspect = this._id;
        const selectedPreMachine = Session.get('selectedPreMachine');
        if (selectedPreMachine === openInspect) {
            localStorage.setItem('preMachineNr', selectedPreMachine);
            return "selected";
        }
    },

});



Template.preInspection.events({

    'click .openPreInspect': function () {
        const checkPoint = this._id;
        Session.set('selectedPreMachine', checkPoint);
    },

    'click .cancelPreCheck': (e) => {
        e.preventDefault();
        const preMachine = Session.get('selectedPreMachine');
        Meteor.call('cancelPreCheck', preMachine);
    },

   'submit .submitPre': (e) => {
       e.preventDefault();
       let preMachine = e.target.preMachine.value;
       Meteor.call('enterPreMachine', preMachine);
       e.target.preMachine.value = '';
   },

    'click .startCheck': (e) => {
       e.preventDefault();
       const user = Meteor.user().username;
       const selectedPreMachine = Session.get('selectedPreMachine');
       localStorage.setItem('preMachineNr', selectedPreMachine);
       const dateStart = new Date();
    //   Meteor.call('prepareCheckList', user, selectedPreMachine, dateStart);
       FlowRouter.go('preSeriesInspect');

    },

    'change .loadConfig': (e) => {
        e.preventDefault();
        const singleConfig = [];
        let i = 0;
        let k = 11;
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            let configLength = contents.length;
            const machineId = contents.slice(5, 13);
            let searchString = contents.search("000;");
            let config = contents.slice(searchString + 4, configLength);
            let trimConfig = config.replace(/\s+/g, '').trim();
            const newConfig = (trimConfig.length) / 12;
            for (j = 0; j < newConfig; j++) {
                singleConfig[j] = (trimConfig.substr(i, k).trim()).replace(';', '_');
                i = i + 12;
            }
            singleConfig.sort();
            Meteor.call('readPreConfig', machineId, singleConfig);
        };
        reader.readAsText(file);
    },
});

