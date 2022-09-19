Meteor.subscribe('SuppliersList');
Meteor.subscribe('TeamList');
Meteor.subscribe('orderParts');

const Highcharts = require('highcharts');

Session.set('teamChosen', false)
Session.set('teamResult', false)
Session.set('overViewAnalyzing', true);
Session.set('searchWithKeyWord', false);
Session.set('responseTeam', false);
Session.set('issueByComponent', false);
Session.set('issueBySupplier', false);
Session.set('editResponsibility', false);
Session.set('advanceSearch', false);
Session.set('pdi', false);
Session.set('toggle-button', 0)
Session.set('machine-look-up', false)

// **********  Session for 1 specific Machine in Template Repair Time per Machine ****************
Session.set('specificMachine', false)
Session.set('machineResultNr', false);
Session.set('userResult', false);
//  ************************************************************************************************
Template.analyzing.onDestroyed(() => {
    Session.set('teamChosen', false)
    Session.set('teamResult', false)
    Session.set('overViewAnalyzing', true);
    Session.set('searchWithKeyWord', false);
    Session.set('responseTeam', false);
    Session.set('issueByComponent', false);
    Session.set('issueBySupplier', false);
    Session.set('editResponsibility', false);
    Session.set('advanceSearch', false);
    Session.set('pdi', false);
})

//  *****************************  Header  and   Buttons  ********************************************

Template.analyzing.helpers ({
    // activating Templates

    overViewAnalyzing: () => {
        return Session.get('overViewAnalyzing');
    },

    searchWithKeyWord: () => {
        return Session.get('searchWithKeyWord')
    },

    responseTeam: () => {
        return Session.get('responseTeam');
    },

    issueByComponent: () => {
        return Session.get('issueByComponent');
    },

    issueBySupplier: () => {
        return Session.get('issueBySupplier');
    },

    pdi: () => {
        return Session.get('pdi')
    },

    options: () => {
        return Session.get('options');
    },



});

Template.analyzing.events ({

    'click .btn-over-view': (e) => {
        e.preventDefault();
        Session.set('overViewAnalyzing', true);
        Session.set('searchWithKeyWord', false)
        Session.set('responseTeam', false);
        Session.set('issueByComponent', false);
        Session.set('issueBySupplier', false);
        Session.set('pdi', false);
        Session.set('options', false);
    },

     'click .btn-key-word': (e) => {
         e.preventDefault();
         Session.set('overViewAnalyzing', false);
         Session.set('searchWithKeyWord', true)
         Session.set('responseTeam', false);
         Session.set('issueByComponent', false);
         Session.set('issueBySupplier', false);
         Session.set('pdi', false);
         Session.set('options', false);
     },

    'click .btn-response-team': (e) => {
        e.preventDefault();
        Session.set('teamChosen', false)
        Session.set('teamResult', false)
        Session.set('overViewAnalyzing', false);
        Session.set('searchWithKeyWord', false);
        Session.set('responseTeam', true);
        Session.set('issueByComponent', false);
        Session.set('issueBySupplier', false);
        Session.set('pdi', false);
        Session.set('options', false);
        prepareTeamResult();
    },

    'click .btn-component-search': (e) => {
        e.preventDefault();
        Session.set('overViewAnalyzing', false);
        Session.set('searchWithKeyWord', false);
        Session.set('responseTeam', false);
        Session.set('issueByComponent', true);
        Session.set('issueBySupplier', false);
        Session.set('pdi', false);
        Session.set('options', false);
    },

    'click .btn-response-supplier': (e) => {
        e.preventDefault();
        Session.set('overViewAnalyzing', false);
        Session.set('searchWithKeyWord', false);
        Session.set('responseTeam', false);
        Session.set('issueByComponent', false);
        Session.set('issueBySupplier', true);
        Session.set('pdi', false);
        Session.set('options', false);
    },

    'click .btn-pdi': (e) => {
        e.preventDefault();
        Session.set('overViewAnalyzing', false);
        Session.set('searchWithKeyWord', false);
        Session.set('responseTeam', false);
        Session.set('issueByComponent', false);
        Session.set('issueBySupplier', false);
        Session.set('pdi', true);
        Session.set('options', false);
    },

    'click .btn-options': (e) => {
        e.preventDefault();
        Session.set('overViewAnalyzing', false);
        Session.set('searchWithKeyWord', false);
        Session.set('responseTeam', false);
        Session.set('issueByComponent', false);
        Session.set('issueBySupplier', false);
        Session.set('pdi', false);
        Session.set('options', true);
    }


});

// *****************************************  Analyzing Overview Page 1 ****************************************

Template.analyzingOverView.helpers({

    machineCount: function () {
        let completedMachines = [];
        let issuesFound = 0;
        let result = MachineReady.find({pdiStatus: 1}, {fields: {newIssues: 1,
                machineId: 1, machineNr: 1,  omms: 1, amountOnOrder: 1
               }}).fetch();
        Session.set('analyzingOverView', result)
        result.forEach((element) => {
           completedMachines.push(element.machineId);
           element.newIssues.forEach((element2) => {
                if (element2.responsible === "N/A") {

                } else {
                        issuesFound ++
                   }
            })

        });
        let machines = completedMachines.length;
        return {machines, issuesFound};
    }

});

