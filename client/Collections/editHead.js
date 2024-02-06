if(Meteor.isClient) {

   Template.editHead.helpers({
      showEditHead: function() {
          const selectedHead = Session.get('editSelectedHead');
          const kitSaved = newHeadYear.find({_id: selectedHead}, {fields: {"kit": 1}}).fetch();
          const kitString = JSON.stringify(kitSaved);
          const kitExtract = kitString.slice(8, -28);
          const myString = kitExtract.replace(/"/g, "");

          const a = myString.indexOf('B07_0040', 0);
              if(a >= 0){
                  const kit_1 = 'B07_0040';
                  Session.set('kit_1', kit_1);
              } else {
                Session.set('kit_1', undefined);
              }

          const b = myString.indexOf('B07_0045', 0);
              if(b >= 0){
                 const kit_2 = 'B07_0045';
                  Session.set('kit_2', kit_2);
              } else {
                  Session.set('kit_2', undefined);
              }

          const c = myString.indexOf('007_0300', 0);
              if(c >= 0){
                  const kit_3 = '007_0300';
                  Session.set('kit_3', kit_3);
              } else {
                Session.set('kit_3', undefined);
              }

          const d = myString.indexOf('007_0302', 0);
              if(d >= 0){
                 const kit_4 = '007_0302';
                 Session.set('kit_4', kit_4);
              } else {
                Session.set('kit_4', undefined);
              }

          const e = myString.indexOf('003_0301', 0);
              if(e >= 0){
                 const kit_5 = '003_0301';
                 Session.set('kit_5', kit_5);
              } else {
                Session.set('kit_5', undefined);
              }

          const f = myString.indexOf('003_0300', 0);
              if(f >= 0){
                 const kit_6 = '003_0300';
                 Session.set('kit_6', kit_6);
              } else {
                Session.set('kit_6', undefined);
          }

          const g = myString.indexOf('003_0302', 0);
              if(g >= 0){
                 const kit_7 = '003_0302';
                 Session.set('kit_7', kit_7);
              } else {
                Session.set('kit_7', undefined);
          }

          const h = myString.indexOf('003_0220', 0);
               if(h >= 0){
                  const kit_8 = '003_0220';
                  Session.set('kit_8', kit_8);
               } else {
                 Session.set('kit_8', undefined);
          }

          const i = myString.indexOf('003_0312', 0);
               if(i >= 0){
                  const kit_9 = '003_0312';
                  Session.set('kit_9', kit_9);
               } else {
                 Session.set('kit_9', undefined);
          }

          const j = myString.indexOf('003_0220', 0);
                  if(j >= 0){
                      const kit_10 = '003_0220';
                      Session.set('kit_10', kit_10);
                  } else {
                      Session.set('kit_10', undefined);
                  }

          const k = myString.indexOf('003_0230', 0);
              if(k >= 0){
                  const kit_11 = '003_0230';
                  Session.set('kit_11', kit_11);
              } else {
                  Session.set('kit_11', undefined);
              }

          const l = myString.indexOf('B07_0051', 0);
          if(l >= 0){
              const kit_12 = 'B07_0051';
              Session.set('kit_12', kit_12);
          } else {
              Session.set('kit_12', undefined);
          }

          return newHeadYear.findOne({_id: selectedHead});
      },

       'newKit1': function() {
          const kit_1 = Session.get('kit_1');
          if(kit_1 === 'B07_0040') {
                  return 'checked';
          }
      },

       'newKit2': function() {
            const kit_2 = Session.get('kit_2');
            if(kit_2 === 'B07_0045') {
                 return 'checked';
            }
      },

       'newKit3': function() {
           const kit_3 = Session.get('kit_3');
           if(kit_3 === '007_0300') {
               return 'checked';
           }
      },

       'newKit4': function() {
           const kit_4 = Session.get('kit_4');
           if(kit_4 === '007_0302') {
               return 'checked';
           }
       },

       'newKit5': function() {
           const kit_5 = Session.get('kit_5');
           if(kit_5 === '003_0301') {
               return 'checked';
           }
       },

       'newKit6': function() {
           const kit_6 = Session.get('kit_6');
           if(kit_6 === '003_0300') {
               return 'checked';
           }
       },

       'newKit7': function() {
           const kit_7 = Session.get('kit_7');
           if(kit_7 === '003_0302') {
               return 'checked';
           }
       },

       'newKit8': function() {
           const kit_8 = Session.get('kit_8');
           if(kit_8 === '003_0220') {
               return 'checked';
           }
       },

       'newKit9': function() {
           const kit_9 = Session.get('kit_9');
           if(kit_9 === '003_0312') {
               return 'checked';
           }
       },

       'newKit10': function() {
           const kit_10 = Session.get('kit_10');
           if(kit_10 === '003_0220') {
               return 'checked';
           }
       },

       'newKit11': function() {
           const kit_11 = Session.get('kit_11');
           if(kit_11 === '003_0230') {
               return 'checked';
           }
       },

       'newKit12': function() {
           const kit_12 = Session.get('kit_12');
           if(kit_12 === 'B07_0051') {
               return 'checked';
           }
       }


    });

   Template.editHead.events({
        "submit .inputEditHead": function(event) {
            event.preventDefault();
             const selectedHead = Session.get('editSelectedHead');
             const newHead = event.target.newMachine.value;
             const newShippingDate = event.target.newDate.value;
             const newShippingDestination = event.target.newDestination.value;
             const newShippingTransporter = event.target.newTransporter.value;
             const newShippingKit= [];
                $('input[name=newKit]:checked').each(function() {
                    newShippingKit.push($(this).val());
                });
             const newShippingComment = event.target.newComment.value;
             Meteor.call('editShipHead', selectedHead, newHead, newShippingDate, newShippingDestination,
                                         newShippingTransporter, newShippingKit, newShippingComment );
             FlowRouter.go ('headerShipList');
        }
   });

}