if(Meteor.isClient) {

    Template.editMachine.helpers({
        showEditMachine: function() {
            const selectedMachine = Session.get('editSelectedMachine');
            const kitSaved = MachineReady.find({_id: selectedMachine}, {fields: {"kit": 1}}).fetch();
            const kitString = JSON.stringify(kitSaved);
            const kitExtract = kitString.slice(8, -28);
            const myString = kitExtract.replace(/"/g, "");

            const x = myString.indexOf('No_Kit  ', 0);
            if(x >= 0){
                const kit_0 = 'No_Kit   ';
                Session.set('kit_0', kit_0);
            } else {
                Session.set('kit_0', undefined);
            }

            const a = myString.indexOf('C03_0019', 0);
            if(a >= 0){
                const kit_1 = 'C03_0019';
                Session.set('kit_1', kit_1);
            } else {
                 Session.set('kit_1', undefined);
              }

            const b = myString.indexOf('C03_0065', 0);
            if(b >= 0){
                const kit_2 = 'C03_0065';
                Session.set('kit_2', kit_2);
            } else {
                Session.set('kit_2', undefined);
            }

            const c = myString.indexOf('C03_0165', 0);
            if(c >= 0){
                const kit_3 = 'C03_0165';
                Session.set('kit_3', kit_3);
            } else {
                Session.set('kit_3', undefined);
            }

            const g = myString.indexOf('C03_0180', 0);
            if(g >= 0){
                const kit_7 = 'C03_0180';
                Session.set('kit_7', kit_7);
            } else {
                Session.set('kit_7', undefined);
            }

            const d = myString.indexOf('B05_0120', 0);
            if(d >= 0){
                const kit_4 = 'B05_0120';
                Session.set('kit_4', kit_4);
            } else {
                Session.set('kit_4', undefined);
            }

            const e = myString.indexOf('B05_0130', 0);
            if(e >= 0){
                const kit_5 = 'B05_0130';
                Session.set('kit_5', kit_5);
            } else {
                Session.set('kit_5', undefined);
            }

            const f = myString.indexOf('D06_0030', 0);
            if(f >= 0){
                const kit_6 = 'D06_0030';
                Session.set('kit_6', kit_6);
            } else {
                Session.set('kit_6', undefined);
            }

            const gg = myString.indexOf('G03_0112', 0);
            if(gg >= 0){
                const kit_8 = 'G03_0112';
                Session.set('kit_8', kit_8);
            } else {
                Session.set('kit_8', undefined);
            }

            const h = myString.indexOf('G03_0120', 0);
            if(h >= 0){
                const kit_9 = 'G03_0120';
                Session.set('kit_9', kit_9);
            } else {
                Session.set('kit_9', undefined);
            }

            return MachineReady.findOne({_id: selectedMachine});
        },

        'noKit': function() {
            const kit_0 = Session.get('kit_0');
            if(kit_0 === 'No_Kit  ') {
                return 'checked';
            }
        },

         'newKit1': function() {
                 const kit_1 = Session.get('kit_1');
                 if(kit_1 === 'C03_0019') {
                     return 'checked';
                 }
         },

        'newKit2': function() {
            const kit_2 = Session.get('kit_2');
            if(kit_2 === 'C03_0065') {
                return 'checked';
            }
        },

        'newKit3': function() {
            const kit_3 = Session.get('kit_3');
            if(kit_3 === 'C03_0165') {
                return 'checked';
            }
        },

        'newKit7': function() {
            const kit_7 = Session.get('kit_7');
            if(kit_7 === 'C03_0180') {
                return 'checked';
            }
        },

        'newKit4': function() {
            const kit_4 = Session.get('kit_4');
            if(kit_4 === 'B05_0120') {
                return 'checked';
            }
        },

        'newKit5': function() {
            const kit_5 = Session.get('kit_5');
            if(kit_5 === 'B05_0130') {
                return 'checked';
           }
        },

        'newKit6': function() {
            const kit_6 = Session.get('kit_6');
            if(kit_6 === 'D06_0030') {
                return 'checked';
            }
        },

        'newKit8': function() {
            const kit_8 = Session.get('kit_8');
            if(kit_8 === 'G03_0112') {
                return 'checked';
            }
        },

        'newKit9': function() {
            const kit_9 = Session.get('kit_9');
            if(kit_9 === 'G03_0120') {
                return 'checked';
            }
        }

    });

    Template.editMachine.events({
        "submit .inputEditMachine": function(event) {
            event.preventDefault();
            const selectedMachine = Session.get('editSelectedMachine');
            const newMachine = event.target.newMachine.value;
            const newShippingDate = event.target.newDate.value;
            const newShippingDestination = event.target.newDestination.value;
            const newShippingTransporter = event.target.newTransporter.value;
            const newShippingTireTrack = event.target.newTireTrack.value;
            const newShippingKit= [];
            $('input[name=newKit]:checked').each(function() {
                newShippingKit.push($(this).val());
            });
            const newShippingComment = event.target.newComment.value;
            Meteor.call('editShipInfo', selectedMachine, newMachine, newShippingDate, newShippingDestination, newShippingTransporter, newShippingTireTrack, newShippingKit, newShippingComment );
            FlowRouter.go ('shippingMachines');
        }
    });

}