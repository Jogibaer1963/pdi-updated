Meteor.subscribe("variants_C79");
Meteor.subscribe("variants_C78");
Meteor.subscribe("variants_C77");
Meteor.subscribe("variants_C89");
Meteor.subscribe("variants_C88");
Meteor.subscribe("variants_C87");


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
                const  newContent = JSON.stringify(contents);
               console.log(newContent);
               // Meteor.call('readVariant', contents);
            };
            reader.readAsText(file);
        },

    });




}