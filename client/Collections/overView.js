
    Meteor.subscribe("MachineReady");
    Meteor.subscribe('newHeadYear');

    Session.set('selectedPdiMachine', '');
    Session.set('pdiMachineNumber', '');
    Session.set('selectedErrorId', '');
    Session.set('selectedNewErrorId', '');
    Session.set('findMachine', '');
    Session.set('selectedMainOm', '');
    Session.set('selectedSuppOm', '');
    Session.set('selectedUnloadOm', '');
    Session.set('selectedCemosOm', '');
    Session.set('selectedTeraTrackOm', '');
    Session.set('selectedProfiCam', '');
    Session.set('selectedProfiId', '');




    Template.overView.helpers({

       machineOverView: function() {
          return MachineReady.find({machineId: {$gt: 'C00000'}, $or: [{shipStatus: 0},
               {shipStatus: 2}]}, {sort: {date: -1}});
        },

        headerOverView: function() {
            return newHeadYear.find( {newHeadId: {$gt:'00'}, $or: [{shipStatus: 0},
              {shipStatus: 2}]}, {sort: {date: 1}});
        },

        countPdi: function() {
            return MachineReady.find({$or:[{pdiStatus: 0},{pdiStatus: 2}]}, {sort: {date: 1}}).count();
        },

        countRepair: function() {
            return MachineReady.find({$and:[{repairStatus: 0},{pdiStatus: 1}]}).count();
        },

        countWash: function() {
            return MachineReady.find({$or:[{washStatus: 0},{washStatus: 2}]}, {sort: {date: 1}}).count();
        },

        countShip: function() {
          return  MachineReady.find({$and: [{pdiStatus:1}, {washStatus:1}, {repairStatus:1}, {shipStatus:0}]}).count();
        },

        preOverViewCheckList: () => {
            resultArray = [];
            try {
                let resultStep1 = preSeriesMachine.find({}, {sort: {preMachineId: 1}}).fetch();
                if (resultStep1.length === 0) {
                } else {
                    let arrayLength = resultStep1.length;
                    for (let i = 0; i <= (arrayLength - 1); i++) {
                        let _id = resultStep1[i]._id;
                        let newIssuesLength = resultStep1[i].newIssues.length;
                        let checkPointCount = resultStep1[i].checkItems.length;
                        let machineNumber = resultStep1[i].preMachineId;
                        let pdiStatusId = resultStep1[i].pdiStatus;
                        let checkItemIssue = 0;
                        for (let k = 1; k <= checkPointCount; k++) {
                            try {
                                if (resultStep1[i].checkItems[k].failureStatus === 2) {
                                    checkItemIssue++;
                                }
                            } catch (e) {
                            }
                        }
                        let result= ({
                            _id : _id,
                            machineNumber : machineNumber,
                            pdiStatusId : pdiStatusId,
                            newIssueCount : newIssuesLength,
                            checkPointCount : checkPointCount,
                            checkItemIssue : checkItemIssue
                        });
                        resultArray.push(result);
                    }
                }
            } catch (e) {
                console.log(e);
            }
            return resultArray;
        }

    });







