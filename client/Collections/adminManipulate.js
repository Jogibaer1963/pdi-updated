Template.dataBrowser.events({

    'click .goButton': () => {
        console.log('Go');
        Meteor.call('newIdForIssues')
    }

})