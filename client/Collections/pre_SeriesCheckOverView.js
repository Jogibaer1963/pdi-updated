Meteor.subscribe("preSeriesCheck");
Meteor.subscribe("images");


Template.checkListOverView.helpers({

    listOutput: () => {
        const result = images.find().fetch();
        let path1= "http://192.168.0.109:3300/images/C8500013/";
        let resultArray = result.map(imagePathExtract => {
             let newPath = path1 + imagePathExtract.imagePath;
             console.log(newPath);
             return newPath;
        });
        console.log(resultArray);
        return resultArray;

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