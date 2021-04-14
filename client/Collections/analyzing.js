Meteor.subscribe('SuppliersList');
Meteor.subscribe('TeamList');
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

    editResponsibility: () => {
        return Session.get('editResponsibility');
    },

    advanceSearch: () => {
        return Session.get('advanceSearch');
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
        Session.set('editResponsibility', false);
        Session.set('advanceSearch', false);
        Session.set('options', false);
    },

     'click .btn-key-word': (e) => {
         e.preventDefault();
         Session.set('overViewAnalyzing', false);
         Session.set('searchWithKeyWord', true)
         Session.set('responseTeam', false);
         Session.set('issueByComponent', false);
         Session.set('issueBySupplier', false);
         Session.set('editResponsibility', false);
         Session.set('advanceSearch', false);
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
        Session.set('editResponsibility', false);
        Session.set('advanceSearch', false);
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
        Session.set('editResponsibility', false);
        Session.set('advanceSearch', false);
        Session.set('options', false);
    },

    'click .btn-response-supplier': (e) => {
        e.preventDefault();
        Session.set('overViewAnalyzing', false);
        Session.set('searchWithKeyWord', false);
        Session.set('responseTeam', false);
        Session.set('issueByComponent', false);
        Session.set('issueBySupplier', true);
        Session.set('editResponsibility', false);
        Session.set('advanceSearch', false);
        Session.set('options', false);
    },

    'click .btn-edit-responsibility': (e) => {
        e.preventDefault();
        Session.set('overViewAnalyzing', false);
        Session.set('searchWithKeyWord', false);
        Session.set('responseTeam', false);
        Session.set('issueByComponent', false);
        Session.set('issueBySupplier', false);
        Session.set('editResponsibility', true);
        Session.set('advanceSearch', false);
        Session.set('options', false);
    },

    'click .btn-advance-search': (e) => {
        e.preventDefault();
        Session.set('overViewAnalyzing', false);
        Session.set('searchWithKeyWord', false);
        Session.set('responseTeam', false);
        Session.set('issueByComponent', false);
        Session.set('issueBySupplier', false);
        Session.set('editResponsibility', false);
        Session.set('advanceSearch', true);
        Session.set('options', false);
    },

    'click .btn-options': (e) => {
        e.preventDefault();
        Session.set('overViewAnalyzing', false);
        Session.set('searchWithKeyWord', false);
        Session.set('responseTeam', false);
        Session.set('issueByComponent', false);
        Session.set('issueBySupplier', false);
        Session.set('editResponsibility', false);
        Session.set('advanceSearch', false);
        Session.set('options', true);
    }


});

// *****************************************  Analyzing Overview Page 1 ****************************************

