Meteor.subscribe("siList");
Meteor.subscribe("reworkMachineList");
Meteor.subscribe("siListDone");
Meteor.subscribe("siMd");
Meteor.subscribe("siTable");
Meteor.subscribe('specialPdiItems');


    Template.siTable.events({
        'click .selectedSiItem': function () {
            const checkPoint = this._id;
            Session.set('selectedItem', checkPoint);
        },
        
        'submit .siItems': function() {
            event.preventDefault();
            const machine = event.target.siMachine.value;
            const siItemText = event.target.siItemText.value;
            Meteor.call('siList', machine, siItemText);
            event.target.siMachine.value="";
            event.target.siItemText.value="";
        },

        'submit .removeSiItem': function () {
            event.preventDefault();
            const siItem = Session.get('selectedItem');
            Meteor.call('removeFromSiList', siItem);

        }
    });

    Template.siTable.helpers({

        siList: function() {
            event.preventDefault();
            return siList.find();
        },

       failureList: function () {
            Session.set('selectedNewFailure', "");
            return FailuresList.find({}, {sort: {error_describ: 1}});
        },

        'selectedLineItem': function() {
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedItem');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        }

    });

    Template.upload.onCreated(() => {
        Template.instance().uploading = new ReactiveVar(false);
    });

    Template.upload.events({

        'submit .siMdList': function () {
            event.preventDefault();
            const siMdList = event.target.siMdList.value;
            Session.set('siList', siMdList);
            let exist = siTable.findOne({siNumber: siMdList});
            if (!exist) {
                Meteor.call('siInsert', siMdList);
            } else {
               Bert.alert('!! SI already exists !!', 'danger', 'fixed-top');
            }
            event.target.siMdList.value = '';
        },

        'change [name="uploadCSV"]' (event, template) {
            const siMdList =  Session.get('siList');
            Papa.parse(event.target.files[0], {
                header:true,
                complete(result, file) {
                    Meteor.call('parseUpload', result.data, siMdList, (error, response) => {
                        if(error) {
                            Bert.alert(error.reason, 'warning');
                        } else {
                            template.uploading.set(false);
                            Bert.alert('Upload complete', 'success', 'growl-top-right');
                        }
                    });
                    Session.set('siList', '');
                }
            });
        },

        'click .removeSI': function () {
          event.preventDefault();
          const siRemove = Session.get('selectedItem');
          Meteor.call('removeSi', siRemove);
        }


    });

Template.upload.helpers({

    uploading() {
        return Template.instance().uploading.get();
    },
        siNew: function() {
          return Session.get('siList');
        }
});

Template.uploadList.events({

    'click .selectedSiItem': function () {
        const checkMe = this._id;
        Session.set('selectedItem', checkMe);
    },

    'click .selectedSi': function () {
        const SiPoint = this._id;
        Session.set('selectedSiLine', SiPoint);
    }


});

Template.uploadList.helpers({

    siTable: function() {
        return siTable.find({active: 1});
    },

    siContent: function() {
        const siMachineList = Session.get('selectedItem');
        const siIdLoad = siTable.findOne({_id: siMachineList}, {fields: {siNumber: 1}});
        if(!!siIdLoad) {
            const siId = siIdLoad.siNumber;
            return siMd.findOne({_id: siId}).machineList;
        } else {
            //  Bert.alert('No Machine List available or uploaded', 'danger', 'growl-top-right');
        }
    },

    'selectedSingleItem': function() {
        const SiPoint = this._id;
        const selectedSiLine = Session.get('selectedItem');
        if(SiPoint === 'undefined') {
            // do nothing
        } else {
            if (selectedSiLine === SiPoint) {
            return "selected"
            }
        }
    },

       'selectedSiMachine': function() {
           const SiMachine = this._id;
           const selectedSiLine = Session.get('selectedSiLine');
           if(!SiMachine) {
                // do nothing
              } else {
                 if (selectedSiLine === SiMachine) {
                     return "selected"
                 }
              }
       }

});

Template.changeStat.events({

        // solved by Repair
         'click .statusBackground_1': function (e) {
             e.preventDefault();
             let setStatus = 1;
             let selectedMachineId = Session.get('selectedSiLine');
             let selectedSI =  Session.get('selectedItem');
             let SiNumber = siTable.findOne({_id: selectedSI}).siNumber;
             Meteor.call('changeStatus', SiNumber, selectedMachineId, setStatus);
         },

        // moved to SI List
         'click .statusBackground_4': function (e) {
            e.preventDefault();
            let setStatus = 4;
            let selectedMachineId = Session.get('selectedSiLine');
            let selectedSI =  Session.get('selectedItem');
            let SiNumber = siTable.findOne({_id: selectedSI}).siNumber;
            Meteor.call('changeStatus', SiNumber, selectedMachineId, setStatus);
         }
});


Template.siInActive.helpers({

    siInactiveTable: function() {
        return siTable.find({active: 0});
    },

    'selectedInactiveSi': function() {
        const inactiveSi = this._id;
        const selectedInactiveSi = Session.get('selectedItem');
        if (selectedInactiveSi === inactiveSi) {
            return "selected"
        }
    }

});

Template.siInActive.events({

    'click .selectedInactiveSi': function () {
        event.preventDefault();
        const checkMe = this._id;
        Session.set('selectedItem', checkMe);
    },

    'click .reactivateSi': function (e) {
        e.preventDefault();
        const siReact = Session.get('selectedItem');
        Meteor.call('reactSi', siReact);
    }

});

Template.addSpecialItems.helpers({

    pdiItemList: () => {
        return specialPdiItems.find();
    },

    'selectedPdiItem': function() {
        const selectedItem = this._id;
        console.log(selectedItem);
    }
});

Template.addSpecialItems.events({

    'click .selectedSpecialPdiItem': (e) => {
        e.preventDefault();
        const clickMe = this._id;
        console.log(clickMe);
    },

    'submit .addItem': (e) => {
        e.preventDefault();
        const addItem = event.target.specialPdiItem.value;
        Meteor.call('addSpecialPdiItem', addItem);
        event.target.specialPdiItem.value = '';
    }



});