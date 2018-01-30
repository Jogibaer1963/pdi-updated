
if(Meteor.isClient) {


    Template.openPdi.helpers({

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


    Template.inspection.helpers({
         shippList: function () {
           Session.set('selectedPdiMachine', '');
         // Order of shipping date
              return MachineReady.find({$or:[{pdiStatus: 0},{pdiStatus: 2}]}, {sort: {date: 1}});
            },
        
        'selectedClass': function(){
            const openInspect = this._id;
            const selectedPdiMachine = Session.get('selectedPdiMachine');
            if (selectedPdiMachine === openInspect) {
                return "selected_2"
                  }
             }
        });

    Template.inspection.events({
        'click .openInspections': function() {
            const openInspect = this._id;
            localStorage.setItem('selectedPdi', openInspect);
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            const machineId = MachineReady.findOne({_id: openInspect}).machineId;
            localStorage.setItem('pdiMachine', machineId);
            Session.set('pdiMachineNumber', localStorage.getItem('pdiMachine'));
            const user = Meteor.user().username;
            Session.setPersistent('currentLoggedInUser', user);
            },

        'click .machinePdi': function() {
            event.preventDefault();
            const selectedPdiMachineId = Session.get('selectedPdiMachine');
            const selectedPdiMachineNr = Session.get('pdiMachineNumber');
            const firstRange =  JSON.stringify(selectedPdiMachineNr).slice(1,4);
            const range = [];
            range.push(firstRange);
            console.log(range);
            const dateStart = Date.now();
          Meteor.call('generatePdiList', selectedPdiMachineId, dateStart, selectedPdiMachineNr,
                range);
            FlowRouter.go('machineInspect');
        },

        'click .stopPdiProcess': function() {
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
        },
        
        'submit .locationId': function(event) {
            event.preventDefault();
            const selectedPdiMachine = Session.get('selectedPdiMachine');
            if(typeof selectedPdiMachine === 'undefined') {
                alert('Mark the Machine first before update the Location');
            }
            const locationId = event.target.locationId.value;
            Meteor.call('locationUpdate', selectedPdiMachine, locationId);
            event.target.locationId.value="";
            Session.set('selectedPdiMachine', '');
        },
        
        'submit .reservedId': function(event) {
            event.preventDefault();
            const selectedPdiMachine = Session.get('selectedPdiMachine');
            if(typeof selectedPdiMachine === 'undefined') {
                alert('Mark the Machine first before you reserve');
            }
            const reservedId = event.target.reservedId.value;
            Meteor.call('reserveUpdate', selectedPdiMachine, reservedId);
            event.target.reservedId.value="";
            Session.set('selectedPdiMachine', '');
            
        }

    });


    Template.inspectionHeads.helpers({
        shippList: function () {
            Session.set('selectedPdiMachine', '');
            // Order of shipping date
            return MachineReady.find({$or: [{pdiStatus: 0}, {pdiStatus: 2}]}, {sort: {date: 1}});
        }
    });

    Handlebars.registerHelper('inActive', function() {
        const inActiveStatus = Session.get('inActiveState');
        if(inActiveStatus === 0) {
            return 'inActiveButton';
        }
    });
        
}




