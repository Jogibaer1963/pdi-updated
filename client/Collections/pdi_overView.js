
    Meteor.subscribe("fuelAverage");
    Meteor.subscribe("specialItems")
    Session.set('status', 0);


    Template.inspection.helpers({

         shipList: function () {
           Session.set('selectedPdiMachine', '');
         // Order of shipping date
             return MachineReady.find({$or:[{pdiStatus: 0},{pdiStatus: 2}]}, {sort: {date: 1}},
              {fields: {machineId: 1, date: 1, shippingComment: 1, pdiStatus: 1,
                    washStatus: 1, configStatus: 1}});
         },
        
        'selectedClass': function(){
            const openInspect = this._id;
            const selectedPdiMachine = Session.get('selectedPdiMachine');
            if (selectedPdiMachine === openInspect) {
                let status = MachineReady.findOne({_id: selectedPdiMachine}).pdiStatus;
                Session.set('status', status);
                return "selected";
                  }
        },

        countPdi: function() {
            return MachineReady.find({$or:[{pdiStatus: 0},{pdiStatus: 2}]}, {sort: {date: 1}}).count();
        },

        countPdiDone: () => {
            let result = specialItems.find({}).fetch();
            return result[0];
        },

/*
        countConsumption: function () {
            const average = fuelAverage.findOne({});
            if(average === undefined) {
            } else {
                const sum = average.consumption.reduce(function (acc, val) {
                    return acc + val
                }, 0);
                return number = (sum / average.consumption.length).toFixed(2);
            }
        }

 */





        });

    Template.inspection.events({

        'click .openInspections': function () {
            const openInspect = this._id;
            // localStorage.setItem('selectedPdi', openInspect);
            Session.set('selectedPdiMachine', openInspect);

            const machineId = MachineReady.findOne({_id: openInspect}).machineId;

            // localStorage.setItem('pdiMachine', machineId);
            Session.set('pdiMachineNumber', machineId);
            //   Session.setPersistent('currentLoggedInUser', user);
        },

        'click .machinePdi': function (e) {
            e.preventDefault();
            const user = Meteor.user().username;
            const selectedPdiMachineId = Session.get('selectedPdiMachine');
            const selectedPdiMachineNr = Session.get('pdiMachineNumber');
            localStorage.setItem('pdiMachineNr', selectedPdiMachineNr);
            localStorage.setItem('pdiMachineId', selectedPdiMachineId);
            const firstRange = JSON.stringify(selectedPdiMachineNr).slice(1, 4);
            const range = [];
            range.push(firstRange);
            const dateStart = new Date();
            Meteor.call('generatePdiList', selectedPdiMachineId, selectedPdiMachineNr, dateStart,
                user, range);
            Session.set('inActiveState', 1);
            FlowRouter.go('machineInspect');
        },

        // Button Cancel PDI until pdi is not finished

        'click .cancelPdiProcess': function (e) {
            e.preventDefault();
            const pdiMachineId = Session.get('selectedPdiMachine');
            localStorage.removeItem('pdiMachineId');
            localStorage.removeItem('pdiMachineNr');
            Meteor.call('cancelPdi', pdiMachineId);
            Session.set('selectedProfiCam', '');
            Session.set('selectedTeraTrackOm', '');
            Session.set('selectedCemosOm', '');
            Session.set('selectedUnloadOm', '');
            Session.set('selectedSuppOm', '');
            Session.set('selectedMainOm', '');
        },

        'click .machineSkipPdi': function (e) {
            e.preventDefault();
            const user = Meteor.user().username;
            const pdiMachineId = Session.get('selectedPdiMachine');
            Meteor.call('skipPdi', pdiMachineId, user);
        },

        'click .resumePdi': function (e) {
            e.preventDefault();
            const pdiMachineId = Session.get('selectedPdiMachine');
            localStorage.setItem('joinMachine', pdiMachineId);
            FlowRouter.go('joinMachine');
        },

        'click .addIssueButton': (e) => {
          e.preventDefault();
          FlowRouter.go('addIssueToPdi');
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
                for (let j = 0; j < newConfig; j++) {
                        singleConfig[j] = (trimConfig.substr(i, k).trim()).replace(';', '_');
                        i = i + 12;
                }
                    singleConfig.sort();
                    Meteor.call('readConfig', machineId, singleConfig);
                };
            reader.readAsText(file);
        },
    });


Template.goal.events({

   'submit .weeklyGoal': function(e) {
       e.preventDefault();
       let goal = e.target.setNewGoal.value;
       Meteor.call('setGoal', goal);
   }

});


