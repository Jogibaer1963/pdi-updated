Meteor.subscribe('lineOrders')


Template.order_repair.helpers({

    lineOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let user_order = Meteor.user().username;
        let result = lineOrders.find({team_user: user_order,
            status: {$in: [0, 1]}}).fetch();
        return result.sort((a, b) => a.status - b.status)
    },

    historyOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let user_order = Meteor.user().username;
        let result = lineOrders.find({team_user : user_order, status: 2}, {}).fetch();
        return  result.sort((a, b) => b.unixTimeOrderCompleted - a.unixTimeOrderCompleted)
    },

    markedSelectedOrder: function(e) {
        const order = this._id;
        const selectedOrder = Session.get('orderCanceled');
        if (order === selectedOrder) {
            return "selected";
        }
    }

})

Template.order_repair.events({

    'click .selectedOrder': function (e) {
        e.preventDefault()
        let order = this._id
        console.log(order)
        Session.set('orderCanceled', order)
    },


    'click .messageButton_repair':(e) => {
        e.preventDefault()
        let newUrl = Session.get('messagePort') + 'repairMessageBoard'
        window.open(newUrl,
            '_blank', 'toolbar=0, location=0,menubar=0, width=1000, height=500')
    },

    'click .cancelButton':(e) => {
        e.preventDefault()
        let orderCancel = Session.get('orderCanceled', )
        Meteor.call('cancelOrder', orderCancel)
    },

})