Template.analyzingOverView.events({



});

//  ************************  Search with Key words  ****************************

Template.analyzingWithKeyWords.helpers({

    stringSearch: () => {
        let repairInfos = Session.get('repairInfos');
        let resultArray = [];
        let searchResult = {};
        let searchString = (Session.get('searchString')).toUpperCase();
        try {
            let result = MachineReady.find({},
                                            {fields: {machineId: 1,
                                                              newIssues: 1
                                                                         }}).fetch();
            result.forEach((element) => {
                let stringFind = element.newIssues;
                stringFind.forEach((element2) => {
                    let stringAnalyze = element2.errorDescription.toUpperCase();
                    if (stringAnalyze.includes(searchString) === true) {
                        searchResult = {
                            machineNr : element.machineId,
                            errorDescription : element2.errorDescription,
                            pictureLocation : repairInfos + element2.pictureLocation
                        }
                        resultArray.push(searchResult);
                       // console.log('first ', resultArray)
                    }
                })
            })
        } catch(e) {}
       resultArray.sort( (a, b) => {
            if (a.machineNr > b.machineNr) return -1
            return a.machineNr < b.machineNr ? 1 : 0
        });
      //  console.log('second ', resultArray)
        Session.set('resultCount', resultArray.length);
        return resultArray;
    },

    countResult: () => {
        return Session.get('resultCount');
    }

});

Template.analyzingWithKeyWords.events({

    'submit .searchText': (e) => {
        e.preventDefault();
        let textString = e.target.searchText.value;
        Session.set('searchString', textString);
    }

})


// **************************************  Responsible Team  *********************************************

Template.analyzingResponseTeam.helpers({

    teamTables: () => {
        let teamResult =  prepareTeamResult();  // load all Results for all Teams when template is called
        let team = parseInt(Session.get('teamChosen'));
        let machineArray = [];
        let repairArray = [];
        let machineRepairArray = [];
        let machineNr = '';
        let repairTime = 0;
        try {
            teamResult[team].sort(function(a, b) {
              return a.bay19Planned > b.bay19Planned ? 1: -1
                 }).reverse();
            teamResult[team].forEach((element) =>  {
                machineNr = element.machineNr;
                if (element.repairTime === undefined || element.repairTime === "") {
                    repairTime = 0;
                } else {
                    repairTime = parseInt(element.repairTime);
                }
                let machineRepair = {
                    name: machineNr,
                    value: repairTime
                }
                machineRepairArray.push(machineRepair)
            })
        } catch(err) {}
        // summary repair time to each single machine number. Name 'name' in object must match
        // 'name' in function !!
        const res = Array.from(machineRepairArray.reduce(
            (m, {name, value}) => m.set(name, (m.get(name) || 0) + value), new Map
        ), ([name, value]) => ({name, value}));
        // build Arrays for Graph
        res.forEach((element) => {
            machineArray.push(element.name);
            repairArray.push(element.value);
        })
        Session.set('machineTeamArray', machineArray);
        Session.set('repairTeamArray', repairArray);
        Session.set('teamResult', teamResult[team])
        return teamResult[team]
    },

    team: () => {
        return Session.get('teamResult');
    },

    teamList: () => {
        return TeamList.find().fetch();
    },

     teamRepairTime: () => {
             // Gather data:
             let team = Session.get('teamChosen');
             let machine = Session.get('machineTeamArray');
             let repairTime = Session.get('repairTeamArray');
             let sumRepTime = repairTime.reduce((a, b) => a + b, 0);
             // Use Meteor.defer() to create chart after DOM is ready:
             let titleText =  'For ' + team + ' were ' + sumRepTime + ' min total on Repair Time counted';
             Meteor.defer(function() {
                 // Create standard Highcharts chart with options:
                 Highcharts.chart('chart_2', {
                     title: {
                         text: titleText
                     },
                     tooltip: {
                         shared: true
                     },
                     chart: {
                         style: {
                             fontFamily: '\'Unica One\', sans-serif'
                         },
                         plotBorderColor: '#606063',
                         height: 500,
                         width: 900,
                         zoomType: 'xy'
                     },
                     yAxis: {
                         categories: [],
                         title: {enabled: true,
                             text: 'Repair Time in minutes',
                             style: {
                                 fontWeight: 'normal'
                             }
                         }
                     },
                     xAxis: {
                         categories: machine,
                         title: {
                             enabled: true,
                             text: 'Machine',
                             style: {
                                 fontWeight: 'normal'
                             }
                         }
                     },
                     series: [
                         {
                             name: 'Repair Time',
                             type: 'column',
                             data: repairTime
                         }
                     ]
                 });
             });
     },


     //   *******************   team tables  ***********************

    team1Amount: () => {
        return Session.get('team1Amount');
    },

    team2Amount: () => {
        return Session.get('team2Amount');
    },

    team3Amount: () => {
        return Session.get('team3Amount');
    },

    team4Amount: () => {
        return Session.get('team4Amount');
    },

    team5Amount: () => {
        return Session.get('team5Amount');
    },

    teamTestBayAmount: () => {
        return Session.get('teamTestBayAmount');
    },

    teamSupplierAmount: () => {
        return Session.get('teamSupplierAmount');
    },

    ctdAmount: () => {
        return Session.get('ctdAmount');
    },

    rAndD_Amount: () => {
        return Session.get('rAndD_Amount');
    },

    unknownAmount: () => {
        return Session.get('unknownAmount');
    },

    notApplicableAmount: () => {
        return Session.get('notApplicableAmount');
    },

    undefinedIssuer: () => {
        return Session.get('undefinedIssuer');
    },



    'selectedRow': function(){
        let selectedMachine = this._id;
        let selected = Session.get('selectedFailure')
        if (selectedMachine === selected) {
            return 'selected'
        }
    },

});


