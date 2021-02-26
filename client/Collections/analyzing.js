Meteor.subscribe('analyzingDatabase');
Meteor.subscribe('fuelAverage');
Meteor.subscribe('SuppliersList');
Meteor.subscribe('TeamList');

Session.set('overViewAnalyzing', true);
Session.set('searchWithKeyWord', false);
Session.set('responseTeam', false);
Session.set('issueByComponent', false);
Session.set('issueBySupplier', false);
Session.set('editResponsibility', false);
Session.set('advanceSearch', false);

Template.analyzing.onDestroyed(() => {
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
        Session.set('overViewAnalyzing', false);
        Session.set('searchWithKeyWord', false);
        Session.set('responseTeam', true);
        Session.set('issueByComponent', false);
        Session.set('issueBySupplier', false);
        Session.set('editResponsibility', false);
        Session.set('advanceSearch', false);
        Session.set('options', false);
        let result = MachineReady.find({}, {fields: {newIssues: 1,
                machineId: 1,
                omms: 1}}).fetch();
        let returnedTarget = {};
        let returnResultTeam1 = []; // Team 1
        let returnResultTeam2 = []; // Team 2
        let returnResultTeam3 = []; // Team 3
        let returnResultTeam4 = []; // Team 4 Engines
        let returnResultTeam5 = []; // Team Final
        let returnResultTeam6 = []; // Test Bay
        let returnResultTeam7 = []; // Supplier
        let returnResultTeam8 = []; // Unknown
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
                        returnResultTeam6.push(returnedTarget);
                    }
                    if (element2.responsible === "Supplier") {
                        returnedTarget = Object.assign(element2, source)
                        returnResultTeam7.push(returnedTarget);
                    }
                    if (element2.responsible === "Unknown") {
                        returnedTarget = Object.assign(element2, source)
                        returnResultTeam8.push(returnedTarget);
                    }
                })
            }
        })
        let totalLength = returnResultTeam1.length + returnResultTeam2.length + returnResultTeam3.length +
            returnResultTeam4.length + returnResultTeam5.length + returnResultTeam6.length + returnResultTeam7.length +
            returnResultTeam8.length;
        Session.set('totalLength', totalLength);
        Session.set('team1Amount', returnResultTeam1.length);
        Session.set('team1Result', returnResultTeam1);
        Session.set('team2Amount', returnResultTeam2.length);
        Session.set('team2Result', returnResultTeam2);
        Session.set('team3Amount', returnResultTeam3.length);
        Session.set('team3Result', returnResultTeam3);
        Session.set('team4Amount', returnResultTeam4.length);
        Session.set('team4Result', returnResultTeam4);
        Session.set('team5Amount', returnResultTeam5.length);
        Session.set('team5Result', returnResultTeam5);
        Session.set('team6Amount', returnResultTeam6.length);
        Session.set('team6Result', returnResultTeam6);
        Session.set('team7Amount', returnResultTeam7.length);
        Session.set('team7Result', returnResultTeam7);
        Session.set('team8Amount', returnResultTeam8.length);
        Session.set('team8Result', returnResultTeam8);

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

    teamList: () => {
        return TeamList.find();
    },

    team1Chosen: () => {
      return Session.get('team1Chosen');
    },

    team2Chosen: () => {
        return Session.get('team2Chosen');
    },

    team3Chosen: () => {
        return Session.get('team3Chosen');
    },

    team4Chosen: () => {
        return Session.get('team4Chosen');
    },

    team5Chosen: () => {
        return Session.get('team5Chosen');
    },

    teamTestBayChosen: () => {
        return Session.get('teamTestBayChosen');
    },

    teamSupplierChosen: () => {
        return Session.get('teamSupplierChosen');
    },

    unknownChosen: () => {
        return Session.get('unknown');
    },

     //   *******************   team tables  ***********************

    team1Amount: () => {
        return Session.get('team1Amount');
    },

    team1: () => {
        return Session.get('team1Result');
    },

    team2Amount: () => {
        return Session.get('team2Amount');
    },

    team2: () => {
        return Session.get('team2Result');
    },

    team3Amount: () => {
        return Session.get('team3Amount');
    },

    team3: () => {
        return Session.get('team3Result');
    },

    team4Amount: () => {
        return Session.get('team4Amount');
    },

    team4: () => {
        return Session.get('team4Result');
    },

    team5Amount: () => {
        return Session.get('team5Amount');
    },

    team5: () => {
        return Session.get('team5Result');
    },

    teamTestBayAmount: () => {
        return Session.get('team6Amount');
    },

    team6: () => {
        return Session.get('team6Result');
    },

    teamSupplierAmount: () => {
        return Session.get('team7Amount');
    },

    team7: () => {
        return Session.get('team7Result');
    },

    unknownAmount: () => {
        return Session.get('team8Amount');
    },

    team8: () => {
        return Session.get('team8Result');
    },

});

 Session.set('team1Chosen', false);
 Session.set('team2Chosen', false);
 Session.set('team3Chosen', false);
 Session.set('team4Chosen', false);
 Session.set('team5Chosen', false);
 Session.set('teamTestBayChosen', false);
 Session.set('teamSupplierChosen', false);
 Session.set('unknown', false);

