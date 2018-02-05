
if(Meteor.isClient) {


    Template.inspection.helpers({

         shipList: function () {
           Session.set('selectedPdiMachine', '');
         // Order of shipping date
           return MachineReady.find({$or:[{pdiStatus: 0},{pdiStatus: 2}]}, {sort: {date: 1}},
                {machineId: 1, date: 1, shippingComment: 1, pdiStatus: 1, washStatus: 1});
         },
        
        'selectedClass': function(){
            const openInspect = this._id;
            const selectedPdiMachine = Session.get('selectedPdiMachine');
            if (selectedPdiMachine === openInspect) {
                return "selected";
                  }
        },

        countPdi: function() {
            return MachineReady.find({$or:[{pdiStatus: 0},{pdiStatus: 2}]}, {sort: {date: 1}}) .count();
        },

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
        });

    Template.inspection.events({

        'click .openInspections': function() {
           const openInspect = this._id;
        // localStorage.setItem('selectedPdi', openInspect);
            Session.set('selectedPdiMachine', openInspect);

            const machineId = MachineReady.findOne({_id: openInspect}).machineId;

         // localStorage.setItem('pdiMachine', machineId);
            Session.set('pdiMachineNumber', machineId);
       //   Session.setPersistent('currentLoggedInUser', user);
        },

        'click .machinePdi': function() {
            event.preventDefault();
            const user = Meteor.user().username;
            const selectedPdiMachineId = Session.get('selectedPdiMachine');
            const selectedPdiMachineNr = Session.get('pdiMachineNumber');
            localStorage.setItem('pdiMachineNr', selectedPdiMachineNr);
            localStorage.setItem('pdiMachineId', selectedPdiMachineId);
            const firstRange =  JSON.stringify(selectedPdiMachineNr).slice(1,4);
            const range = [];
            range.push(firstRange);
            const dateStart = new Date().toLocaleDateString();
            Meteor.call('generatePdiList', selectedPdiMachineId, selectedPdiMachineNr, dateStart,
              user, range);
            FlowRouter.go('machineInspect');
        },

        // Button Cancel PDI as long pdi is not finished

        'click .cancelPdiProcess': function() {
            event.preventDefault();
            const pdiMachineId = Session.get('selectedPdiMachine');
            Meteor.call('cancelPdi', pdiMachineId);
            Session.set('selectedProfiCam', '');
            Session.set('selectedTeraTrackOm', '');
            Session.set('selectedCemosOm', '');
            Session.set('selectedUnloadOm', '');
            Session.set('selectedSuppOm', '');
            Session.set('selectedMainOm', '');
        },
        
        'click .machineSkipPdi': function() {
            event.preventDefault();
            const pdiMachineId = Session.get('selectedPdiMachine');
            Meteor.call('skipPdi', pdiMachineId);
        },

        'click .resumePdi': function() {
            event.preventDefault();
            FlowRouter.go('machineInspect_2');
        }

    });


    Handlebars.registerHelper('inActive', function() {
        const inActiveStatus = Session.get('inActiveState');
        if(inActiveStatus === 0) {
            return 'inActiveButton';
        }
    });
        
}




