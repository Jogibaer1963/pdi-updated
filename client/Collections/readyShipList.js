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

        'click .toggleCombineHeader': function () {
            event.preventDefault();
            let k = Session.get('k');
            if(k === 0) {
                Session.set('k', 1);
            } else {
                Session.set('k', 0);
            }
        },


        // choice 0 = Head, choice = 1 Machine

        'click .shipMeButton': function () {
            event.preventDefault();
            let choice = Session.get('k');
            if (choice === 0) {
                const selectedCheckPoint = Session.get('selectedMachine');
                Meteor.call('headIsGone', selectedCheckPoint);
            } else if (choice === 1) {
                const selectedCheckPoint = Session.get('selectedMachine');
                Meteor.call('machineIsGone', selectedCheckPoint);
            }

        },

        "click .submitReadyGo": function () {
            event.preventDefault();
            let choice = Session.get('k');
            if (choice === 0) {
                const readyGo = [];
                $('input[name=readyToGo]:checked').each(function () {
                    readyGo.push($(this).val());
                });
                Meteor.call('headReadyToGo', readyGo);
                $( "#readyGo" ).prop( "checked", false );
            } else if (choice === 1) {
                const readyGo = [];
                $('input[name=readyToGo]:checked').each(function () {
                    readyGo.push($(this).val());
                });
                Meteor.call('machineReadyToGo', readyGo);
                $( "#readyGo" ).prop( "checked", false );
            }
        }
    });


}