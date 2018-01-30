if (Meteor.isClient) {

    Meteor.subscribe("overView");
    Meteor.subscribe("MachineReady");

    Template.overViewList.helpers({
        overView: function() {
          return MachineReady.find({machineId: {$gt: 'C00000'}, $or: [{shipStatus: 0},
               {shipStatus: 2}]}, {sort: {date: 1}});

        }
    });

    Template.headerList.helpers({
        overView: function() {
            return MachineReady.find( {newHeadId: {$gt:'00'}, $or: [{shipStatus: 0},
              {shipStatus: 2}]}, {sort: {date: 1}});
        }
    });
    
}