Template.analyzingResponseTeam.events({
 //  ************  select Team Buttons  ****************

    'click .team-chooser': function (e) {
        e.preventDefault();
        let teamChosen = e.target.name;
        Session.set('teamChosen', teamChosen)
    },


//  ***********   Select new Team in Table  ***********
    'click .machineRow': function(e){
        e.preventDefault();
        try {
            const failureId = this._id;
            const machineId = this.machineId;
            const select = e.target;
            const selectedOption = select.options[select.selectedIndex];
            const teamChosen = selectedOption.value
            Session.set('selectedFailure', failureId);
            if (teamChosen) {
               Meteor.call('choseTeam',teamChosen, failureId, machineId)
            }
        } catch(err) {}
    },

});

// **************************************** Analyzing Supplier ******************************************

Template.analyzingSupplier.helpers({

    issueCount: () => {
      return Session.get('issuesCount')
    },

    supplierIssue: function () {
         let supplierNames = [];
         let supplierResult = SuppliersList.find({}).fetch();
         supplierResult.forEach((element) => {
             supplierNames.push(element.supplier)
         })
         let result, toggle, sortOrder, repairInfos, machineLookUp, machine;
         toggle = Session.get('toggle-button');
         sortOrder = Session.get('sortOrder')
         repairInfos = Session.get('repairInfos');
         machineLookUp = Session.get('machine-look-up');
         machine = Session.get('machine-number');
        let supplierArray = [];
        let supplierIssues = {};
        // search for Machine, pictures will be displayed
        if (machineLookUp === true) {
           result = MachineReady.findOne({machineId: machine}, {
              fields: {machineNr: 1,  machineId: 1, newIssues: 1, pdiPerformer: 1, amountOnOrder: 1}})
                let pdiPerformer = result.pdiPerformer;
                let machineNr = result.machineId;
                let issueArray = result.newIssues;
                let amountOnOrder = result.amountOnOrder;
                issueArray.forEach((element2) => {
                    if (element2.checkStatus === true) {
                        if (element2.responsible === "N/A") {
                        } else if (element2.responsible !== "N/A")   {
                            supplierIssues = {
                                _id: element2._id,
                                machineNr: machineNr,
                                pdiPerformer:  pdiPerformer,
                                errorDescription: element2.errorDescription,
                                repairTech: element2.repairTech,
                                repairComment: element2.repairComment,
                                responsible: element2.responsible,
                                repairStatus: element2.repairStatus,
                                pictureLocation : repairInfos + element2.pictureLocation,
                                repairTime: element2.repairTime,
                                qualityComment: element2.qualityComment,
                                claimNumber: element2.claimNumber,
                                partNumber: element2.partNumber,
                                partsOrder : element2.partsOrder,
                                amountOnOrder : amountOnOrder
                            }
                            supplierArray.push(supplierIssues)
                        }
                    }
                })
            return supplierArray;
        } else {
        }
            result = MachineReady.find({pdiStatus: 1},
                {fields: {machineNr: 1, newIssues: 1, machineId: 1, pdiPerformer: 1, amountOnOrder: 1}}).fetch();
        Session.set('issuesCount', result.length)
        try {
            if (toggle === 0) {
                result.forEach((element) => {
                    let pdiPerformer = element.pdiPerformer;
                    let machineNr = element.machineId;
                    let issueArray = element.newIssues;
                    let amountOnOrder = element.amountOnOrder;
                    issueArray.forEach((element2) => {
                        if (element2.checkStatus === true) { // issue is active in List
                            if (element2.responsible === "N/A") {
                            } else if (element2.responsible !== "N/A" && element2.repairTime > '10')   {
                                supplierIssues = {
                                    _id: element2._id,
                                    machineNr: machineNr,
                                    pdiPerformer:  pdiPerformer,
                                    errorDescription: element2.errorDescription,
                                    repairTech: element2.repairTech,
                                    repairComment: element2.repairComment,
                                    responsible: element2.responsible,
                                    repairStatus: element2.repairStatus,
                                    pictureLocation : '../../public/noPicture.JPG',
                                    repairTime: element2.repairTime,
                                    qualityComment: element2.qualityComment,
                                    claimNumber: element2.claimNumber,
                                    partNumber: element2.partNumber,
                                    partsOrder : element2.partsOrder,
                                    amountOnOrder : amountOnOrder
                                }
                                supplierArray.push(supplierIssues)
                            }
                       }
                    })
                })
            } else if (toggle === 1) {
                result.forEach((element) => {
                    let pdiPerformer = element.pdiPerformer;
                    let machineNr = element.machineId;
                    let issueArray = element.newIssues;
                    let amountOnOrder = element.amountOnOrder;
                    issueArray.forEach((element2) => {
                        if (element2.checkStatus === false) { // issue is closed and disappeared from List
                            if (element2.responsible === "N/A") {
                            } else  if (element2.responsible !== "N/A" && element2.repairTime > '10')   {
                                supplierIssues = {
                                    _id: element2._id,
                                    machineNr: machineNr,
                                    pdiPerformer:  pdiPerformer,
                                    errorDescription: element2.errorDescription,
                                    repairTech: element2.repairTech,
                                    repairComment: element2.repairComment,
                                    responsible: element2.responsible,
                                    repairStatus: element2.repairStatus,
                                    pictureLocation : '../../public/noPicture.JPG',
                                    repairTime: element2.repairTime,
                                    qualityComment: element2.qualityComment,
                                    claimNumber: element2.claimNumber,
                                    partNumber: element2.partNumber,
                                    partsOrder : element2.partsOrder,
                                    amountOnOrder : amountOnOrder
                                }
                                supplierArray.push(supplierIssues)
                            }

                        }
                    })
                })
            } else if (toggle === 2) {
                let supplier;
                result.forEach((element) => {
                    let pdiPerformer = element.pdiPerformer;
                    let machineNr = element.machineId;
                    let issueArray = element.newIssues;
                    let amountOnOrder = element.amountOnOrder;
                    issueArray.forEach((element2) => {
                        for(supplier of supplierNames) {
                            if (element2.responsible === supplier && element2.repairTime >= '10')   {
                                supplierIssues = {
                                    _id: element2._id,
                                    machineNr: machineNr,
                                    pdiPerformer:  pdiPerformer,
                                    errorDescription: element2.errorDescription,
                                    repairTech: element2.repairTech,
                                    repairComment: element2.repairComment,
                                    responsible: element2.responsible,
                                    repairStatus: element2.repairStatus,
                                    pictureLocation : '../../public/noPicture.JPG',
                                    repairTime: element2.repairTime,
                                    qualityComment: element2.qualityComment,
                                    claimNumber: element2.claimNumber,
                                    partNumber: element2.partNumber,
                                    partsOrder : element2.partsOrder,
                                    amountOnOrder : amountOnOrder
                                }
                                supplierArray.push(supplierIssues)
                            }
                        }
                    })
                })
            }
        } catch(e) {}
     // sorting per machine
        sortOrder = Session.get('sortOrder')
        if (sortOrder === 1) {
            // sort by Machine number
            supplierArray.sort((a, b) => {
                if (a.machineNr > b.machineNr) return -1
                return a.machineNr < b.machineNr ? 1 : 0
            })
        }  else if (sortOrder === 2) {
            supplierArray.sort((a, b) => {
                if (a.pdiPerformer > b.pdiPerformer) return -1
                return a.pdiPerformer < b.pdiPerformer ? 1 : 0
            })

        } else if (sortOrder === 3) {
            supplierArray.sort((a, b) => {
                if (a.repairTech > b.repairTech) return -1
                return a.repairTech < b.repairTech ? 1 : 0
            })

        } else if (sortOrder === 6) {
            supplierArray.sort((a, b) => {
                if (a.responsible > b.responsible) return -1
                return a.responsible < b.responsible ? 1 : 0
            })

        } else if (sortOrder === 7) {
            supplierArray.sort( (a, b) => {
                if (a.repairTime > b.repairTime) return -1
                return a.repairTime < b.repairTime ? 1 : 0
            })

        } else if (sortOrder === 12) {
            supplierArray.sort( (a, b) => {
                if (a.qualityComment > b.qualityComment) return -1
                return a.qualityComment < b.qualityComment ? 1 : 0
            })

        } else if (sortOrder === 13) {
            supplierArray.sort( (a, b) => {
                if (a.claimNumber > b.claimNumber) return -1
                return a.claimNumber < b.claimNumber ? 1 : 0
            })
        } else if (sortOrder === 14) {
            supplierArray.sort( function(b, a) {
               return ('' + b.partsOrder).localeCompare(a.partsOrder)
            })
        }
        return supplierArray;
    },

    'selectedSupplierRow': function(){
        let selectedIssue = this._id;
        let selected = Session.get('selectedFailure')
        if (selectedIssue === selected) {
            return 'selected'
        }
    },

    supplierList: function () {
       return SuppliersList.find({}).fetch();
    },

    teamList: () => {
        return TeamList.find().fetch();
    },

    supplierTable: () => {
        return SuppliersList.find().fetch();
    },

    user: () => {
        return Session.get('userResult');
    },

    partsOrdered: () => {
        let resultArray = []
        let result = orderParts.find({}, {fields: {partsOrder: 1}}).fetch()
        result.forEach(function(element) {
            if (element.partsOrder === 2) {
                resultArray.push(element.partsOrder)
            }
        })
        return resultArray.length
    },

    orderResult: () => {
       let result = orderParts.find({}).fetch();
        result.sort( (a, b) => {
            if (a.partsOrder > b.partsOrder) return -1
            return a.partsOrder < b.partsOrder ? 1 : 0
        })
        return result
    },

    quality_Comment: () => {
        return Session.get('quality_Comment')
    },

    claim_Number: () => {
      return Session.get('claim_Number')
    },

    part_Number: () => {
      return Session.get('part_Number')
    },





    'qualityResponse':function () {
        let line = this._id;
        let selectedLine = Session.get('selectedLine');
        if (line === selectedLine) {
            return 'selected';
        }
    }
    //  *************************************************************************

});

