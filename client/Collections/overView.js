if (Meteor.isClient) {

    Meteor.subscribe("MachineReady");

    Template.overView.helpers({

       machineOverView: function() {
          return MachineReady.find({machineId: {$gt: 'C00000'}, $or: [{shipStatus: 0},
               {shipStatus: 2}]}, {sort: {date: -1}});

        },

        headerOverView: function() {
            return MachineReady.find( {newHeadId: {$gt:'00'}, $or: [{shipStatus: 0},
              {shipStatus: 2}]}, {sort: {date: 1}});
        }
    });
    
}





