Meteor.subscribe("variants_C79");


if(Meteor.isClient) {


    Template.variantsViewer.helpers({

       variants: function () {
            Session.set('selectedPdiMachine', '');
            // Order of shipping date
            return variants_C79.find();
        },



    });


    Template.variantsViewer.events({

        'change .loadVariant': () => {
            event.preventDefault();
            const file = event.target.files[0];
            if (!file) {
                console.log('kein File');
                return;
            }
            let reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                document.getElementById('variant').value = '';
                Meteor.call('readVariant', contents);
            };
            reader.readAsText(file);
        },

    });




}