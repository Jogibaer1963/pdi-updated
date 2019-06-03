Meteor.subscribe('dropDownHistoricMachines');
Meteor.subscribe("machineReadyToGo_2017");
Meteor.subscribe("machineReadyToGo_2018");
Meteor.subscribe("machineReadyToGo_2016");
Meteor.subscribe("preSeriesMachine");

Session.set('selectedPdiMachine', '');
Session.set('selectedPreMachine', '');

    Template.pdi_repairList.helpers({

        showList: function() {
            let collectionName = Session.get('collectionName');
            if (collectionName === '2016') {
                Session.set('year', '2016');
                return  machineReadyToGo_2016.find({machineId: {$gt:'C4700000'}},
                                                   {sort: {date: -1}});
            } else if (collectionName === '2017') {
                Session.set('year', '2017');
                return  machineReadyToGo_2017.find({machineId: {$gt:'C4700000'}},
                                                    {sort: {date: -1}});
            } else if (collectionName === '2018') {
                Session.set('year', '2018');
                return  machineReadyToGo_2018.find({machineId: {$gt:'C4700000'}},
                                                   {sort: {date: -1}});
            } else if (collectionName === '2019') {
                Session.set('year', '2019');
                return  MachineReady.find({machineId: {$gt:'C4700000'}},
                                          {sort: {date: -1}});
            } else if (collectionName === 'C8x-pre-Series' ) {
                Session.set('year', 'Pre Series');
                return preSeriesMachine.find({}, {sort: {preMachineId: 1}}).fetch();
            }
        },

        year: () => {
          return Session.get('year');
        },

        'selectedClass': function(){
            const openInspect = this._id;
            const selectedPdiMachine = Session.get('selectedPdiMachine');
            if (selectedPdiMachine === openInspect) {
                return "selected"
            }
        },

        historicPdi: function () {
            return dropDownHistoricMachines.find({}).fetch();
        },

        'selectedComponent': function () {
            let component = this._id;
            let selected = Session.get('selectedComponent');
            if (component === selected) {
                Session.set('componentChosen', 1);
                return 'selected'
            }
        },

    });

/* ToDo make Battery, OMM and repair list editable */


    Template.pdi_repairList.events({

        'click .showPdiResult': function() {
            const pdiMachine = this._id;
            Session.set('selectedPdiMachine', pdiMachine);
        },

        'click .printButton': (e) => {
            e.preventDefault();
            FlowRouter.go('/pdi_printOut');

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
        },


        'click .histPdi': function () {
            const selected = this._id;
            Session.set('selectedComponent', selected,);
            Meteor.call('historicPdi', selected,  function (err, collectionName) {
                Session.set('collectionName', collectionName);
            });
        },


    });

    Template.pdiInspectList.helpers({

        listContent: function() {
            const pdiMachine = Session.get('selectedPdiMachine');
            const pdiYear = Session.get('year');
            switch(pdiYear) {
                case '2016':
                    let result =  machineReadyToGo_2016.find({_id: pdiMachine}).fetch();
                    let pdiTime = result._id;
                break;
                case '2017':
                    return  machineReadyToGo_2017.find({_id: pdiMachine});
                break;
                case '2018':
                    return  machineReadyToGo_2018.find({_id: pdiMachine});
                break;
                case '2019':
                    return  MachineReady.find({_id: pdiMachine});
                break;
                case 'Pre Series':
                    return preSeriesMachine.find({_id: pdiMachine},
                        {sort: {preMachineId: 1}});
            }

        },

        year: () => {
            return Session.get('year');
        },

        listOutput: () => {
            const selectedPreMachineId = Session.get('selectedPdiMachine');
            let checkResult = {} ;
            try {
                const result = preSeriesMachine.findOne({_id: selectedPreMachineId},
                    {fields: {checkItems: 1}}).checkItems;
                const resultArray = result.filter((fail) => {
                    return fail.failureStatus === 2;
                });
                let path1 = Session.get('ipAndPort');
             //   let path1= "http://192.168.0.109:3300/images/";
                return returnArray = resultArray.map(resultExtract => {
                    let nods = "?a=" + Math.random();
                    checkResult = {id : resultExtract._id,
                        failureStatus: resultExtract.failureStatus,
                        imagePath : path1 + resultExtract.imagePath + nods,
                        errorDescription: resultExtract.errorDescription};
                    return checkResult;
                });

            }
            catch (e) {
            }
        },

    });

