Meteor.subscribe('analyzingDatabase');
Meteor.subscribe('fuelAverage');
Meteor.subscribe('SuppliersList');
Meteor.subscribe('TeamList');

Session.set('teamChosen', false)
Session.set('teamResult', false)
Session.set('overViewAnalyzing', true);
Session.set('searchWithKeyWord', false);
Session.set('responseTeam', false);
Session.set('issueByComponent', false);
Session.set('issueBySupplier', false);
Session.set('editResponsibility', false);
Session.set('advanceSearch', false);

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
        let result = MachineReady.find({pdiStatus: 1}, {fields: {newIssues: 1,
                machineId: 1,
                omms: 1}}).fetch();
       // console.log(result)
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
                    })
                }
            })
        } catch (e) {

        }
        returnResultTeam1.sort(function(a, b) {return a.machineId - b.machineId})
        let totalLength = returnResultTeam1.length + returnResultTeam2.length + returnResultTeam3.length +
            returnResultTeam4.length + returnResultTeam5.length + teamTestBayAmount.length + teamSupplierAmount.length +
            rAndD_Amount.length + unknownAmount.length + notApplicableAmount.length;
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

    issuesCount: function () {
        let analyzeStart = [];
        try {
           analyzeStart = analyzingDatabase.find({}).fetch();
           Session.set('analyzeStart', analyzeStart);
        } catch {}
        return analyzeStart.length;
    },

    machineCount: function () {
        let machineFinished = [];
        try {
          let  machineResult = fuelAverage.find({}).fetch();
          machineFinished =   machineResult[0].machineArray.length
        } catch {}
        return machineFinished;
    }

});

Template.analyzingOverView.events({



});

Template.analyzingWithKeyWords.helpers({

    stringSearch: () => {
        let repairInfos = Session.get('repairInfos');
        try {
            let resultArray = [];
            let searchResult = {};
            let searchString = Session.get('searchString');
            let result = Session.get('result');
            result.forEach((element) => {
                let stringFind = element.newIssues;
                stringFind.forEach((element2) => {
                    let stringAnalyze = element2.errorDescription
                    if (stringAnalyze.includes(searchString) === true) {
                        // console.log(element.machineId, element2.errorDescription)
                        searchResult = {
                            machineNr : element.machineId,
                            errorDescription : element2.errorDescription,
                            pictureLocation : repairInfos + element2.pictureLocation
                        }
                        resultArray.push(searchResult);
                    }
                })
            })
            Session.set('resultCount', resultArray.length);
            return resultArray;
        } catch {}
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
        let imageIp = Session.get('repairInfos')
        let returnedTarget = {};
        let returnResultTeam = []; // Team 1
        let team = Session.get('teamChosen')
        if (team) {
            let result = MachineReady.find({pdiStatus: 1}, {
                fields: {
                    newIssues: 1,
                    machineId: 1,
                    omms: 1
                }
            }).fetch();
            result.forEach((element) => {
                if (element.newIssues) {
                    let source = {
                        machineId: element._id,
                        machineNr: element.machineId,
                        pdiTech: element.omms.user
                    }
                    element.newIssues.forEach((element2) => {
                        if (element2.responsible === team) {
                            element2.pictureLocation = imageIp + element2.pictureLocation;
                            returnedTarget = Object.assign(element2, source)
                            returnResultTeam.push(returnedTarget);
                        }
                    })
                }
            })
        }
        returnResultTeam.sort( (a, b) => {
            if (a.machineNr < b.machineNr) return -1
            return a.machineNr > b.machineNr ? 1 : 0
        })
        Session.set('teamResult', returnResultTeam)
        return returnResultTeam
    },

    team: () => {
        return Session.get('teamResult');
    },

    teamList: () => {
        return TeamList.find().fetch();
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



    'selectedRow': function(){
        let selectedMachine = this._id;
        let selected = Session.get('selectedFailure')
        if (selectedMachine === selected) {
            return 'selected'
        }
    },

});


Template.analyzingResponseTeam.events({

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

    'click .team-chooser': function (e) {
          e.preventDefault();
          let teamChosen = e.target.name;
          if (teamChosen === 'Team 1') {
              Session.set('teamChosen', teamChosen)
          } else if (teamChosen === 'Team 2') {
              Session.set('teamChosen', teamChosen)
          } else if (teamChosen === 'Team 2') {
              Session.set('teamChosen', teamChosen)
          } else if (teamChosen === 'Team 3') {
              Session.set('teamChosen', teamChosen)
          } else if (teamChosen === 'Team 4') {
              Session.set('teamChosen', teamChosen)
          } else if (teamChosen === 'Team 5') {
              Session.set('teamChosen', teamChosen)
          } else if (teamChosen === 'Test Bay') {
              Session.set('teamChosen', teamChosen)
          } else if (teamChosen === 'Supplier') {
              Session.set('teamChosen', teamChosen)
          }else if (teamChosen === 'Unknown') {
              Session.set('teamChosen', teamChosen)
          }
    }

});

// **************************************   Responsibility Analyzing Tool *********************************

Template.analyzingResponsibility.helpers({

    openIssue: function () {
        let openResponsible = [];
        let rawDataSet = analyzingDatabase.find({}).fetch();
        rawDataSet.forEach((element) => {
            if (element.issueResponsible === '') {
                openResponsible.push(element)
            }
        })
        return openResponsible;
    },

    closeIssue: function () {
        let closedResponsible = [];
        let rawDataSet = analyzingDatabase.find({}).fetch();
        rawDataSet.forEach((element) => {
            if (element.issueResponsible !== '') {
                closedResponsible.push(element)
            }
        })
        return closedResponsible
    },

});

Template.analyzingResponsibility.events({



});


// **************************************   Analyzing Component ***********************************

Template.analyzingComponent.helpers({


})

Template.analyzingComponent.events({


})

// **************************************** Analyzing Supplier ******************************************


Template.analyzingSupplier.helpers({

    timeCount: () => {
        let timeRepTotal = 0;
        let supplierCount = 0;
        let returnResult = [];
        let result = Session.get('analyzeStart');
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
        return returnResult;
    },

    supplierIssue: function () {
        let supplierArray = [];
        let result = analyzingDatabase.find().fetch();
        result.forEach((element) => {
            if (element.issueResponsible === 'Supplier') {
                supplierArray.push(element);
            }
        })
        return supplierArray;

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

    supplierList: function () {
        return SuppliersList.find({}).fetch();
    }


    //  *************************************************************************

});

Template.analyzingSupplier.events({

    'click .selectedIssue': function(e) {
        e.preventDefault();
        const selectedRow = this._id;
        const machineNr = this.machineNr;
        Session.set('selectedSupplierMachine', machineNr);
        Session.set('selectedRow', selectedRow); // issue Id
    },

    'change  #category-select': function (event) {
        event.preventDefault();
        const selectedSupplier = $(event.currentTarget).val();
        let machineNr = Session.get('selectedSupplierMachine');
        let issueId = Session.get('selectedRow');
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
    },

    'click .selectedTeam': function(e){
        e.preventDefault();
        const selected = this._id;
        console.log('selected', selected);
        Session.set('selectedTeam', selected);
    },

    'submit .newTeam':(e) => {
        e.preventDefault();
        let newTeam = e.target.inputTeam.value;
        Meteor.call('newTeamAdd', newTeam);
        e.target.inputSupplier.value = '';
    },

    'click .teamRemoveButton': (e) => {
        e.preventDefault();
        let removeId = Session.get('selectedTeam');
        Meteor.call('removeTeam', removeId);
    },


})