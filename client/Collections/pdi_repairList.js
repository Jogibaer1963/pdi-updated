Meteor.subscribe('historicMachines')

Session.set('selectedPdiMachine', '');
Session.set('selectedPreMachine', '');

    Template.pdi_repairList.helpers({

        'selectedHistoric': function(){
            const openInspect = this._id;
            const selectedPdiMachine = Session.get('selectedPdiMachine');
            if (selectedPdiMachine === openInspect) {
                return "selected"
            }
        },

        historicMachine: function () { // Machines older than FY 2023, table view
            let returnResult;
            Meteor.call('historicMachine', function (err, response) {
                if(response) {
                 //   console.log(response)
                    returnResult = response
                } else if (err) {

                }
                Session.set('historicMachines', returnResult)
            })
            return Session.get('historicMachines')
        },

        historicCount: ()=> {
            let result = historicMachines.find({}, {fields: {_id: 1}}).fetch()
            if (result.length === 0) {
                return "Searching........."
            } else {
                return result.length + ' Machines Found'
            }

        }
    });



/* ToDo make Battery, OMM and repair list editable */

    Session.set('MachineSortStatus', 0);

    Template.pdi_repairList.events({



        'click .historic-machines-selected': function (e) {
            e.preventDefault();
            const pdiMachine = this._id;
            let status = true;
           // console.log(pdiMachine)
            Session.set('status', status)
            Session.set('selectedPdiMachine', pdiMachine);

        },

        'click .machine-sort': () => {
            let status = Session.get('MachineSortStatus');
            if (status === 0) {
                Session.set('MachineSortStatus', 1)
            } else if (status === 1) {
                Session.set('MachineSortStatus', 0)
            }
        },

        'click .date-sort': () => {
            
        },

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
            Session.set('status', false);
            Session.set('selectedPdiMachine', id);
        },

    });

    Template.pdiInspectList.helpers({

        pdiDate: function() {
            let minutesNew = '';
            try {
            let pdiMachine = Session.get('result');
            let current_datetime = pdiMachine.startPdiDate;
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

        machineNr: function() {
            try {
                let result = Session.get('result');
                return result.machineId
            } catch (e) {

            }

        },

        ommAndBatt: function () {
            let returnArray = [];
            let status = Session.get('status');
            let pdiMachine = Session.get('selectedPdiMachine');
            let year = Session.get('year');
            try {
                if (year === 'Pre Series') {
                    let result = preSeriesMachine.find({_id: pdiMachine});
                    Session.set('result', result);
                    return result;
                } else if (status === true) {
                    let result = historicMachines.findOne({_id: pdiMachine});
                    Session.set('result', result);
                    let omms = result.omms;
                    let batteries = result.batteries;
                    let newResult = Object.assign(omms, batteries);
                    returnArray.push(newResult)
                    Session.set('returnArray', returnArray)
                } else {
                    let result = MachineReady.findOne({_id: pdiMachine});
                    Session.set('result', result);
                    let omms = result.omms;
                    let batteries = result.batteries;
                    let newResult = Object.assign(omms, batteries);
                    returnArray.push(newResult);
                    Session.set('returnArray', returnArray)
                }
            } catch {}
            returnArray = Session.get('returnArray')
            return returnArray;
        },

        listContent: function() {
            let repairInfos = Session.get('repairInfos');
            const pdiMachine = Session.get('result');
            let newIssuesFound = [];
            try {
                if (pdiMachine) {
                    newIssuesFound = pdiMachine.newIssues;
                }
                newIssuesFound.forEach((element) => {
                    element.pictureLocation = repairInfos + element.pictureLocation;
                });
                return newIssuesFound;
            } catch {}
        },

    });

