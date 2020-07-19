
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
    }

});

Template.analyzingOverView.helpers({

    issuesCount: function () {
        let countResult = {};
        let issuesTotal = 0;
        try {
            Meteor.call('machines', function (err, response) {
                if (response) {
                    Session.set('machineIssue', response[0])
                    Session.set('completeIssue', response[1])
                }
            })

            let machineResult = Session.get('machineIssue');
            let machineCount = machineResult.length;
            machineResult.forEach((element) => {
                let countMe = element.newIssues;
                issuesTotal = issuesTotal + countMe.length;
            })
            countResult = {
                machineCount: machineCount,
                issuesTotal: issuesTotal
            }
        } catch {}
        return countResult;
    },

});

Template.analyzingOverView.events({



});

Template.analyzingWithKeyWords.helpers({

    stringSearch: () => {
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
                            errorDescription : element2.errorDescription
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

Template.analyzingResponsibility.helpers({
    openIssue: function() {
      let repairInfos = Session.get('repairInfos');
      let completeIssue = Session.get('completeIssue');
      completeIssue.forEach((element) => {
            element.pictureLocation = repairInfos + element.pictureLocation;
       });
      let openResponsible = [];
      completeIssue.forEach((element) => {
          if (element.issueResponsible === '') {
              openResponsible.push(element);
          }
      });
        return openResponsible;
    },

    closeIssue:  function() {
        let repairInfos = Session.get('repairInfos');
        let completeIssue = Session.get('completeIssue');
        completeIssue.forEach((element) => {
            element.pictureLocation = repairInfos + element.pictureLocation;
        });
        let closedResponsible = [];
        completeIssue.forEach((element) => {
            if (element.issueResponsible !== '') {
                closedResponsible.push(element)
            }
        })
        return closedResponsible;
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
        console.log('reload')
        location.reload();
    }

});

