Meteor.subscribe("variants_C79");
Meteor.subscribe("variants_C78");
Meteor.subscribe("variants_C77");
Meteor.subscribe("variants_C89");
Meteor.subscribe("variants_C88");
Meteor.subscribe("variants_C87");
Meteor.subscribe("variants_C68");


if(Meteor.isClient) {


    Template.variantsViewer.helpers({

       variants: function () {
           let type = Session.get('variantType');
           switch(type) {
               case 1:
                   let variant_C77 = variants_C77.find({}, {sort: {variant: 1}});
                   let variant_C77_length = variants_C77.find().count();
                   Session.set('variant-C77-count', variant_C77_length);
                   return variant_C77;
               case 2:
                   return variants_C78.find({}, {sort: {variant: 1}});
               case 3:
                   return variants_C79.find({}, {sort: {variant: 1}});
               case 4:
                   return variants_C87.find({}, {sort: {variant: 1}});
               case 5:
                   return variants_C88.find({}, {sort: {variant: 1}});
               case 6:
                   return variants_C89.find({}, {sort: {variant: 1}});
               case 7:
                   return variants_C68.find({}, {sort: {variant: 1}});
           }
        },



    });


    Template.variantsViewer.events({

        'change .loadVariant': () => {
            event.preventDefault();
            const file = event.target.files[0];
            if (!file) {

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

        'click .c77': () => {
            event.preventDefault();
            Session.set('variantType', 1);
        },

        'click .c78': () => {
            event.preventDefault();
            Session.set('variantType', 2);
        },

        'click .c79': () => {
            event.preventDefault();
            Session.set('variantType', 3);
        },

        'click .c87': () => {
            event.preventDefault();
            Session.set('variantType', 4);
        },

        'click .c88': () => {
            event.preventDefault();
            Session.set('variantType', 5);
        },

        'click .c89': () => {
            event.preventDefault();
            Session.set('variantType', 6);
        },

        'click .c68': () => {
            event.preventDefault();
            Session.set('variantType', 7);
        },

        'click .submitViewer': () => {
          event.preventDefault();
          var variantChosen = Session.get('variantType');
          const variantVisible = [];
          $('input[name=visible]:checked').each(function() {
              variantVisible.push($(this).val());
          });
          Meteor.call('visibleVariants', variantChosen, variantVisible);
          for (let i = 0; i < variantVisible.length; i++) {
              visible[i].checked= false;
          }
        },

        'click .submitPic': () => {
            event.preventDefault();
            const file = event.target.files[0];
            if (!file) {

                return;
            }
            let reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                document.getElementById('variant').value = '';
                Meteor.call('readVariantPic', contents);
            };
            reader.readAsText(file);
        },


    });




}