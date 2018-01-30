if(Meteor.isClient) {

   Template.editHead.helpers({
      showEditHead: function() {
          var selectedHead = Session.get('editSelectedHead');
          var kitSaved = MachineReady.find({_id: selectedHead}, {fields: {"kit": 1}}).fetch();
          var kitString = JSON.stringify(kitSaved);
          var kitExtract = kitString.slice(8, -28);
          var myString = kitExtract.replace(/"/g, "");
          var a = myString.indexOf('B07_0040', 0);
              if(a >= 0){
                  var kit_1 = 'B07_0040';
                  Session.set('kit_1', kit_1);
              } else {
                Session.set('kit_1', undefined);
              }
          var b = myString.indexOf('B07_0045', 0);
              if(b >= 0){
                 var kit_2 = 'B07_0045';
                  Session.set('kit_2', kit_2);
              } else {
                  Session.set('kit_2', undefined);
              }
          var c = myString.indexOf('007_0300', 0);
              if(c >= 0){
                  var kit_3 = '007_0300';
                  Session.set('kit_3', kit_3);
              } else {
                Session.set('kit_3', undefined);
              }
          var d = myString.indexOf('007_0302', 0);
              if(d >= 0){
                 var kit_4 = '007_0302';
                 Session.set('kit_4', kit_4);
              } else {
                Session.set('kit_4', undefined);
              }
          var e = myString.indexOf('003_0301', 0);
              if(e >= 0){
                 var kit_5 = '003_0301';
                 Session.set('kit_5', kit_5);
              } else {
                Session.set('kit_5', undefined);
              }
          var f = myString.indexOf('003_0300', 0);
              if(f >= 0){
                 var kit_6 = '003_0300';
                 Session.set('kit_6', kit_6);
              } else {
                Session.set('kit_6', undefined);
          }
          var g = myString.indexOf('003_0302', 0);
              if(g >= 0){
                 var kit_7 = '003_0302';
                 Session.set('kit_7', kit_7);
              } else {
                Session.set('kit_7', undefined);
          }
          return MachineReady.findOne({_id: selectedHead});
      },

      'newKit1': function() {
          var kit_1 = Session.get('kit_1');
          if(kit_1 == 'B07_0040') {
                  return 'checked';
          }
      },

      'newKit2': function() {
            var kit_2 = Session.get('kit_2');
            if(kit_2 == 'B07_0045') {
                 return 'checked';
            }
      },

       'newKit3': function() {
           var kit_3 = Session.get('kit_3');
           if(kit_3 == '007_0300') {
               return 'checked';
           }
       },

       'newKit4': function() {
           var kit_4 = Session.get('kit_4');
           if(kit_4 == '007_0302') {
               return 'checked';
           }
       },

       'newKit5': function() {
           var kit_5 = Session.get('kit_5');
           if(kit_5 == '003_0301') {
               return 'checked';
           }
       },

       'newKit6': function() {
           var kit_6 = Session.get('kit_6');
           if(kit_6 == '003_0300') {
               return 'checked';
           }
       },

       'newKit7': function() {
           var kit_7 = Session.get('kit_7');
           if(kit_7 == '003_0302') {
               return 'checked';
           }
       }


    });

   Template.editHead.events({
        "submit .inputEditHead": function(event) {
            event.preventDefault();
             var selectedHead = Session.get('editSelectedHead');
             var newHead = event.target.newMachine.value;
             var newShippingDate = event.target.newDate.value;
             var newShippingDestination = event.target.newDestination.value;
             var newShippingTransporter = event.target.newTransporter.value;
             var newShippingTireTrack = event.target.newTireTrack.value;
             var newShippingKit= [];
                $('input[name=newKit]:checked').each(function() {
                    newShippingKit.push($(this).val());
                });
             var newShippingComment = event.target.newComment.value;
             Meteor.call('editShipHead', selectedHead, newHead, newShippingDate, newShippingDestination, newShippingTransporter, newShippingTireTrack, newShippingKit, newShippingComment );
             FlowRouter.go ('headerShipList');
        }
   });

}