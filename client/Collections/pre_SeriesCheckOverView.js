Meteor.subscribe("preSeriesCheck");
Meteor.subscribe("images");


Template.checkListOverView.helpers({

    listOutput: () => {
        let checkResult = {} ;
        const result = images.find().fetch();
        let path1= "http://192.168.0.109:3300/images/C8500013/";
        return resultArray = result.map(resultExtract => {
             checkResult = {active: resultExtract.activeStatus,
                            failure: resultExtract.failureStatus,
                            imagePath : path1 + resultExtract.imagePath,
                            position : resultExtract.position,
                            issue : resultExtract.issueDescription};
             return checkResult;
        });
    }

});

Template.checkListOverView.events({


   'click .submitButtonActive': (e) => {
       e.preventDefault();
       console.log('active');
   },

    'click .submitButtonInactive': (e) => {
        e.preventDefault();
        console.log('inactive');
    },

    'click .submitButtonDelete': (e) => {
        e.preventDefault();
        console.log('delete');
    }

});