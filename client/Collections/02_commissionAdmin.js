Meteor.subscribe('supplyAreaList');

Template.commissionAdmin.helpers ({

    supplyAreaList: function () {
        return supplyAreaList.find();
    },

    'selected': function(){
        const supplyArea = this._id;
        const selectedArea = Session.get('selectedArea');
        if (selectedArea === supplyArea) {
            return "selected"
        }
    }

});



Template.commissionAdmin.events ({

    'click .supplyAreaList': function(e) {
        e.preventDefault();
        const pickedSupplyArea = this._id;
        Session.set('selectedArea', pickedSupplyArea);
    },

   'submit .newSupplyArea': (e) => {
       e.preventDefault();
       const newSupplyArea = e.target.supplyArea.value;
       Meteor.call('supplyArea', newSupplyArea);
       e.target.supplyArea.value = '';
   },

    'click .removeSupplyArea': function (e) {
        e.preventDefault();
        const removableSupply = Session.get('selectedArea');
        Meteor.call('removeSupply', removableSupply);
    }


});