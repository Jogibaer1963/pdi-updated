if (Meteor.isClient) {

        Template.reviewList.helpers({
            reviewMachine: function() {
                event.preventDefault();
               return  MachineReady.find({ _id: "NL7QP97zbG3yMZndd"});
            }
        })
}

