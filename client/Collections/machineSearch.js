/**
 * Created by Jogibaer on 07.06.2016.
 */
if (Meteor.isClient) {

    Meteor.subscribe("machineReadyToGo_2016");

    Template.machineSearch.events({
        "submit .searchMachine": function (event) {
            event.preventDefault();
            const findMachine = event.target.searchId.value;
            Session.set('findMachine', findMachine);
           
        }
    });


    Template.machineSearch.helpers({
        machineSearchShow: function() {
            event.preventDefault();
            const findMachine = Session.get('findMachine');
            if(findMachine === undefined) {
            } else {
            let result = MachineReady.find({machineId: findMachine}).fetch();
            if (result.length === 0) {
                return MachineReady_2016.find({machineId: findMachine}).fetch();
                }
              return result;
            }
        }


    });


}