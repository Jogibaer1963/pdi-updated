


    Meteor.subscribe("machineReadyToGo_2016");

    Template.searchMe.events({
        "submit .searchMachine": function (event) {
            event.preventDefault();
            const findMachine = event.target.searchId.value;
            Session.set('findMachine', findMachine);
            event.target.searchId.value = '';
           
        }
    });


    Template.searchMe.helpers({
        machineSearchShow: function() {
            const findMachine = Session.get('findMachine');
            if(findMachine === undefined) {
            } else {
            return MachineReady.find({machineId: findMachine}).fetch();
            }
        }


    });


