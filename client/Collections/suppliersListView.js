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
      let repairInfos = Session.get('repairInfos');
      let supplierList = {}
      let finalResult = [];
      let   result = MachineReady.find({pdiStatus: 1},
                {fields: {newIssues: 1,
                        machineId: 1,
                        repairStatus: 1,
                        omms: 1
                    }}).fetch();
       result.forEach((element) => {
           if (element.newIssues) {
                element.newIssues.forEach((element2) => {
                    if (element2.extern === true) {
                        supplierList = {
                            issueId : element2._id,
                            machineId : element.machineId,
                            pdiTech : element.omms.user,
                            repairStatus: element.repairStatus,
                            errorDescription : element2.errorDescription,
                            pictureLocation : repairInfos + element2.pictureLocation,
                            repairTech : element2.repairTech,
                            repairTime : element2.repairTime
                        }
                        finalResult.push(supplierList);
                    }

                })
           }
       })
     //   console.log('Final ', finalResult)
        return finalResult;
    },

    supplierTable: () => {
       return SuppliersList.find().fetch();
    }


})

Template.supplierResultList.events({

    'click .selectedSupplier': function (e) {
        e.preventDefault()
        let selectedSupplier = this.supplier;
        Session.set('selectedSupplierResult', selectedSupplier);
        FlowRouter.go('singleSupplierResult')
    },

    'click .buttonReturn': (e) => {
        e.preventDefault();
        FlowRouter.go('analyzing');
    }

});

