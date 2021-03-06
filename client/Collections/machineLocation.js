
if (Meteor.isClient) {

    Template.pdiLocation.helpers({

        overView: function() {
            return MachineReady.find( {machineId: {$gt: 'C00000'}, $or: [{shipStatus: 0},
                {shipStatus: 2}]}, {sort: {date: -1}}).fetch();
            },

        'selectedClass': function(){
            const openInspect = this._id;
            const selectedLocation = Session.get('selectedLocation');
            if (selectedLocation === openInspect) {
                return "selected"
            }
        }
    });

    Template.pdiLocation.events({

        'click .locationUpdate': function(e) {
            e.preventDefault();
            const newLocation = this._id;
            Session.set('selectedLocation', newLocation);
        },

        'submit .mLocationId': function(e) {
            e.preventDefault();
            const machineId = Session.get('selectedLocation');
            const locationUpdate = e.target.locationId.value;
            if(typeof locationUpdate === 'undefined') {
                alert('Mark the Machine first before update the Location');
            }
            Meteor.call('locationUpdate', machineId, locationUpdate);
            e.target.locationId.value="";
            Session.set('selectedPdiMachine', '');
        }

    });

}