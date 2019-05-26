Meteor.subscribe("preSeriesCheck");
Meteor.subscribe("images");


Template.checkListOverView.helpers({

    listOutput: () => {
        let checkResult = {} ;
        const result = images.find().fetch();
        let path1= "http://192.168.0.109:3300/images/";
        return resultArray = result.map(resultExtract => {
            let nods = "?a=" + Math.random();
             checkResult = {id : resultExtract._id,
                            active: resultExtract.activeStatus,
                            failure: resultExtract.failureStatus,
                            imagePath : path1 + resultExtract.imagePath+ nods,
                            position : resultExtract.position,
                            issue : resultExtract.issueDescription};
             return checkResult;
        });
    }

});

Template.checkListOverView.events({

    'click .submitButtonGenerate': (e) => {
        e.preventDefault();
        console.log('call Server');
        Meteor.call('generateDataBase');

    },

    'click .submitButtonEdit': (e) => {
        e.preventDefault();
        let idCheck = e.currentTarget.id;
        console.log('edit', idCheck);
    },

   'click .submitButtonActive': (e) => {
       e.preventDefault();
       let idCheck = e.currentTarget.id;
       console.log('active', idCheck);
   },

    'click .submitButtonInactive': (e) => {
        e.preventDefault();
        let idCheck = e.currentTarget.id;
        console.log('inactive', idCheck);
    },

    'click .submitButtonDelete': (e) => {
        e.preventDefault();
        let idCheck = e.currentTarget.id;
        console.log('delete', idCheck);
    }

});