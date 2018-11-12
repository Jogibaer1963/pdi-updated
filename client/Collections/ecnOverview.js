Meteor.subscribe("mcoReview");



Template.ecnPage.helpers({

    mcoOverView: function() {
        return mcoReview.find({}, {sort: {effectiveDate: -1}});
    },




});


Template.ecnPage.events({

   'submit .searchMachine': function() {
       event.preventDefault();
       const searchId = event.target.searchId.value;
       const mcoFound = mcoReview.find({mcoId: searchId}).fetch();
       if (mcoFound === "") {
       } else {
       }
   },

    'submit .addNewEcn': function() {
        event.preventDefault();
        const newEcn = event.target.newEcn.value;
        const ecnEffectivity = event.target.ecnEffectivity.value;
        const machineRecording = event.target.machineRecording.checked;
        const mcoNotes = event.target.mcoNotes.value;
        const mcoTeam = event.target.team5.value;
        if(machineRecording === true) {
            Session.set('machineSerial', "X");
        } else {
            Session.set('machineSerial', "");
        }
        const machineSerial = Session.get('machineSerial');
        console.log(newEcn, ecnEffectivity, machineSerial, mcoNotes, mcoTeam);

        Meteor.call('mcoNew', newEcn, ecnEffectivity, machineRecording, mcoNotes, mcoTeam);
        event.target.newEcn.value= "8100";
        event.target.ecnEffectivity.value= "";
        document.getElementById('machineRecording').checked = false;
        event.target.mcoNotes.value= "";
    }


});