Template.analyzingSupplier.events({

    'click .selectedSupplier': function (e) {
        e.preventDefault()
        let selectedSupplier = this.supplier;
        Session.set('selectedSupplierResult', selectedSupplier);
    },

    'click .buttonReturn': (e) => {
        e.preventDefault();
        FlowRouter.go('analyzing')
    },

    'click .buttonParts': (e) => {
        e.preventDefault();
    },

    'submit .qualityComment': function (e) {
        e.preventDefault();
        let comment, claimNr, issueId,machineNr;
        comment = document.getElementById('messageField').value;
        claimNr = document.getElementById('claimField').value;
        issueId = Session.get('selectedFailure');
        machineNr = Session.get('selectedSupplierMachine')
    //    console.log('Machine ', machineNr, 'issue ID', issueId, 'Comment ', comment, 'Claim Nr ', claimNr)
        Meteor.call('updateSupplierIssues', machineNr, issueId, comment, claimNr)
        document.getElementById('messageField').value = '';
        document.getElementById('claimField').value = '';
        Session.set('selectedFailure', '');
        Session.set('selectedSupplierMachine', '');
    },

    // */*********************  select Row with failure  ***********

    'click .selectedIssue': function(e){
        e.preventDefault();
        try {
            const failureId = this._id;
            const machineNr = this.machineNr;
            let amountOrder = this.amountOnOrder;
            let q_comments = this.qualityComment;
            let claim_number = this.claimNumber;
            let part_number = this.partNumber;
         //   console.log('result ', failureId, machineNr, amountOrder, q_comments, part_number)
            Session.set('selectedFailure', failureId);
            Session.set('selectedSupplierMachine', machineNr);
            Session.set('amountOnOrder', amountOrder)
            Session.set('quality_Comment', q_comments);
            Session.set('claim_Number', claim_number)
            Session.set('part_Number', part_number)
        } catch(err) {}
    },

    'click .pdiMachineField': (e) => {
        e.preventDefault();
        Session.set('')
    },

   // ************  select supplier from drop down, get selected row and write to database

    'change  #category-select': function (event) {
        event.preventDefault();
        const selectedSupplier = $(event.currentTarget).val();
        let machineNr = Session.get('selectedSupplierMachine');
        let issueId = Session.get('selectedFailure');
        if (issueId !== 'undefined' && selectedSupplier !== 'undefined') {
            Meteor.call('addSupplierToRepair', machineNr, issueId, selectedSupplier)
        }
    },

   'click .machine-sort-button': () => {
        // sort by machine number
       console.log('clicked')
       Session.set('setOrder', 1);
       console.log(Session.get('setOrder'))
   },

    'click .pdiTech-sort-button': () => {
        console.log('clicked')
        // sort by PDI Tech
        Session.set('sortOrder', 2)
    },

    'click .repTech-sort-button': () => {
        // sort by PDI Tech
        Session.set('sortOrder', 3)
    },

    'click .issuer-sort-button': () => {
        Session.set('sortOrder', 6)
    },

    'click .repairTime-sort-button': () => {
        Session.set('sortOrder', 7)
    },

    'click .qualityComments-sort-button': () => {
        Session.set('sortOrder', 12)
    },

    'click .qualityClaim-sort-button': () => {
        Session.set('sortOrder', 13)
    },

    'click .parts-sort-button': () => {
        Session.set('sortOrder', 14)
    },

    'submit .look-up': function(e) {
        e.preventDefault();
        let machine_string = e.target.lookUp.value;
        let machine = machine_string.toUpperCase();
        let result = MachineReady.findOne({machineId: machine}, {fields: {machineId: 1}})
        if (result === undefined) {
            window.alert('Machine does not exists')
        } else {
            Session.set('specificMachine', machine);
            Session.set('machine-look-up', true);
            Session.set('machine-number', machine)
            if (machine === '') {
                Session.set('machine-look-up', false)
            }
            e.target.lookUp.value = '';
        }
    },

    'click .toggle-list': function (e) {
        e.preventDefault();
        let toggle = Session.get('toggle-button')
        if(toggle === 1) {
            Session.set('toggle-button', 0)
        } else {
            Session.set('toggle-button', 1);
        }
    },

    'click .supplier-only': (e) => {
        e.preventDefault()
        let toggle = Session.get('toggle-button')
        if(toggle === 1 || toggle === 0) {
            Session.set('toggle-button', 2)
        } else {
            Session.set('toggle-button', 0);
        }
       // console.log(Session.get('toggle-button'))
    },

    'submit .quality-comment': function(e) {
        e.preventDefault();
        let selectedMachine, selectedLine, qualityText, amountOnOrder, partsOnOrderInt,
            claimNumber, partNumber;
        selectedMachine = Session.get('selectedSupplierMachine');
        selectedLine = Session.get('selectedFailure');
        amountOnOrder = Session.get('amountOnOrder');
      //  console.log('first ', amountOnOrder)
        if (amountOnOrder === undefined) {
     //       console.log('before ', amountOnOrder)
            amountOnOrder = 0;
     //      console.log('after ', amountOnOrder)
        }
        qualityText = e.target.quality.value;
        claimNumber = e.target.claimNumber.value;
        partNumber = e.target.partNumber.value;
        let partsOrder= [];
        $('input[name = partsAvailability]:checked').each(function() {
            partsOrder.push($(this).val());
        });
        if (partsOrder.length > 0) {
            partsOnOrderInt = parseInt(partsOrder[0])
            if (partsOnOrderInt === 2) {
                // value 2 is for a new Order
                amountOnOrder = amountOnOrder + 1;
                Session.set('amountOnOrder', amountOnOrder)
            } else if (partsOnOrderInt === 1) {
                // value 1 is part is arrived
                amountOnOrder = amountOnOrder -  1;
                Session.set('amountOnOrder', amountOnOrder - 1)
            }
        } else {
            partsOnOrderInt = 0
        }
        if (selectedLine === '') {
            alert('Mark Line prior Submitting')
        } else {
         //  console.log('Order final', selectedMachine,
          //      selectedLine, qualityText, partsOnOrderInt, amountOnOrder, claimNumber, partNumber)
                Meteor.call('updateQualityComment', selectedMachine,
                selectedLine, qualityText, partsOnOrderInt, amountOnOrder, claimNumber, partNumber)
        }
        e.target.quality.value = '';
        document.getElementById('partsOnOrder').checked= false;
        document.getElementById('partsArrived').checked= false;
        document.getElementById('claimNumber').value = '';
        document.getElementById('partNumber').value = '';
        Session.set('selectedLine', '');
        Session.set('selectedFailure', '');
        Session.set('selectedSupplierMachine', '');
        Session.set('amountOnOrder', '')
        Session.set('quality_Comment', '');
        Session.set('claim_Number', '')
        Session.set('part_Number', '')

    },

    'click .issue-closed': function (e) {
        e.preventDefault();
        let id, machine;
        id = this._id;
        machine = this.machineNr;
        Meteor.call('issueClosed', id, machine)
    },

    'click .qualityResponse': function(e) {
        e.preventDefault();
        let selectedLine = this._id;
        Session.set('selectedLine', selectedLine);
    },

    'click .selectedPartsOrdered': function(e) {
        e.preventDefault()
        let machine = this.machineId
        Session.set('specificMachine', machine);
        Session.set('machine-look-up', true);
        Session.set('machine-number', machine)
    }


});
/*
function supplierFunction(result, singleSupplier, repairInfos, statusElement,
                          supplierList, singleResult) {
    result.forEach((element) => {
        element.newIssues.forEach((element2) => {
            if (element2.extern === true &&
                element2.responsible === singleSupplier &&
                element2.checkStatus === statusElement) {
                supplierList = {
                    _id: element2._id,
                    machineNr: element.machineId,
                    pdiTech: element.omms.user,
                    repairStatus: element.repairStatus,
                    errorDescription: element2.errorDescription,
                    pictureLocation: repairInfos + element2.pictureLocation,
                    repairTech: element2.repairTech,
                    repairTime: element2.repairTime,
                    qualityComment: element2.qualityComment,
                    claimNumber: element2.claimNumber,
                    partsOnOrder: element2.partsOnOrder
                }
                singleResult.push(supplierList);
            }
        })
    })
    return singleResult;
}

 */