Template.analyzingOverView.helpers({

    machineCount: function () {
        let completedMachines = [];
        let issuesFound = 0;
        let result = MachineReady.find({pdiStatus: 1}, {fields: {newIssues: 1,
                machineId: 1
               }}).fetch();
        result.forEach((element) => {
            completedMachines.push(element.machineId);
            issuesFound = issuesFound + element.newIssues.length;
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
        prepareTeamResult();  // load all Results for all Teams when template is called
        let imageIp = Session.get('repairInfos')
        let returnedTarget = {};
        let returnResultTeam = []; // Team 1
        let returnGraphTeam = []; // reverse sort for Graphic
        let team = Session.get('teamChosen')
        if (team) {
            let result = MachineReady.find({pdiStatus: 1}, {
                fields: {
                    newIssues: 1,
                    machineId: 1,
                    omms: 1
                }
            }).fetch();
            let endOfLine = '';
            result.forEach((element) => {
               // console.log(element)
                let commResult = machineCommTable.findOne({machineId: element.machineId},
                    {fields: {'timeLine.bay19Planned': 1}});

                try {
                         endOfLine = {
                            endOfLine: commResult.timeLine.bay19Planned
                        };

                    }    catch (e) {
                               }

                if (element.machineId <= "C8900301" || element.machineId <= "C88000") {
                    endOfLine = {
                        endOfLine: '2020-09-30'  // last fiscal year machines * old database *
                    };
                }
                Object.assign(element, endOfLine)
                try {
                    let user = element.omms.user;
                    if (element.newIssues) {
                        let source = {
                            endOfLine: element.endOfLine,
                            machineId: element._id,
                            machineNr: element.machineId,
                            pdiTech: user
                        }
                        element.newIssues.forEach((element2) => {
                            if (element2.responsible === team) {
                                element2.pictureLocation = imageIp + element2.pictureLocation;
                                returnedTarget = Object.assign(element2, source)
                                returnResultTeam.push(returnedTarget);
                                }
                            })
                       }
                } catch(e) {
                    console.log(element.machineId, e)
                   }
            })
        }
      returnResultTeam.sort(function(a, b) {
          return a.endOfLine > b.endOfLine ? 1: -1
      }).reverse();
        let machineArray = [];
        let repairArray = [];
        let machineRepairArray = [];
        let machineNr = '';
        let repairTime = 0;
        returnResultTeam.forEach((element) =>  {
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
        Session.set('teamResult', returnResultTeam)
        return returnResultTeam
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

// **************************************   Responsibility Analyzing Tool *********************************

Template.analyzingResponsibility.helpers({



});

Template.analyzingResponsibility.events({



});


// **************************************   Analyzing Component ***********************************

Template.analyzingComponent.helpers({

    repairSummary: () => {
      let repairInfo = Session.get('repairInfos');
      let machineRepairTime = [];
      let result = MachineReady.find({repairStatus: 1}, {
          fields: {newIssues: 1, machineId: 1, omms: 1}}).fetch();
      result.forEach((element) => {
          let user = element.omms.user;
          let machineNr = element.machineId;
          let issues = element.newIssues;
          issues.forEach((element2) => {
              let issueObject = {
                  machineNr: machineNr,
                  pdiTech: user,
                  errorDescription: element2.errorDescription,
                  pictureLocation: repairInfo +  element2.pictureLocation,
                  repairTech: element2.repairTech,
                  repairComment: element2.repairComment,
                  repairTime: element2.repairTime,
                  responsible: element2.responsible,
                  repairStatus: element2.repairStatus,
              }
              machineRepairTime.push(issueObject);
          })
      })
        // Sort result by Machine Number (machineNr is nested in an object)

        machineRepairTime.sort( (a, b) => {
            if (a.machineNr < b.machineNr) return -1
            return a.machineNr > b.machineNr ? 1 : 0
        })
        // prepare arrays for Graph (machine Nr -> x-Axis, summary Repair time -> y-Axis
        let machineArray = [];
        let repairArray = [];
        let machineRepairArray = [];
        let machineNr = '';
        let repairTime = 0;
        machineRepairTime.forEach((element) =>  {
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
        Session.set('machineArray', machineArray);
        Session.set('repairArray', repairArray);
        return machineRepairTime;
    },

   machinesOverRepairTime: function () {
        // Gather data:
        let machine = Session.get('machineArray');
        let repairTime = Session.get('repairArray');

        // Use Meteor.defer() to create chart after DOM is ready:
        let titleText = ' Machines summary repair time';
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_5', {
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

    machineResult: () => {
        let machine = Session.get('specificMachine');
        let repairInfo = Session.get('repairInfos');
        let machineResult = [];
        let machineNr = '';
        let user = '';
        let result = MachineReady.findOne({machineId: machine},
            {fields: {machineId: 1,
                    newIssues: 1,
                    omms: 1
                }});
        if (result.omms === undefined) {
            window.alert("Machine not PDI'd yet")
        } else {
            Session.set('machineResultNr', result.machineId);
            Session.set('userResult', result.omms.user);
            console.log(result.machineId, result.omms.user)
            result.newIssues.forEach(function(element) {
                let issueObject = {
                    description: element.errorDescription,
                    pictureLocation: repairInfo + element.pictureLocation,
                    repairTech: element.repairTech,
                    repairComment: element.repairComment,
                    repairTime: element.repairTime,
                    responsible: element.responsible,
                    repairStatus: element.repairStatus,
                }
                machineResult.push(issueObject);
            })
        }
        return machineResult
    },

    user: () => {
        return Session.get('userResult');
    },

    resultMachineId: () => {
         return Session.get('machineResultNr')
    }


})

Template.analyzingComponent.events({

    'submit .look-up': function(e) {
        e.preventDefault();
        let machine = e.target.lookUp.value;
        Session.set('specificMachine', machine);
        e.target.lookUp.value = '';
    }

})

// **************************************** Analyzing Supplier ******************************************


Template.analyzingSupplier.helpers({

    timeCount: () => {
        let timeRepTotal = 0;
        let supplierCount = 0;
        let returnResult = [];
        let result = Session.get('analyzeStart');
        try {
          result.forEach((element) => {
              if (element.repairTime) {
              let timeRep = parseInt(element.repairTime);
              timeRepTotal  = timeRepTotal + timeRep;
              supplierCount ++;
              }
          })
            returnResult = {
              supplierCount : supplierCount,
              timeRepTotal : timeRepTotal
            }
        } catch(e) {}
        return returnResult;
    },

    supplierIssue: function () {
        let repairInfos = Session.get('repairInfos');
        let supplierArray = [];
        let supplierIssues = {};
        let result = MachineReady.find({pdiStatus: 1}, {
            fields: {machineNr: 1, newIssues: 1, machineId: 1, omms: 1
            }}).fetch();
        try {
            result.forEach((element) => {
                let pdiPerformer = element.omms.user;
                let machineNr = element.machineId;
                let issueArray = element.newIssues;
                issueArray.forEach((element2) => {
                    if (element2.responsible === "Supplier") {
                           supplierIssues = {
                            _id: element2._id,
                            machineNr: machineNr,
                            pdiPerformer:  pdiPerformer,
                            errorDescription: element2.errorDescription,
                            responsible: element2.responsible,
                            repairStatus: element2.repairStatus,
                            pictureLocation : repairInfos + element2.pictureLocation,
                            repairTime: element2.repairTime
                        }
                        supplierArray.push(supplierIssues)
                    }
                })
            })
        } catch(e) {}
        //console.log(supplierArray)
        return supplierArray;
    },

    teamList: () => {
        return TeamList.find().fetch();
    },

    //  ********** drop down menu suppliers  ****************************

    'selectedSupplier': function () {
        let component = this._id;
        let selected = Session.get('selectedSupplier');
        if (component === selected) {
            Session.set('supplierChosen', 1);
            return 'selected'
        }
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




    //  *************************************************************************

});

Template.analyzingSupplier.events({

    // */*********************  select Row with failure  ***********

    'click .selectedIssue': function(e){
        e.preventDefault();
        try {
            const failureId = this._id;
            const machineNr = this.machineNr;
            Session.set('selectedFailure', failureId);
            Session.set('selectedSupplierMachine', machineNr);
        } catch(err) {}
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

    'click .supplierListButton': (e) => {
        e.preventDefault();
        FlowRouter.go('suppliersListView');
    },

    'click .supplierResultList': (e) => {
        e.preventDefault()
        FlowRouter.go('supplierResultList')
    },



});

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
       // console.log('selected', selected);
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
    let result = MachineReady.find({pdiStatus: 1}, {
        fields: {
            newIssues: 1,
            machineId: 1,
            omms: 1
        }
    }).fetch();
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
    try {
        result.forEach((element) => {
            if (element.newIssues) {
                let source = {
                    machineId: element._id,
                    machineNr: element.machineId,
                    pdiTech: element.omms.user
                }
                element.newIssues.forEach((element2) => {
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
        })
    } catch (e) {

    }
    returnResultTeam1.sort(function (a, b) {
        return a.machineId - b.machineId
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
}