Template.analyzingResponseTeam.events({

    'click .btn-team1-details': () => {
        Session.set('team1Chosen', true)
        Session.set('team2Chosen', false);
        Session.set('team3Chosen', false);
        Session.set('team4Chosen', false);
        Session.set('team5Chosen', false);
        Session.set('teamTestBayChosen', false);
        Session.set('teamSupplierChosen', false);
        Session.set('unknown', false);
    },

    'click .btn-team2-details': () => {
        Session.set('team1Chosen', false)
        Session.set('team2Chosen', true);
        Session.set('team3Chosen', false);
        Session.set('team4Chosen', false);
        Session.set('team5Chosen', false);
        Session.set('teamTestBayChosen', false);
        Session.set('teamSupplierChosen', false);
        Session.set('unknown', false);
    },

    'click .btn-team3-details': () => {
        Session.set('team1Chosen', false)
        Session.set('team2Chosen', false);
        Session.set('team3Chosen', true);
        Session.set('team4Chosen', false);
        Session.set('team5Chosen', false);
        Session.set('teamTestBayChosen', false);
        Session.set('teamSupplierChosen', false);
        Session.set('unknown', false);
    },

    'click .btn-team4-details': () => {
        Session.set('team1Chosen', false)
        Session.set('team2Chosen', false);
        Session.set('team3Chosen', false);
        Session.set('team4Chosen', true);
        Session.set('team5Chosen', false);
        Session.set('teamTestBayChosen', false);
        Session.set('teamSupplierChosen', false);
        Session.set('unknown', false);
    },

    'click .btn-team5-details': () => {
        Session.set('team1Chosen', false)
        Session.set('team2Chosen', false);
        Session.set('team3Chosen', false);
        Session.set('team4Chosen', false);
        Session.set('team5Chosen', true);
        Session.set('teamTestBayChosen', false);
        Session.set('teamSupplierChosen', false);
        Session.set('unknown', false);
    },

    'click .btn-teamTestBay-details': () => {
        Session.set('team1Chosen', false)
        Session.set('team2Chosen', false);
        Session.set('team3Chosen', false);
        Session.set('team4Chosen', false);
        Session.set('team5Chosen', false);
        Session.set('teamTestBayChosen', true);
        Session.set('teamSupplierChosen', false);
        Session.set('unknown', false);
    },

    'click .btn-teamSupplier-details': () => {
        Session.set('team1Chosen', false)
        Session.set('team2Chosen', false);
        Session.set('team3Chosen', false);
        Session.set('team4Chosen', false);
        Session.set('team5Chosen', false);
        Session.set('teamTestBayChosen', false);
        Session.set('teamSupplierChosen', true);
        Session.set('unknown', false);
    },

    'click .btn-unknown-details': () => {
        Session.set('team1Chosen', false)
        Session.set('team2Chosen', false);
        Session.set('team3Chosen', false);
        Session.set('team4Chosen', false);
        Session.set('team5Chosen', false);
        Session.set('teamTestBayChosen', false);
        Session.set('teamSupplierChosen', false);
        Session.set('unknown', true);
    },





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

    'click .submitButton1': (e) => {
        e.preventDefault();
        let team = 'Team 1';
        let issueId = e.target.id;
        let machineId = e.target.name;
        Meteor.call('teamSpecifier', machineId, team, issueId);
        Session.set('issueCauser', issueId);
    },

    'click .submitButton2': (e) => {
        e.preventDefault();
        let team = 'Team 2';
        let issueId = e.target.id;
        let machineId = e.target.name;
        Meteor.call('teamSpecifier', machineId, team, issueId);
    },

    'click .submitButton3': (e) => {
        e.preventDefault();
        let team = 'Team 3';
        let issueId = e.target.id;
        let machineId = e.target.name;
        Meteor.call('teamSpecifier', machineId, team, issueId);
    },
    'click .submitButton4': (e) => {
        e.preventDefault();
        let team = 'Team 4';
        let issueId = e.target.id;
        let machineId = e.target.name;
        Meteor.call('teamSpecifier', machineId, team, issueId);
    },
    'click .submitButton5': (e) => {
        e.preventDefault();
        let team = 'Team 5';
        let issueId = e.target.id;
        let machineId = e.target.name;
        Meteor.call('teamSpecifier', machineId, team, issueId);
    },

    'click .submitButtonRepair': (e) => {
        e.preventDefault();
        let team = 'Repair';
        let issueId = e.target.id;
        let machineId = e.target.name;
        Meteor.call('teamSpecifier', machineId, team, issueId);
    },

    'click .submitButtonTestBay': (e) => {
        e.preventDefault();
        let team = 'Test Bay';
        let issueId = e.target.id;
        let machineId = e.target.name;
        Meteor.call('teamSpecifier', machineId, team, issueId);
    },

    'click .submitButtonSupplier': (e) => {
        e.preventDefault();
        let team = 'Supplier';
        let issueId = e.target.id;
        let machineId = e.target.name;
        Meteor.call('teamSpecifier', machineId, team, issueId);
    },

    'click .submitButtonUnknown': (e) => {
        e.preventDefault();
        let team = 'Unknown';
        let issueId = e.target.id;
        let machineId = e.target.name;
        Meteor.call('teamSpecifier', machineId, team, issueId);
    },

    'click .refreshButton' : () => {
        Meteor.call('machines');
        location.reload();
    }

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