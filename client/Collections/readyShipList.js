if (Meteor.isClient) {

    Meteor.subscribe('newHeadYear');

    Template.overViewReadyList.helpers({

        overView: function () {
            let k = Session.get('k');
            if(k === 0) {
                return newHeadYear.find( {newHeadId: {$gt:'00'},
                        $or: [{shipStatus: 0},
                            {shipStatus: 2}]},
                    {sort: {date: 1}});
            } else {
                return MachineReady.find({
                        shipStatus: 0, pdiStatus: 1,
                        repairStatus: 1,
                        washStatus: 1
                    },
                    {sort: {date: 1}});

            } },

        'selectedClass': function () {
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedMachine');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        }
    });

    Session.set('k', 1);

    Template.overViewReadyList.events({

        'click .readyList': function () {
            const readyMachine = this._id;
            Session.set('selectedMachine', readyMachine);
        },

        'click .shipMeButton': function () {
            event.preventDefault();
            const selectedCheckPoint = Session.get('selectedMachine');
            Meteor.call('headIsGone', selectedCheckPoint);
        },

        'click .toggleCombineHeader': function () {
            event.preventDefault();
            let k = Session.get('k');
              if(k === 0) {
                  Session.set('k', 1);
                } else {
                  Session.set('k', 0);
              }
        },

        "click .submitReadyGo": function () {
            event.preventDefault();
            const readyGo = [];
            $('input[name=readyToGo]:checked').each(function () {
                readyGo.push($(this).val());
            });

            Meteor.call('headReadyToGo', readyGo);
            $( "#readyGo" ).prop( "checked", false );

        }



    });


}