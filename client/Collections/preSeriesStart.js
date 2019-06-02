Meteor.subscribe('preSeriesMachine');

Template.preInspection.helpers({

   preCheckList: () => {
       resultArray = [];
       try {
        let resultStep1 = preSeriesMachine.find({}, {sort: {preMachineId: 1}}).fetch();
            if (resultStep1 !== []) {
            } else {
                let arrayLength = resultStep1.length;
                for (let i = 0; i <= arrayLength; i++) {
                    let _id = resultStep1[i]._id;
                    let newIssuesLength = resultStep1[i].newIssues.length;
                    let checkPointCount = resultStep1[i].checkItems.length;
                    let machineNumber = resultStep1[i].preMachineId;
                    let pdiStatusId = resultStep1[i].pdiStatus;
                    let configStatusId = resultStep1[i].configStatus;
                    let checkItemIssue = 0;
                        for (let k = 1; k <= checkPointCount; k++) {
                            try {
                                if (resultStep1[i].checkItems[k].failureStatus === 2) {
                                    checkItemIssue++;
                                }
                            } catch (e) {}
                        }
                    let result= ({
                                  _id : _id,
                                  machineNumber : machineNumber,
                                  pdiStatusId : pdiStatusId,
                                  configStatusId : configStatusId,
                                  newIssueCount : newIssuesLength,
                                  checkPointCount : checkPointCount,
                                  checkItemIssue : checkItemIssue
                            });
                    resultArray.push(result);
                }
            }
       } catch (e) {
           console.log(e);
       }
           return resultArray;
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

    'click .joinPreCheck': (e) => {
        e.preventDefault();
        const preMachine = Session.get('selectedPreMachine');
    //    Meteor.call('joinPreCheck', preMachine);
        FlowRouter.go('preSeriesInspect');
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
       Meteor.call('prepareCheckList', user, selectedPreMachine, dateStart);
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

