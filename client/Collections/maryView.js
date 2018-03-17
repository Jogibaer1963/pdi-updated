
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

        'click .addTruck': function() {
            event.preventDefault();
           const truckStatus = 1;
           const machineId = Session.get('selectedMachineId');
            Meteor.call('truckOrdered', machineId, truckStatus);
        },

        'click .removeTruck': function() {
            event.preventDefault();
           const truckStatus = 0;
           const machineId = Session.get('selectedMachineId');
            Meteor.call('truckRemoved', machineId, truckStatus);
        },

        'click .addList': function() {
            event.preventDefault();
            const KitStatus = 1;
            const machineId = Session.get('selectedMachineId');
            Meteor.call('listPrinted', machineId, KitStatus);
        },

        'click .removeList': function() {
            event.preventDefault();
            const KitStatus = 0;
            const machineId = Session.get('selectedMachineId');
            Meteor.call('listRemoved', machineId, KitStatus);
        },

        'submit .machine': function (event) {
            event.preventDefault();
            let machine = event.target.machine.value;
            event.target.machine.value='';
            Session.set('machineFound', machine);
        }


    });


    Template.headerListMaryView.helpers({
        overView: function() {
            return MachineReady.find( {headId: {$gt:'00'}, $or: [{shipStatus: 0},{shipStatus: 2}]},
                {sort: {date: 1}});
        }
    });

    


