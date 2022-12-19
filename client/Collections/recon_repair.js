Meteor.subscribe('lineOrders')


Template.part_order_recon.helpers({

    re_lineOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let user_order = Meteor.user().username;
        let result = lineOrders.find({team_user: user_order,
            status: {$in: [0, 1]}}).fetch();
      //  console.log('result ', user_order, result)
        return result.sort((a, b) => a.status - b.status)
    },

    re_historyOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let user_order = Meteor.user().username;
        let result = lineOrders.find({team_user : user_order, status: 2}, {}).fetch();
        return  result.sort((a, b) => b.unixTimeOrderCompleted - a.unixTimeOrderCompleted)
    },

    re_markedSelectedOrder: function(e) {
        const order = this._id;
        const selectedOrder = Session.get('orderCanceled');
        if (order === selectedOrder) {
            return "selected";
        }
    }

})

Template.part_order_recon.events({

    'click .comp': function () {
        let textMainComp = this._id;
        Session.set('selectedComponent', textMainComp);
        Session.set('issueComp', textMainComp);
    },

    'submit .repair-order-parts':function(e) {
        e.preventDefault();
        let user_order, partNumber_order, quantityNeeded_order, storageLocation_order, point_of_use_order,
            reason_order, urgency_order;
        user_order = Meteor.user().username;
        partNumber_order = e.target.partNumber.value;
        quantityNeeded_order = e.target.quantityNeeded.value;
        storageLocation_order = e.target.storageLocation.value;
        point_of_use_order = e.target.location.value;
        reason_order = e.target.reason.value;
        urgency_order = 11;
     //   console.log(user_order, partNumber_order, storageLocation_order, point_of_use_order,
      //      reason_order, urgency_order)
        Meteor.call('repair_parts_on_order', user_order, partNumber_order, quantityNeeded_order,
            storageLocation_order, point_of_use_order, reason_order, urgency_order, function (err, respond) {
                if (err) {
                    //  Meteor.call('success', err, user_order, 'order failed')
                } else {
                    //     Meteor.call('success', respond, user_order, 'order succeed')
                    Session.set('issueComp', '')

                }
            })

    },

    'click .cancelButton':(e) => {
        e.preventDefault()
        let orderCancel = Session.get('orderCanceled', )
        Meteor.call('cancelOrder', orderCancel)
    },

})






