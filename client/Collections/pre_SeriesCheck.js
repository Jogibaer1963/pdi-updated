Meteor.subscribe("preSeriesCheck");
Meteor.subscribe("images");
Meteor.subscribe("preSeriesAddChecks");


Template.checkListOverView.helpers({

    listOutput: () => {
        let checkResult = {} ;
        const result = images.find().fetch();
        let path1 = Session.get('ipAndPort');
        return result.map(resultExtract => {
             checkResult = {id : resultExtract._id,
                            active: resultExtract.activeStatus,
                            failure: resultExtract.failureStatus,
                            imagePath : path1 + resultExtract.imagePath,
                            position : resultExtract.position,
                            team : resultExtract.team
                          };
             return checkResult;
        });
    },

    preCheckList: () => {
        return preSeriesAddChecks.find({}, {sort: {errorDescription: 1}}).fetch();
    },

    //------------------------------------------  drop down ------------------------------

    'selectedComponent': function () {
        let component = this._id;
        let selected = Session.get('selectedComponent');
        if (component === selected) {
            Session.set('componentChosen', 1);
            return 'selected'
        }
    },

    mainComponent: function () {
        return mainComponents.find({}, {sort: {description: 1}}).fetch();
    },

    issueComponent: () => {
        try {
            return Session.get('issueComp');
        } catch (e) {

        }
    },

});

Template.checkListOverView.events({

    'click .submitButtonGenerate': (e) => {
        e.preventDefault();
        console.log('call Server');
        Meteor.call('generateDataBase');
    },

    'click .submitButtonTeam1': (e) => {
        e.preventDefault();
        let team = 1;
        let idCheck = e.currentTarget.id;
        Meteor.call('teamSpecifier', team, idCheck);
    },

   'click .submitButtonTeam2': (e) => {
       e.preventDefault();
       let team = 2;
       let idCheck = e.currentTarget.id;
       Meteor.call('teamSpecifier', team, idCheck);
   },

    'click .submitButtonTeam3': (e) => {
        e.preventDefault();
        let team = 3;
        let idCheck = e.currentTarget.id;
        Meteor.call('teamSpecifier', team, idCheck);
    },
    'click .submitButtonTeam4': (e) => {
        e.preventDefault();
        let team = 4;
        let idCheck = e.currentTarget.id;
        Meteor.call('teamSpecifier', team, idCheck);
    },
    'click .submitButtonTeam5': (e) => {
        e.preventDefault();
        let team = 5;
        let idCheck = e.currentTarget.id;
        Meteor.call('teamSpecifier', team, idCheck);
    },

    'click .submitButtonSupplier': (e) => {
        e.preventDefault();
        let supplier = 6;
        let idCheck = e.currentTarget.id;
        Meteor.call('activeInactive', supplier, idCheck);
    },

    'click .submitButtonUnknown': (e) => {
        e.preventDefault();
        let unknown = 0;
        let idCheck = e.currentTarget.id;
        Meteor.call('activeInactive', unknown, idCheck);
    },

    'click .comp': function () {
        const selected = this._id;
        let textMainComp = this.component;
        Session.set('selectedComponent', selected);
        Session.set('issueComp', textMainComp + ' - ');
    },

    'submit .addNewIssue': (event) => {
        event.preventDefault();
        let addNewFailure = event.target.addIssue.value;
            Meteor.call('preSeriesAddCheck', addNewFailure);
        event.target.addIssue.value = '';
        Session.set('componentChosen', 0);
        Session.set('selectedComponent', '');
        Session.set('issueComp', '');
    },

});