//  ************************************  PDI Informal  *******************************

Template.pdiSearch.helpers({



    findPdiPerformer: () => {
        let endResult = [];
        let singleResultArray = [];
        let result, pdiPerformer, graph, coAuditorTrue;
        result = MachineReady.find({$and: [{pdiStatus: 1},
                {unixPdiDate: {$gt: 1630476000000}}]}).fetch(); // unix date is 1.09.2020
        result.forEach((element) => {
            if (element.coAuditor !== undefined) {
                pdiPerformer = element.coAuditor;
                coAuditorTrue = 1
               } else {
                pdiPerformer = element.pdiPerformer;
                coAuditorTrue = 0
               }
            graph = {
                pdiPerformer : pdiPerformer,
                machineNr : element.machineId,
                issuesFound : element.newIssues.length,
                coAuditor : coAuditorTrue,
                timeDate : moment(element.unixPdiDate).format('L')
               }
            endResult.push(graph)
        })
        endResult.sort((a,b) => (a.pdiPerformer > b.pdiPerformer) ? 1 :
                                                ((b.pdiPerformer > a.pdiPerformer) ? -1 : 0))
        Session.set('graphPdiEndResult', endResult);

        let lookup = endResult.reduce((a, e) => {
            a[e.pdiPerformer] = ++ a[e.pdiPerformer] || 0;
            return a;
        }, {});
        let list = Object.keys(lookup);
        let listValue = Object.values(lookup)

        for (let i = 0; i <= list.length -1; i++) {
            let objKeyValue = {
                pdiPerformer : list[i],
                pdiSummary : listValue[i] + 1
            }
            singleResultArray.push(objKeyValue)
        }
      return singleResultArray
    },

    pdiPerformerResult: function () {
        // Gather data:
        let pdiMachines = [];
        let pdiIssuesFound = [];
        let pdiResult = Session.get('graphPdiEndResult');
        let returnedPdiPerformer = Session.get('nameReturned');
        pdiResult.forEach((element) => {
            if (element.pdiPerformer === returnedPdiPerformer) {
              pdiMachines.push(element.machineNr)
              pdiIssuesFound.push(element.issuesFound)
            }
        })

        // Use Meteor.defer() to create chart after DOM is ready:
        let titleText = ' PDI Result';
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_6', {
                title: {
                    text: titleText
                },
                tooltip: {
                    shared: true
                },
                chart: {
                    style: {
                        fontFamily: '\'Unica One\', sans-serif'
                    },
                    plotBorderColor: '#606063',
                    height: 500,
                    width: 900,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Issues Found',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: pdiMachines,
                    title: {
                        enabled: true,
                        text: 'Machine',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                series: [
                    {
                        name: 'Issues Found',
                        type: 'column',
                        data: pdiIssuesFound
                    }
                ]
            });
        });
    },

    pdiPerDayResult: function () {
        // Gather data:
        let pdiMachines = [];
        let pdiIssuesFound = [];
        let pdiResult = Session.get('graphPdiEndResult');

        let returnedPdiPerformer = Session.get('nameReturned');
        pdiResult.forEach((element) => {
            if (element.pdiPerformer === returnedPdiPerformer) {
              //  console.log(element.timeDate, element.pdiPerformer)
            }
        })
        // Use Meteor.defer() to create chart after DOM is ready:
        let titleText = ' PDI per Day';
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_7', {
                title: {
                    text: titleText
                },
                tooltip: {
                    shared: true
                },
                chart: {
                    style: {
                        fontFamily: '\'Unica One\', sans-serif'
                    },
                    plotBorderColor: '#606063',
                    height: 500,
                    width: 900,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Issues Found',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: pdiMachines,
                    title: {
                        enabled: true,
                        text: 'Machine',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'column',
                        data: pdiIssuesFound
                    }
                ]
            });
        });
    },



    'selectedPdi': function() {
        let name = this.pdiPerformer;
        let nameReturned = Session.get('nameReturned')
        if (name === nameReturned) {
            return 'selected';
        }
    }

})

