if (Meteor.isClient) {


    Template.headerShipList.events({
        'click .headerShip': function() {
            FlowRouter.go('shippingMachines');
        }

    });

    Template.inputHead.events({
        "submit .inputNewHead": function(event) {
            event.preventDefault();
            var createUnixTime = Date.now();
            var startDate = moment.tz(createUnixTime, "America/Chicago").format().slice(0, 19);
            var createDate = startDate.slice(0,10);
            var createTime = startDate.slice(-8);
            var newHeadInput = event.target.newHead.value;
            var newShippingDate = event.target.newDate.value;
            var newShippingDestination = event.target.newDestination.value;
            var newShippingTransporter = event.target.newTransporter.value;
            var newShippingKit= [];
            $('input[name=newKit]:checked').each(function() {
                newShippingKit.push($(this).val());
            });
            var newShippingComment = event.target.newComment.value;
            Meteor.call('addHeadToShipList', newHeadInput, newShippingDate,
                createUnixTime, createDate, createTime, newShippingDestination,
                newShippingTransporter, newShippingKit, newShippingComment );
            event.target.newHead.value="";
            event.target.newDate.value="";
            event.target.newDestination.value="";
            event.target.newTransporter.value="";
            document.getElementById('newKit1').checked= false;
            document.getElementById('newKit2').checked= false;

            event.target.newComment.value="";
        }
    });

    Template.inputMachine.helpers({
        editMachine: function() {
            var selectedHead = Session.get('selectedHead');
            return MachineReady.findOne({_id: selectedHead});

        }

    });

    Template.headShippingList.helpers({
        shippList: function () {
            // Order of shipping date
            return MachineReady.find({newHeadId: {$gt: '00'}}, {sort: {date: -1}});
        },

        'selectedClass': function() {
            var shippingHead = this._id;
            var selectedHead = Session.get('selectedHead');
            if (shippingHead == selectedHead) {
                return "selected"
            }
        }

    });


    Template.headShippingList.events({
        'click .newShippingHead': function() {
            event.preventDefault();
            var shippingHead = this._id;
            Session.set('selectedHead', shippingHead );

        },

        'click .buttonPositionId3': function() {
            event.preventDefault();
            var selectedHead = Session.get('selectedHead');
            Meteor.call('removeFromShipList', selectedHead)
        },

        'click .buttonEdit': function() {
            var selectedHead = Session.get('selectedHead');
            Session.set('editSelectedHead', selectedHead);
            if(typeof selectedHead == 'string' ) {
                FlowRouter.go('editHead');
            }
        }

    });

    Template.headerTrailer.helpers({

            availiableTrailer: function() {
                event.preventDefault();
            return headerTrailer.find({status: '1'});
            },

        'selectedClass': function() {
            var shippingHead = this._id;
            var selectedHead = Session.get('selectedHead');
            if (shippingHead == selectedHead) {
                return "selected"
            }
        }

    });

    Template.headerTrailer.events({

       'submit .newTrailerInput': function() {
           event.preventDefault();
           var headTransporter = event.target.newTransporter.value;
           var trailerId = event.target.trailerId.value;
           Meteor.call('insertHeadTrailer', headTransporter, trailerId);
           event.target.newTransporter.value = '';
           event.target.trailerId.value = '';
           },

        'click .trailerTable': function() {
            event.preventDefault();
            var shippingHead = this._id;
            Session.set('selectedHead', shippingHead );

        }

    });

    Template.trailerAtWork.helpers({

        trailerGone: function() {
            event.preventDefault();
            return headerTrailer.find({status: '0'});
        },

        'selectedClass': function() {
            var shippingHead = this._id;
            var selectedHead = Session.get('selectedHead');
            if (shippingHead == selectedHead) {
                return "selected"
            }
        }

    });

    Template.trailerAtWork.events({

        'click .moveTrailer': function() {
            event.preventDefault();
            var shippingHead = this._id;
            Session.set('selectedHead', shippingHead );

        },


        'click .trailerMove': function() {
            event.preventDefault();
            var trailerId = Session.get('selectedHead');
            var status = headerTrailer.findOne({_id: trailerId}).status;
            if(status == '1') {
                newStatus = '0'
            } else {
                newStatus = '1'
            }
            Meteor.call('updateHeadTrailer', trailerId, newStatus);
            Session.set('selectedHead', '');
        },

        'click .trailerDelete': function() {
            event.preventDefault();
            var trailerId = Session.get('selectedHead');
            Meteor.call('deleteTrailer', trailerId);
        }

    });

}
