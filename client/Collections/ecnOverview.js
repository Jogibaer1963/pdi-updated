Meteor.subscribe("mcoReview");

Template.ecnOverView.events({

   'submit .searchMachine': function() {
       event.preventDefault();
       const searchId = event.target.searchId.value;
       const mcoFound = mcoReview.find({mcoId: searchId}).fetch();
       if (mcoFound === "") {
       } else {
       }
   }
});



Template.ecnNew.events({
    'submit .addNewEcn': function() {
        event.preventDefault();
        const newEcn = event.target.newEcn.value;
        const ecnEffectivity = event.target.ecnEffectivity.value;
        const machineRecording = event.target.machineRecording.checked;
        const mcoNotes = event.target.mcoNotes.value;
        Meteor.call('mcoNew', newEcn, ecnEffectivity, machineRecording, mcoNotes);
        event.target.newEcn.value= "8100";
        event.target.ecnEffectivity.value= "";
        document.getElementById('machineRecording').checked = false;
        event.target.mcoNotes.value= "";
    }

});









Template.allEcnOverView.helpers({

      mcoOverView: function() {
           return mcoReview.find({}, {sort: {effectiveDate: -1}});
      }
});