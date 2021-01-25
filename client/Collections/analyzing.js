Meteor.subscribe('analyzingDatabase');
Meteor.subscribe('fuelAverage');
Meteor.subscribe('suppliersList');

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
        Meteor.call('dataClean');
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

    team1Amount: () => {
        let team1Summary = [];
        try {
            let result = analyzingDatabase.find().fetch();
            Session.set('teamResponsibilities', result);
            result.forEach((element) => {
                if (element.issueResponsible === "Team 1") {
                    team1Summary.push(element);
                }
            })
            Session.set('team1Summary', team1Summary)
            return team1Summary.length;
        } catch { }
        return Session.get('team1Amount');
    },

    team1: () => {
      return Session.get('team1Summary')
    },

    team2Amount: () => {
        let team2Summary = [];
        try {
            let result = Session.get('teamResponsibilities');
            result.forEach((element) => {
                if (element.issueResponsible === "Team 2") {
                    team2Summary.push(element);
                }
            })
            Session.set('team2Summary', team2Summary)
            return team2Summary.length;
        } catch { }

    },

    team2: () => {
        return Session.get('team2Summary');
    },

    team3Amount: () => {
        let team3Summary = [];
        try {
            let result = Session.get('teamResponsibilities');
            result.forEach((element) => {
                if (element.issueResponsible === "Team 3") {
                    team3Summary.push(element);
                }
            })
            Session.set('team3Summary', team3Summary)
            return team3Summary.length;
        } catch { }
    },

    team3: () => {
        return Session.get('team3Summary');
    },

    team4Amount: () => {
        let team4Summary = [];
        try {
            let result = Session.get('teamResponsibilities');
            result.forEach((element) => {
                if (element.issueResponsible === "Team 4") {
                    team4Summary.push(element);
                }
            })
            Session.set('team4Summary', team4Summary)
            return team4Summary.length;
        } catch { }
    },

    team4: () => {
        return Session.get('team4Summary');
    },

    team5Amount: () => {
        let team5Summary = [];
        try {
            let result = Session.get('teamResponsibilities');
            result.forEach((element) => {
                if (element.issueResponsible === "Team 5") {
                    team5Summary.push(element);
                }
            })
            Session.set('team5Summary', team5Summary)
            return team5Summary.length;
        } catch { }
    },

    team5: () => {
        return Session.get('team5Summary');
    },

    teamTestBayAmount: () => {
        let team6Summary = [];
        try {
            let result = Session.get('teamResponsibilities');
            result.forEach((element) => {
                if (element.issueResponsible === "Test Bay") {
                    team6Summary.push(element);
                }
            })
            Session.set('team6Summary', team6Summary)
            return team6Summary.length;
        } catch { }
    },

    teamTestBay: () => {
        return Session.get('team6Summary');
    },

    teamSupplierAmount: () => {
        let team7Summary = [];
        try {
            let result = Session.get('teamResponsibilities');
            result.forEach((element) => {
                if (element.issueResponsible === "Supplier") {
                    team7Summary.push(element);
                }
            })
            Session.set('team7Summary', team7Summary)
            return team7Summary.length;
        } catch { }
    },

    team7: () => {
        return Session.get('team7Summary');
    },



    unknownAmount: () => {
        let team8Summary = [];
        try {
            let result = Session.get('teamResponsibilities');
            result.forEach((element) => {
                if (element.issueResponsible === "Unknown") {
                    team8Summary.push(element);
                }
            })
            Session.set('team8Summary', team8Summary)
            return team8Summary.length;
        } catch { }
    },

    unknown: () => {
        return Session.get('team8Summary');
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

    'click .supplier': function () {
        const selectedSupplier = this.supplier;
        Session.set('selectedSupplier', selectedSupplier); // Supplier Id
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

    'click .dropDown': function(e) {
        e.preventDefault();
        const selectedId = this._id;
        Meteor.call('addSupplierToRepair', selectedId);
    }

});

