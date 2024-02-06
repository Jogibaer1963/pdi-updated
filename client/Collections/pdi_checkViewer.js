Meteor.subscribe('images');
Meteor.subscribe('preSeriesChecklist');

Template.checkViewer.helpers({

    preCheckList: () => {
        const result = preSeriesChecklist.find().fetch();
        console.log(result);
        let picPath = result[0].picPath;
        console.log(picPath);
    }

});