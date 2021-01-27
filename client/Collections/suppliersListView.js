Meteor.subscribe('SuppliersList');


Session.set('selectedSupplierResult', '');

Template.suppliersListView.helpers({

    suppliersList: () => {
        return SuppliersList.find();
    },

    'selectedSupplier': function(){
      let selectSupp = this._id;
      let selectedSupp = Session.get('selectedSupp')
      if (selectedSupp === selectSupp) {
          return 'selected';
      }
    },
});

Template.suppliersListView.events({

    'click .selectedSupplier': function(e){
      e.preventDefault();
      const selected = this._id;
      console.log('selected', selected);
      Session.set('selectedSupp', selected);
    },

    'submit .newSupplier':(e) => {
        e.preventDefault();
        let newSupplier = e.target.inputSupplier.value;
        Meteor.call('newSupplierAdd', newSupplier);
        e.target.inputSupplier.value = '';
    },

    'click .buttonReturn': (e) => {
        e.preventDefault();
        FlowRouter.go('analyzing');
    },

    'click .supplierRemoveButton': (e) => {
        e.preventDefault();
        let removeId = Session.get('selectedSupp');
        Meteor.call('removeSupplier', removeId);
    }
});

Template.supplierResultList.helpers({

    suppliersResultList: () => {
      let finalResult = [];
      let result = analyzingDatabase.find().fetch();
       result.forEach((element) => {
           if (element.extern === true) {
               finalResult.push(element);
           }
       })
        return finalResult;
    },

    supplierTable: () => {
        let finalResult = [];
        let uniqueResult = [];
        let result = analyzingDatabase.find().fetch();
        result.forEach((element) => {
            if (element.extern === true) {
                finalResult.push(element.issueResponsible);
            }
        })
        let unique = finalResult.filter((v, i, a) => a.indexOf(v) === i)
        unique.forEach((element) => {
            let suppResult = {
                supplier: element
            }
            uniqueResult.push(suppResult);
        })
        return uniqueResult
    }


})

Template.supplierResultList.events({

    'click .selectedSupplier': function (e) {
        e.preventDefault()
        let selectedSupplier = this.supplier;
        Session.set('selectedSupplierResult', selectedSupplier);
        FlowRouter.go('singleSupplierResult')
    }

});

