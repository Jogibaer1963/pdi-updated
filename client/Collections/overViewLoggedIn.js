if (Meteor.isClient) {

    Meteor.subscribe("overView");
    Meteor.subscribe("MachineReady");

    Template.overViewLoggedIn.helpers({

       machineOverView: function() {
          return MachineReady.find({machineId: {$gt: 'C00000'}, $or: [{shipStatus: 0},
               {shipStatus: 2}]}, {sort: {date: 1}, limit: 20});

        },

        headerOverView: function() {
            return MachineReady.find( {newHeadId: {$gt:'00'}, $or: [{shipStatus: 0},
              {shipStatus: 2}]}, {sort: {date: 1}});
        }
    });
    
}





