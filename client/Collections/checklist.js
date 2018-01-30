if (Meteor.isClient) {

    Template.inputNewCheckPoint.events({

        'submit .inputNewCheck': function (event) {
            event.preventDefault();
            const errorPos = event.target.newPosition.value;
            const errorDescription = event.target.errorDescription.value;
            const machineRangeStart = event.target.machineRangeStart.value;
            const machineRangeEnd = event.target.machineRangeEnd.value;
            const resultStart = machineRangeStart.split(" ");
            const resultEnd = machineRangeEnd.split(" ");
            const range = [];
            $('input[name=range]:checked').each(function () {
                range.push($(this).val());
            });
            const status = 1;
            Meteor.call('inputNewCheckPoint', status, errorPos, errorDescription,
                range, resultStart, resultEnd);
            event.target.newPosition.value = "";
            event.target.errorDescription.value = "";
            event.target.C77.checked = false;
            event.target.C78.checked = false;
            event.target.C79.checked = false;
            event.target.machineRangeStart.value = "";
            event.target.machineRangeEnd.value = "";
        },

        'click .showCheckList': function () {
            event.preventDefault();
            const checkPoint = this._id;
            console.log(checkPoint);
            Session.set('selectedCheckPoint', checkPoint);
        },

        'click .deActiveCheck': function () {
            event.preventDefault();
            const deactivateCheck = Session.get('selectedCheckPoint');
            console.log('deactivate', deactivateCheck);
            const status = 0;
            Meteor.call('deactivateCheckPoint', deactivateCheck, status);
        }

    });


    Template.inputNewCheckPoint.helpers({



        inActiveCheckPoints: function () {
            event.preventDefault();
            return checkPoints.find({status: 0}, {sort: {errorPos: 1}});
        },

        'selectedClass': function () {
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        }


    });

    Template.checkPointTable.helpers({

        checkList: function () {
            event.preventDefault();
            Session.set('selectedCheckPoint', '');
            let loadedCheckPoints = checkPoints.find({status: 1}, {sort: {errorPos: 1}});
            let countedCheckPoints = loadedCheckPoints.count();

            console.log(countedCheckPoints);
            return loadedCheckPoints;
        },



    });

}

