Meteor.subscribe("preSeriesCheck");


Template.checkListOverView.helpers({

    listOutput: () => {
        const result = preSeriesCheck.find().fetch();
        console.log(result);
        return result;
    }

});

