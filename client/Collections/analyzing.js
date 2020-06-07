


Template.firstAnalyzing.helpers({

    issuesCount: function () {
        let countResult = {};
        let issuesTotal = 0;
        try {
        Meteor.call('machines', function (err, response) {
            if (response) {
                Session.set('result', response);
            }
        });
        let machineResult = Session.get('result');
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

Template.firstAnalyzing.events({

    'click .refreshButton': (e) => {
        e.preventDefault();
        location.reload();
      //  console.log('Meteor call');
      //  Meteor.call('refresh');
    },

    'submit .searchText': (e) => {
        e.preventDefault();
        let textString = e.target.searchText.value;
        Session.set('searchString', textString);
    }


});