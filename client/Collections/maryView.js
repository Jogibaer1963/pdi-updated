
    Template.overViewListMaryView.helpers({

       overView: function() {
           return MachineReady.find({
               machineId: {$gt: 'C00000'}, $or: [{shipStatus: 0},
                   {shipStatus: 2}]}, {sort: {date: 1}}).fetch();
       },

        'selectedClass2': function(){
           const selectedTruck = this._id;
           const selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId === selectedTruck) {
                return "selected"
            }
        },

        maryViewMachine: function() {
            let machine = Session.get('machineFound');
            console.log(machine);
            if (machine === undefined) {
            } else {
                return MachineReady.find({machineId: machine});
            }
        }
    });


    Template.overViewListMaryView.events({


        'click .truckStatus': function() {
           const openRepair = this._id;
            Session.set('selectedMachineId', openRepair);
        },



        'submit .machine': function (event) {
            event.preventDefault();
            let machine = event.target.machine.value;
            event.target.machine.value='';
            Session.set('machineFound', machine);
        }


    });


    


