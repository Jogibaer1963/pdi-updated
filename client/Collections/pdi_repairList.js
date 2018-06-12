if(Meteor.isClient) {

    Template.pdi_repairList.helpers({

        showList: function() {
            event.preventDefault();
            return  MachineReady.find({machineId: {$gt:'C4700000'}}, {sort: {date: -1}});
        },

        'selectedClass': function(){
            const openInspect = this._id;
            const selectedPdiMachine = Session.get('selectedPdiMachine');
            if (selectedPdiMachine === openInspect) {
                return "selected"
            }
        }

    });


    Template.pdi_repairList.events({





        'click .showPdiResult': function() {
            const pdiMachine = this._id;
            Session.set('selectedPdiMachine', pdiMachine);
        },

        'click .showPdiSummary': function() {
            event.preventDefault();
        },

        'click #buttonDownload': function () {
            const machineId = Session.get('selectedPdiMachine');
            const result = MachineReady.find({_id:machineId}, {fields: {machineId: 1}}).fetch();
            const machineNr = JSON.stringify(result).slice(15, 23);
            const nameFile = 'fileDownloaded.csv';
            Meteor.call('download_2', machineNr, function (err, fileContent) {
                if (fileContent) {
                    const blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, nameFile);
                }
            });
        },

    });

    Template.pdiInspectList.helpers({

        listContent: function() {
            const pdiMachine = Session.get('selectedPdiMachine');
            return MachineReady.find({_id: pdiMachine});
        },

    });

    Template.editButton.events({

        'click .editEntries': (e) => {
            e.preventDefault();
            const pdiMachine = Session.get('selectedPdiMachine');
            if(pdiMachine) {
                let result = MachineReady.findOne({_id: pdiMachine}).pdiStatus;
                    if(result === 1 ) {
                        localStorage.setItem('editMachine', pdiMachine);
                        FlowRouter.go('/editEntries');
                    } else {
                        console.log('not ready');
                    }
            } else {
                console.log('no machine selected')
            }


        },

    });



}