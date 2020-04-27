Meteor.subscribe("variants_C77");
Meteor.subscribe("checkpoints");

Session.set('combineType', 'all');

// combine Type 1 = C8, 2 = C7, 3 = all

Template.inputNewCheckPoint.helpers({

    checkList: function () {
        Session.set('selectedCheckPoint', '');
        let combineType = Session.get('combineType');
        let toggle = Session.get("toggleActiveInactive");
        if(toggle === 0) {
            Session.set("activeHeader", 1);
            return checkPoints.find({status: 1}, {sort: {errorPos: 1}}).fetch();
        } else {
            Session.set("activeHeader", 0);
            return checkPoints.find({status: 0}, {sort: {errorPos: 1}});
        }
    },

    // switch table header from active to inactive and return
    activeHeader: ()=> {
        let header = Session.get("activeHeader");
        if (header === 1) {
            return ("Active Failure")
        } else {
            return ("Inactive Failure");
        }
    },

    // edit description of a checkpoint
    errorEdit: () => {
        let checkPointToActivateEdit = Session.get('selectedCheckPoint');
        let result = checkPoints.findOne({_id:checkPointToActivateEdit});
        if(result) {
            return result.errorDescription;
        }
    },

    rangeC77: () => {
        let checkPointToActivateEdit = Session.get('selectedCheckPoint');
        let result = checkPoints.findOne({_id:checkPointToActivateEdit});
        if(result) {
            return result.machineRangeEndC77;
        }
    },

    rangeC78: () => {
        let checkPointToActivateEdit = Session.get('selectedCheckPoint');
        let result = checkPoints.findOne({_id:checkPointToActivateEdit});
        if(result) {
            return result.machineRangeEndC78;
        }
    },

    rangeC79: () => {
        let checkPointToActivateEdit = Session.get('selectedCheckPoint');
        let result = checkPoints.findOne({_id:checkPointToActivateEdit});
        if(result) {
            return result.machineRangeEndC79;
        }
    },

    position: () => {
        let checkPointToActivateEdit = Session.get('selectedCheckPoint');
        let result = checkPoints.findOne({_id:checkPointToActivateEdit});
        if(result) {
            return result.errorPos;
        }
    },

    'selectedClass': function () {
        const checkPoint = this._id;
        const selectedCheckPoint = Session.get('selectedCheckPoint');
        if (selectedCheckPoint === checkPoint) {
            Session.set("statusEdit", 1);
            return "selected"
        }
    }

});


    Session.set("toggleActiveInactive", 0);
    Session.set("statusEdit", 0);

    Template.inputNewCheckPoint.events({
        'submit .inputNewCheck': function (event) {
            event.preventDefault();
            const errorPos = event.target.newPosition.value;
            const errorDescription = event.target.errorDescription.value;
            const machineRangeStart = event.target.machineRangeStart.value;
            const machineRangeEndC77 = event.target.machineRangeEndC77.value;
            const machineRangeEndC78 = event.target.machineRangeEndC78.value;
            const machineRangeEndC79 = event.target.machineRangeEndC79.value;
            const resultStart = machineRangeStart.split(" ");
            const checkStatus = 0;
            const range = [];
            $('input[name=range]:checked').each(function () {
                range.push($(this).val());
            });
            const status = 1;
            let statusEdit = Session.get("statusEdit");
            if (statusEdit === 0 ) {
            Meteor.call('inputNewCheckPoint', status, errorPos, errorDescription,
                            range, checkStatus, machineRangeEndC77,
                            machineRangeEndC78, machineRangeEndC79);
            } else if (statusEdit === 1 ) {
                let checkPointToActivateEdit = Session.get("selectedCheckPoint");
                Meteor.call('editCheckPoint',checkPointToActivateEdit, status, errorPos,
                                errorDescription, range, checkStatus,
                                machineRangeEndC77, machineRangeEndC78, machineRangeEndC79);
                Session.set("statusEdit", 0);
                Session.set("errorEdit", '');

            }
            event.target.newPosition.value = "";
            event.target.errorDescription.value = "";
            event.target.C77.checked = false;
            event.target.C78.checked = false;
            event.target.C79.checked = false;
            event.target.machineRangeStart.value = "";
            event.target.machineRangeEndC77.value = "";
            event.target.machineRangeEndC78.value = "";
            event.target.machineRangeEndC79.value = "";
        },


        // get the _id of the selected checkpoint
        'click .showCheckList': function (e) {
            e.preventDefault();
            const checkPoint = this._id;
            Session.set('selectedCheckPoint', checkPoint);

        },

        // activate selected checkpoint
        'click .activateCheck': (e) => {
            e.preventDefault();
            let checkPointToActivateEdit = Session.get("selectedCheckPoint");
            let status = 1;
            Meteor.call("reActiveCheck", checkPointToActivateEdit, status);
        },

        // deactivate the selected checkpoint
        'click .deActiveCheck': function (e) {
            e.preventDefault();
            const deactivateCheck = Session.get('selectedCheckPoint');
            const status = 0;
            Meteor.call('deactivateCheckPoint', deactivateCheck, status);
        },



        // switch active and inactive checklists
        // initial value = 0 => Active Checklist
        'click .switchCheckPointTable': (e) => {
            e.preventDefault();
            let toggle = Session.get("toggleActiveInactive");
            if(toggle === 0) {
                Session.set("toggleActiveInactive", 1);
            } else {
                Session.set("toggleActiveInactive", 0);
            }
        },

        // combine Type 1 = C8, 2 = C7, 3 = all


        'click .onlyC8Checks': (e) => {
            e.preventDefault();
            Session.set('combineType', 1)
        },

        'click .onlyC7Checks': (e) => {
            e.preventDefault();
            Session.set('combineType', 2)
        },

        'click .allChecks': (e) => {
            e.preventDefault();
            Session.set('combineType', 3)
        }



    });


