Meteor.subscribe("headerTrailer");
Meteor.subscribe("newHeadYear");

    Template.headerShipList.events({

        'click .headerShip': function() {
            FlowRouter.go('shippingMachines');
        }

    });

Template.inputHead.helpers({

    editMachine: function() {
        const selectedHead = Session.get('selectedHead');
        return newHeadYear.findOne({_id: selectedHead});
    },

    shippList: function () {
        let z = Session.get('z');
        if(z === 0) {
            return newHeadYear.find({shipStatus: 1}, {sort: {date: 1}});
        } else {
            return newHeadYear.find({shipStatus: 0}, {sort: {date: 1}});
        }
    },

    'selectedClass': function() {
        const shippingHead = this._id;
        const selectedHead = Session.get('selectedHead');
        if (shippingHead === selectedHead) {
            return "selected"
        }
    }
});

Session.set('z', 1);

Template.inputHead.events({
        "submit .inputNewHead": function(event) {
            event.preventDefault();
            const createUnixTime = Date.now();
            const startDate = moment.tz(createUnixTime, "America/Chicago").format().slice(0, 19);
            const createDate = startDate.slice(0,10);
            const createTime = startDate.slice(-8);
            const newHeadInput = event.target.newHead.value;
            const newShippingDate = event.target.newDate.value;
            const newShippingDestination = event.target.newDestination.value;
            const newShippingTransporter = event.target.newTransporter.value;
            const newShippingKit= [];
            $('input[name=newKit]:checked').each(function() {
                newShippingKit.push($(this).val());
            });
            const newShippingComment = event.target.newComment.value;
            Meteor.call('addHeadToShipList', newHeadInput, newShippingDate,
                createUnixTime, createDate, createTime, newShippingDestination,
                newShippingTransporter, newShippingKit, newShippingComment );
            event.target.newHead.value="";
            event.target.newDate.value="";
            event.target.newDestination.value="";
            event.target.newTransporter.value="";
            document.getElementById('newKit1').checked= false;
            document.getElementById('newKit2').checked= false;
            document.getElementById('newKit3').checked= false;
            document.getElementById('newKit4').checked= false;
            document.getElementById('newKit5').checked= false;
            document.getElementById('newKit6').checked= false;
            document.getElementById('newKit7').checked= false;
            document.getElementById('newKit8').checked= false;
            document.getElementById('newKit9').checked= false;
            document.getElementById('newKit10').checked= false;
            document.getElementById('newKit11').checked= false;
            event.target.newComment.value="";
        },

        'click .newShippingHead': function() {
            event.preventDefault();
            const shippingHead = this._id;
            Session.set('selectedHead', shippingHead );
        },

        'click .deleteHeader': function() {
            event.preventDefault();
            const selectedHead = Session.get('selectedHead');
            Meteor.call('removeHeadFromShipList', selectedHead)
        },

        'click .buttonToggle': function () {
            event.preventDefault();
            let z = Session.get('z');
            if(z === 0) {
                Session.set('z', 1);
            } else {
                Session.set('z', 0);
            }
        },

        'click .editHead': function() {
            const selectedHead = Session.get('selectedHead');
            Session.set('editSelectedHead', selectedHead);
            if(typeof selectedHead === 'string' ) {
                FlowRouter.go('editHead');
            }
        },

        'submit .headerTruckDate': function() {
            event.preventDefault();
            const confirmedShipDate = event.target.inputDate.value;
            const truckStatus = 1;
            const machineId = Session.get('selectedHead');
            Meteor.call('headTruckOrdered', machineId, truckStatus, confirmedShipDate);
        },

        'click .removeTruck': function() {
            event.preventDefault();
            const truckStatus = 0;
            const machineId = Session.get('selectedHead');
            Meteor.call('headTruckRemoved', machineId, truckStatus);
        }
    });


    Template.headerTrailer.helpers({

            availiableTrailer: function() {
            event.preventDefault();
            return headerTrailer.find({status: '1'});
            },

        'selectedClass': function() {
            const trailer = this._id;
            const selectedTrailer = Session.get('selectedTrailer');
            if (selectedTrailer === trailer) {
                return "selected"
            }
        },

        trailerGone: function() {
            event.preventDefault();
            return headerTrailer.find({status: '0'});
        },

        'selectedClass2': function() {
            const shippingTrailer = this._id;
            const selectedTrailer = Session.get('selectedTrailer');
            if (shippingTrailer === selectedTrailer) {
                return "selected"
            }
        }
    });

    Template.headerTrailer.events({
       'submit .newTrailerInput': function() {
           event.preventDefault();
           const headTransporter = event.target.newTransporter.value;
           const trailerId = event.target.trailerId.value;
           Meteor.call('insertHeadTrailer', headTransporter, trailerId);
           event.target.newTransporter.value = '';
           event.target.trailerId.value = '';
           },

        'click .trailerOnLotTable': function() {
            event.preventDefault();
            const selectedTrailer = this._id;
            Session.set('selectedTrailer', selectedTrailer );
        },

        'click .moveTrailer': function() {
            event.preventDefault();
            const shippingTrailer = this._id;
            Session.set('selectedTrailer', shippingTrailer);
        },

        'click .trailerMove': function() {
            event.preventDefault();
            const trailerId = Session.get('selectedTrailer');
            const status = headerTrailer.findOne({_id: trailerId}).status;
            if(status === '1') {
                newStatus = '0'
            } else {
                newStatus = '1'
            }
            Meteor.call('updateHeadTrailer', trailerId, newStatus);
            Session.set('selectedTrailer', '');
        },

        'click .trailerDelete': function() {
            event.preventDefault();
            const trailerId = Session.get('selectedTrailer');
            Meteor.call('deleteTrailer', trailerId);
        }
    });




