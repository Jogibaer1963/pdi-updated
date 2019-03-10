Meteor.subscribe('images');
Meteor.subscribe('preSeriesChecklist');

Template.checkListOverView.helpers({

  checkMachines: () => {
      const result = preSeriesChecklist.find().fetch();
      console.log(result);
      let picPath = result[0].picPath;
      console.log(picPath);
      return picPath;
  }

});

Template.checkListOverView.events({



});