Template.dataBrowser.events({

    'click .goButton': () => {
        console.log('Go');
        Meteor.call('newIdForIssues')
    },


    'change .load-machine-list': (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            Meteor.call('specialOperation', contents);
        };

        reader.readAsText(file);
        document.getElementById('files').value = [];
    },

})