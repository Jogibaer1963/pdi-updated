if (Meteor.isClient) {

    Session.set("toggleActiveInactive", 0);

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

        // get the _id of the selected checkpoint
        'click .showCheckList': function () {
            event.preventDefault();
            const checkPoint = this._id;
            console.log(checkPoint);
            Session.set('selectedCheckPoint', checkPoint);
        },

        // Edit selected checkpoint
        'click .editCheck': () => {
            event.preventDefault();
            let checkPointToActivateEdit = Session.get("selectedCheckPoint");
            console.log("edit Checkpoint", checkPointToActivateEdit);

        },

        // activate selected checkpoint
        'click .activateCheck': () => {
            event.preventDefault();
            let checkPointToActivateEdit = Session.get("selectedCheckPoint");
            let status = 1;
            Meteor.call("reActiveCheck", checkPointToActivateEdit, status);
        },

        // deactivate the selected checkpoint
        'click .deActiveCheck': function () {
            event.preventDefault();
            const deactivateCheck = Session.get('selectedCheckPoint');
            console.log('deactivate', deactivateCheck);
            const status = 0;
            Meteor.call('deactivateCheckPoint', deactivateCheck, status);
        },



        // switch active and inactive checklists
        // initial value = 0 => Active Checklist
        'click .switchCheckPointTable': () => {
            event.preventDefault();
            let toggle = Session.get("toggleActiveInactive");
            if(toggle === 0) {
                Session.set("toggleActiveInactive", 1);
            } else {
                Session.set("toggleActiveInactive", 0);
            }
        }


    });


    Template.inputNewCheckPoint.helpers({

        checkList: function () {
            event.preventDefault();
            Session.set('selectedCheckPoint', '');
            let toggle = Session.get("toggleActiveInactive");
            if(toggle === 0) {
                Session.set("activeHeader", 1);
                return checkPoints.find({status: 1}, {sort: {errorPos: 1}});
            } else {
                Session.set("activeHeader", 0);
                return checkPoints.find({status: 0}, {sort: {errorPos: 1}});
            }
        },

        activeHeader: ()=> {
            let header = Session.get("activeHeader");
                 if (header === 1) {
                     return ("Active Failure")
                 } else {
                    return ("Inactive Failure");
                     }
            },

        'selectedClass': function () {
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint === checkPoint) {
              return "selected"
            }
        }


    });

}

