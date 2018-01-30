if(Meteor.isClient) {

    Template.pdi_Omm.events({

        'click .mainOm': function() {
            event.preventDefault();
            let om = ommMain.find({}).fetch();
            Session.set('om', om);
        },

        'click .suppOm': function() {
            event.preventDefault();
            let omSupp = ommSupp.find({}).fetch();
            Session.set('omSupp', omSupp);
        }


    });

    Template.omMain.helpers({

        mainOm: function() {
            return Session.get('om');
        }    
    });
    
    Template.suppOm.helpers({
        suppOm: function() {
            return Session.get('omSupp');
        }
    });


    Template.mainOmmInput.events({

        'submit .mainOm': function(event) {
            event.preventDefault();
           const omPartNr = event.target.mainOmmPartNr.value;

        }
    })
}