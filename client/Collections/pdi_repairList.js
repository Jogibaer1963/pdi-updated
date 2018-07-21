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

/* ToDo make Battery, OMM and repairlist editable */


    Template.pdi_repairList.events({

        'click .showPdiResult': function() {
            const pdiMachine = this._id;
            Session.set('selectedPdiMachine', pdiMachine);
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

        'submit .searchMe': () => {
            event.preventDefault();
            let machineId = event.target.searchMachine.value;
            let id = MachineReady.findOne({machineId: machineId})._id;
            Session.set('selectedPdiMachine', id);
        }


    });

    Template.pdiInspectList.helpers({

        listContent: function() {
            const pdiMachine = Session.get('selectedPdiMachine');
            return MachineReady.find({_id: pdiMachine});
        },

    });

}