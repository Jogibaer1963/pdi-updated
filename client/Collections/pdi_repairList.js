Meteor.subscribe('dropDownHistoricMachines');
Meteor.subscribe("machineReadyToGo_2019");
Meteor.subscribe("preSeriesMachine");
Session.set('selectedPdiMachine', '');
Session.set('selectedPreMachine', '');

    Template.pdi_repairList.helpers({

        showList: function() {
            let collectionName = Session.get('collectionName');
            if (collectionName === '2019') {
                Session.set('year', '2019');
                return  MachineReady.find({machineId: {$gt:'C4700000'},
                                                            dateOfCreation: {$gt: "2018-09-01",
                                                                             $lte: "2019-08-30"}},
                                                    {sort: {date: -1}});
            } else if (collectionName === '2020') {
                Session.set('year', '2020');
                return  MachineReady.find({machineId: {$gt:'C4700000'},
                                                   dateOfCreation: {$gt: "2019-09-01"}},
                                          {sort: {date: -1}});
            } else if (collectionName === 'C8x-pre-Series' ) {
                Session.set('year', 'Pre Series');
                return preSeriesMachine.find({}, {sort: {preMachineId: 1}}).fetch();
            }
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

        'submit .searchMe': (e) => {
            e.preventDefault();
            let machineId = e.target.searchMachine.value;
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

        pdiDate: function() {
            let minutesNew = '';
            try {
            let pdiMachine = Session.get('result');
            let current_datetime = pdiMachine[0].startPdiDate;
            let current_minutes = current_datetime.getMinutes();
            if (current_minutes < 10) {
                minutesNew = '0' + current_minutes;
            } else {
                 minutesNew = current_minutes;
            }
             return current_datetime.getFullYear() + "-" +
                             (current_datetime.getMonth() + 1) + "-" +
                             current_datetime.getDate() + " " +
                             current_datetime.getHours() + ":" +
                             minutesNew;
            } catch {}
        },

        ommAndBatt: function () {
            let returnArray = [];
            let pdiMachine = Session.get('selectedPdiMachine');
            let year = Session.get('year');
            try {
                if (year === 'Pre Series') {
                    let result = preSeriesMachine.find({_id: pdiMachine});
                    Session.set('result', result);
                    return result;
                } else {
                    let result = MachineReady.find({_id: pdiMachine}).fetch();
                    Session.set('result', result);
                    let omms = result[0].omms;
                    let batteries = result[0].batteries;
                    let newResult = Object.assign(omms, batteries);
                    returnArray.push(newResult);
                }
            } catch {}
            //console.log(returnArray);
            return returnArray;
        },

        listContent: function() {
            let repairInfos = Session.get('repairInfos');
            const pdiMachine = Session.get('result');
            let newIssuesFound = [];
            try {
                if (pdiMachine) {
                    newIssuesFound = pdiMachine[0].newIssues;
                }
                newIssuesFound.forEach((element) => {
                    element.pictureLocation = repairInfos + element.pictureLocation;
                });
                return newIssuesFound;
            } catch {}
        },

    });

