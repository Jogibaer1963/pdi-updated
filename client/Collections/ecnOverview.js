//Meteor.subscribe("mcoReview");

/*

Template.ecnPage.helpers({

    mcoOverView: function() {
        return mcoReview.find({}, {sort: {effectiveDate: -1}});
    },

});


Template.ecnPage.events({

    'submit .addNewEcn': function(e) {
        e.preventDefault();
        const newEcn = e.target.newEcn.value;
        const ecnEffectivity = e.target.ecnEffectivity.value;
        const machineRecording = e.target.machineRecording.checked;
        const materialStatus = e.target.materialStatus.checked;
        const mcoNotes = e.target.mcoNotes.value;
        const newMcoTeam= [];
        $('input[name = mco]:checked').each(function() {
            newMcoTeam.push($(this).val());
        });
        if(machineRecording === true) {
            Session.set('machineSerial', "X");
        } else {
            Session.set('machineSerial', "");
        }
        const machineSerial = Session.get('machineSerial');

        if(materialStatus === true) {
            Session.set('materialStatus', "L");
        } else {
            Session.set('materialStatus', "");
        }
        const materialScrap = Session.get('materialStatus');

        Meteor.call('mcoNew', newEcn, ecnEffectivity, machineSerial, materialScrap, mcoNotes, newMcoTeam);
        e.target.newEcn.value= "8100";
        e.target.ecnEffectivity.value= "";
        document.getElementById('machineRecording').checked = false;
        document.getElementById('materialStatus').checked = false;
        e.target.mcoNotes.value= "";
        document.getElementById('mcoTeam_1').checked= false;
        document.getElementById('mcoTeam_2').checked= false;
        document.getElementById('mcoTeam_3').checked= false;
        document.getElementById('mcoTeam_4').checked= false;
        document.getElementById('mcoTeam_5').checked= false;
    },

    'submit .searchMCO': (e) => {
       e.preventDefault(e);
        const newMcoSearch= [];
        $('input[name = mcoSearch]:checked').each(function() {
            newMcoSearch.push($(this).val());
        });
       const mcoReCording = e.target.reCording.value;
       const matStatus = e.target.matStatus.value;
       const mcoSearchString = e.target.mcoSearchNotes.value;
       Meteor.call('mcoSearch', newMcoSearch, mcoReCording, matStatus, mcoSearchString);
        document.getElementById('team1').checked= false;
        document.getElementById('team2').checked= false;
        document.getElementById('team3').checked= false;
        document.getElementById('team4').checked= false;
        document.getElementById('team5').checked= false;
        document.getElementById('reCording').checked= false;
        document.getElementById('matStatus').checked= false;
        document.getElementById('mcoSearchNotes').value= "";
    }

});

 */












