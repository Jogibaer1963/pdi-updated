if(Meteor.isClient) {


    Template.machineUser.helpers({

        'machineNow': function () {
            event.preventDefault();
            const userLoggedIn = Session.get('currentLoggedInUser');
            Session.set('pdiMachineNumber', localStorage.getItem('pdiMachine'));
            const pdiMachine = Session.get('pdiMachineNumber');
            return {userLoggedIn: userLoggedIn, machine: pdiMachine};
        }
    });

    Template.ommBook.helpers({


        ommMainBooklets: function () {
            return ommMain.find({});
        },

        selectedMainOm: function() {
            event.preventDefault();
            return Session.get('selectedMainOm');
        },
        //-------------------------------------------------------------//
        ommSupplement: function () {
            return ommSupp.find({});
        },

        selectedSuppOm: function() {
            event.preventDefault();
            return Session.get('selectedSuppOm');
        },
        //------------------------------------------------------------//
        ommUnload: function () {
            return ommUnload.find({});
        },

        selectedUnloadOm: function() {
            event.preventDefault();
            return Session.get('selectedUnloadOm');
        },
        //--------------------------------------------------------------//

        ommCebisMo: function () {
            return ommCebisMo.find({});
        },

        selectedCemosOm: function() {
            event.preventDefault();
            return Session.get('selectedCemosOm');
        },
        //--------------------------------------------------------------//

        ommTera: function () {
            return ommTeraTrack.find({});
        },

        selectedTeraOm: function() {
            event.preventDefault();
            return Session.get('selectedTeraTrackOm');
        },

        //--------------------------------------------------------------//

        ommProfi: function () {
            return ommProfiCam.find({});
        },

        selectedProfiCam: function() {
            event.preventDefault();
            return Session.get('selectedProfiCam');
        },

        selectedClass: function() {
            event.preventDefault();
            const omId = this._id;
            const selectedProfiOmId = Session.get('selectedProfiId');
            if(selectedProfiOmId === omId) {
                return "selected";
            } 
        }

    });
    //****************************************************************//
    Template.ommBook.events({
        'click .omMain': function() {
            event.preventDefault();
            Session.set('selectedMainOm', '');
            const omMainPart = this._id;
            const selectedMainOm = ommMain.findOne({_id: omMainPart}).ommMain;
            Session.set('selectedMainOm', selectedMainOm);
        },

        'click .omSupp': function() {
            event.preventDefault();
            Session.set('selectedSuppOm', '');
            const omSupp = this._id;
            const selectedSuppOm = ommSupp.findOne({_id: omSupp}).ommSupp;
            Session.set('selectedSuppOm', selectedSuppOm);
        },

        'click .omUnload': function() {
            event.preventDefault();
            Session.set('selectedUnloadOm', '');
            const omUnload = this._id;
            const selectedUnloadOm = ommUnload.findOne({_id: omUnload}).omUnload;
            Session.set('selectedUnloadOm', selectedUnloadOm);
        },

        'click .omCemos': function() {
            event.preventDefault();
            Session.set('selectedCemosOm', '');
            const omCemos = this._id;
            const selectedCemosOm = ommCebisMo.findOne({_id: omCemos}).ommCebisMobil;
            Session.set('selectedCemosOm', selectedCemosOm);
        },

        'click .omTera': function() {
            event.preventDefault();
            Session.set('selectedTeraTrackOm', '');
            const omTera = this._id;
            const selectedTeraTrackOm = ommTeraTrack.findOne({_id: omTera}).ommTeraTrack;
            Session.set('selectedTeraTrackOm', selectedTeraTrackOm);
        },

        'click .ommProfiCam': function() {
            event.preventDefault();
            Session.set('selectedProfiCam', '');
            const omProfi = this._id;
            Session.set('selectedProfiId', omProfi);
            const selectedProfiCam = ommProfiCam.findOne({_id: omProfi}).ommProfiCam;
            Session.set('selectedProfiCam', selectedProfiCam);
        },

        'submit .omBooklets': function (event) {
            event.preventDefault();
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            const loggedInUser = Session.get('currentLoggedInUser');
            const pdiMachineId = Session.get('selectedPdiMachine');
            const fuelMe = event.target.fuelMe.value;
            Session.set('fuelBeforePdi', fuelMe);
            const ommMain = event.target.omMain.value;
            const ommSupp = event.target.omSupp.value;
            const ommFitting = event.target.omUnload.value;
            const ommCebis = event.target.omCebis.value;
            const ommTerra = event.target.omTerra.value;
            const ommProfiCam = event.target.omProfiCam.value;
            Meteor.call('pdiMachineInspected', pdiMachineId, loggedInUser, fuelMe, ommMain, ommSupp,
                ommFitting, ommTerra, ommCebis, ommProfiCam);
            Session.set('selectedProfiCam', '');
            Session.set('selectedTeraTrackOm', '');
            Session.set('selectedCemosOm', '');
            Session.set('selectedUnloadOm', '');
            Session.set('selectedSuppOm', '');
            Session.set('selectedMainOm', '');
            event.target.fuelMe.value = '';
            event.target.omMain.value = '';
            event.target.omSupp.value = '';
            event.target.omUnload.value = '';
            event.target.omCebis.value = '';
            event.target.omTerra.value = '';
            event.target.omProfiCam.value = '';
            FlowRouter.go('machineInspect_2');
        }
    });
}