Template.pdiSearch.events({

    'click .selectedPdiName': function(e) {
        e.preventDefault();
        let name = this.pdiPerformer;
        Session.set('nameReturned', name)
    }

})

//  ************************************   Options  ***********************************

Template.analyzingOptions.helpers({

    suppliersList: () => {
        return SuppliersList.find();
    },

    teamList: () => {
        return TeamList.find();
    },

    'selectedSupplier': function(){
        let selectSupp = this._id;
        let selectedSupp = Session.get('selectedSupp')
        if (selectedSupp === selectSupp) {
            return 'selected';
        }
    },

    'selectedTeam': function(){
        let selectTeam = this._id;
        let selectedTeam = Session.get('selectedTeam')
        if (selectedTeam === selectTeam) {
            return 'selected';
        }
    },

});

Template.analyzingOptions.events({

    'click .selectedSupplier': function(e){
        e.preventDefault();
        const selected = this._id;
        Session.set('selectedSupp', selected);
    },

    'submit .new-supplier':(e) => {
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
    },

    'click .selectedTeam': function(e){
        e.preventDefault();
        const selected = this._id;
      //  console.log('selected', selected);
        Session.set('selectedTeam', selected);
    },

    'submit .newTeam':(e) => {
        e.preventDefault();
        let newTeam = e.target.inputTeam.value;
        Meteor.call('newTeamAdd', newTeam);
        e.target.inputTeam.value = '';
    },

    'click .teamRemoveButton': (e) => {
        e.preventDefault();
        let removeId = Session.get('selectedTeam');
        Meteor.call('removeTeam', removeId);
    },


});


