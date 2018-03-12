if (Meteor.isClient) {

    Template.overViewWashList.helpers({

        overView: function() {
            return MachineReady.find({$and:[{machineId: {$gt: 'C000000'}},
                {$or: [{washStatus: 0},{washStatus: 2}]},
                {$or: [{pdiStatus:0}, {pdiStatus: 1}]},
                {$or: [{repairStatus: 0}, {repairStatus: 1}]}
                ]}, {sort: {date: 1}});

        },

        'selectedClass': function() {
            const checkPoint = this._id;
            const selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId === checkPoint) {
                return "selected"
            }
        },

        washMessage: function () {
            event.preventDefault();
            Session.set('selectedCheckPoint', '');
            let toggle = Session.get("toggleActiveInactive");
            if(toggle === 0) {
                Session.set("activeHeader", 1);
                return washBayText.find({active: 1});
            } else {
                Session.set("activeHeader", 0);
                 return washBayText.find({active: 0}, {sort: {inactiveDate: -1}});
            }
        },

        // switch table header from active to inactive and return
        activeHeader: ()=> {
            let header = Session.get("activeHeader");
            if (header === 1) {
                return ("Active messages")
            } else {
                return  "Cleared messages";
            }
        },


        'selectedMessage': function() {
            const message = this._id;
            const selectedMessage = Session.get('selectedMessage');
            if (selectedMessage === message) {
                return "selected"
            }
        }

    });

    Template.overViewWashList.events({

        // switch active and inactive checklists
        // initial value = 0 => Active Checklist
        'click .switchWashHistory': () => {
            event.preventDefault();
            let toggle = Session.get("toggleActiveInactive");
            if(toggle === 0) {
                Session.set("toggleActiveInactive", 1);
            } else {
                Session.set("toggleActiveInactive", 0);
            }
        },

        'click .readyWash': function () {
            const checkPoint = this._id;
            Session.set('selectedMachineId', checkPoint);
        },

        'click .machineInWashBay': function() {
            event.preventDefault();
            const selectedMachineId = Session.get('selectedMachineId');
            const dateStart = Date.now();
            Meteor.call('updateWashList', selectedMachineId, dateStart);
        },

        'click .stopWashProcess': function() {
            event.preventDefault();
            const selectedMachineId = Session.get('selectedMachineId');
            Meteor.call('stopWashing', selectedMachineId);
        },

        'click .machineOutWashBay': function() {
            event.preventDefault();
            const dateStop = Date.now();
            const selectedMachineId = Session.get('selectedMachineId');
            const startTime = MachineReady.findOne({_id: selectedMachineId}, {fields: {startWashDate: 1, _id: 0}});
            const startWashTime = JSON.stringify(startTime).slice(-14);
            const startRealWashTime = startWashTime.slice(0,13);
            const diffTime = dateStop - startRealWashTime;
            const washDuration = convertMS(diffTime);
            const unixTime = MachineReady.findOne({_id: selectedMachineId}, {fields: {unixTime: 1, _id: 0}});
            const startUnixTime = JSON.stringify(unixTime).slice(-14);
            const startAfterCreateTime = startUnixTime.slice(0,13);
            const diffCreateTime = startRealWashTime - startAfterCreateTime;
            const waitWashTime = convertMS(diffCreateTime);
            Meteor.call('finishWashing', selectedMachineId, dateStop, washDuration, waitWashTime);
        },

        'submit .locationNew': function(event) {
            event.preventDefault();
            const selectedPdiMachine = Session.get('selectedMachineId');
            if(typeof selectedPdiMachine === 'undefined') {
                alert('Mark the Machine first before update the Location');
            }
            const locationId = event.target.locationId.value;
            Meteor.call('locationUpdate', selectedPdiMachine, locationId);
            event.target.locationId.value="";
            Session.set('selectedMachineId', '');
        },

        'submit .washBayMessanger': function(event) {
            event.preventDefault();
            const messageId = event.target.messageId.value;
            const machineId = event.target.machineId.value;
            Meteor.call('messageToWashBay_2', messageId, machineId);
            event.target.messageId.value="";
            event.target.machineId.value="";
        },

        'click .textMessage': function () {
            const message = this._id;
            Session.set('selectedMessage', message);
        },

        'click .messageButton': function() {
            event.preventDefault();
            userWashBay = Meteor.userId();
            const removeId = Session.get('selectedMessage');
            const date = moment().format('YYYY-MM-DD, h:mm:ss a');
            Meteor.call('removeText', removeId, userWashBay, date);
        }
    });

    
 function convertMS(ms) {
     let d, h, m, s;
     s = Math.floor(ms / 1000);
     m = Math.floor(s / 60);
     s = s % 60;
     h = Math.floor(m / 60);
     m = m % 60;
     d = Math.floor(h / 24);
     h = h % 24;
     return(   d + ' d '  + h + ' h ' + m + ' m '  + s +' s');
 }


}