function prepareTeamResult() {
    let machineTimeLine = '';
    let returnedTarget = {};
    let returnResultTeam1 = []; // Team 1
    let returnResultTeam2 = []; // Team 2
    let returnResultTeam3 = []; // Team 3
    let returnResultTeam4 = []; // Team 4 Engines
    let returnResultTeam5 = []; // Team Final
    let teamTestBayAmount = []; // Test Bay
    let teamSupplierAmount = []; // Supplier
    let ctdAmount = [];
    let rAndD_Amount = [];
    let unknownAmount = []; // Unknown
    let notApplicableAmount = [];
    let undefinedIssuer = [];
    let imageIp = Session.get('repairInfos')
    let result = MachineReady.find({pdiStatus: 1}, {
        fields: {newIssues: 1, machineId: 1, pdiPerformer: 1, coAuditor: 1}}).fetch();
    result.forEach((element) => {
        let machineId = element.machineId;
        try {
        let machineBay19 = machineCommTable.findOne({machineId: machineId}, {fields: {timeLine: 1}})
        machineTimeLine = machineBay19.timeLine.bay19Planned;
            if (element.newIssues) {
                element.newIssues.forEach((element2) => {
                    let pictureLocation = imageIp + element2.pictureLocation
                    let source = {
                        machineId: element._id,
                        machineNr: element.machineId,
                        pdiTech: element.pdiPerformer,
                        coAuditor: element.coAuditor,
                        bay19Planned: machineTimeLine,
                        pictureLocation: pictureLocation
                    }
                    if (element2.responsible === "Team 1") {
                        returnedTarget = Object.assign(element2, source)
                        returnResultTeam1.push(returnedTarget);
                    }
                    if (element2.responsible === "Team 2") {
                        returnedTarget = Object.assign(element2, source)
                        returnResultTeam2.push(returnedTarget);
                    }
                    if (element2.responsible === "Team 3") {
                        returnedTarget = Object.assign(element2, source)
                        returnResultTeam3.push(returnedTarget);
                    }
                    if (element2.responsible === "Team 4") {
                        returnedTarget = Object.assign(element2, source)
                        returnResultTeam4.push(returnedTarget);
                    }
                    if (element2.responsible === "Team 5") {
                        returnedTarget = Object.assign(element2, source)
                        returnResultTeam5.push(returnedTarget);
                    }
                    if (element2.responsible === "Test Bay") {
                        returnedTarget = Object.assign(element2, source)
                        teamTestBayAmount.push(returnedTarget);
                    }
                    if (element2.responsible === "Supplier") {
                        returnedTarget = Object.assign(element2, source)
                        teamSupplierAmount.push(returnedTarget);
                    }
                    if (element2.responsible === "CTD") {
                        returnedTarget = Object.assign(element2, source)
                        ctdAmount.push(returnedTarget);
                    }
                    if (element2.responsible === "R&D") {
                        returnedTarget = Object.assign(element2, source)
                        rAndD_Amount.push(returnedTarget);
                    }
                    if (element2.responsible === "Unknown") {
                        returnedTarget = Object.assign(element2, source)
                        unknownAmount.push(returnedTarget);
                    }
                    if (element2.responsible === "N/A") {
                        returnedTarget = Object.assign(element2, source)
                        notApplicableAmount.push(returnedTarget);
                    }
                    if (element2.responsible === undefined) {
                        returnedTarget = Object.assign(element2, source)
                        undefinedIssuer.push(returnedTarget);
                    }
                })
            }
        } catch (e) {}
    })
    let totalLength = returnResultTeam1.length + returnResultTeam2.length + returnResultTeam3.length +
        returnResultTeam4.length + returnResultTeam5.length + teamTestBayAmount.length + teamSupplierAmount.length +
        rAndD_Amount.length + unknownAmount.length + notApplicableAmount.length + undefinedIssuer.length;
    Session.set('totalLength', totalLength);
    Session.set('team1Amount', returnResultTeam1.length);
    Session.set('team2Amount', returnResultTeam2.length);
    Session.set('team3Amount', returnResultTeam3.length);
    Session.set('team4Amount', returnResultTeam4.length);
    Session.set('team5Amount', returnResultTeam5.length);
    Session.set('teamTestBayAmount', teamTestBayAmount.length);
    Session.set('teamSupplierAmount', teamSupplierAmount.length);
    Session.set('ctdAmount', ctdAmount.length);
    Session.set('rAndD_Amount', rAndD_Amount.length);
    Session.set('unknownAmount', unknownAmount.length);
    Session.set('notApplicableAmount', notApplicableAmount.length);
    Session.set('undefinedIssuer', undefinedIssuer.length);
    return [returnResultTeam1, returnResultTeam2,
            returnResultTeam3, returnResultTeam4,
            returnResultTeam5, teamTestBayAmount,
            teamSupplierAmount, ctdAmount, rAndD_Amount,
            unknownAmount, notApplicableAmount, undefinedIssuer]
}