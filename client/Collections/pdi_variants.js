Meteor.subscribe("variants_C79");
Meteor.subscribe("variants_C78");
Meteor.subscribe("variants_C77");
Meteor.subscribe("variants_C89");
Meteor.subscribe("variants_C88");
Meteor.subscribe("variants_C87");


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
                  let variant_C78 = variants_C78.find({}, {sort: {variant: 1}});
                   let variant_C78_length = variants_C78.find().count();
                   Session.set('variant-C78-count', variant_C78_length);
                   return variant_C78;
               case 3:
                   let variant_C79 = variants_C79.find({}, {sort: {variant: 1}});
                   let variant_C79_length = variants_C79.find().count();
                   Session.set('variant-C79-count', variant_C79_length);
                   return variant_C79;
               case 4:
                   let variant_C87 = variants_C87.find({}, {sort: {variant: 1}});
                   let variant_C87_length = variants_C87.find().count();
                   Session.set('variant-C87-count', variant_C87_length);
                   return variant_C87;
               case 5:
                  let variant_C88 = variants_C88.find({}, {sort: {variant: 1}});
                   let variant_C88_length = variants_C88.find().count();
                   Session.set('variant-C88-count', variant_C88_length);
                   return variant_C88;
               case 6:
                   let variant_C89 = variants_C89.find({}, {sort: {variant: 1}});
                   let variant_C89_length = variants_C89.find().count();
                   Session.set('variant-C89-count', variant_C89_length);
                   return variant_C89;
           }
        },



    });


    Template.variantsViewer.events({

        'change .loadVariant': (e) => {
            // upload from SAP:
            // Mark all Variants
            // Print
            // List
            // Send to
            // Local file
            // Text with Tab !!
            e.preventDefault();
            const file = e.target.files[0];
            if (!file) {

                return;
            }
            let reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                document.getElementById('variant').value = '';
                console.log('Content ', contents);
                Meteor.call('readVariant', contents);
            };
            reader.readAsText(file);
        },

        'click .c77': (e) => {
            e.preventDefault();
            Session.set('variantType', 1);
        },

        'click .c78': (e) => {
            e.preventDefault();
            Session.set('variantType', 2);
        },

        'click .c79': (e) => {
            e.preventDefault();
            Session.set('variantType', 3);
        },

        'click .c87': (e) => {
            e.preventDefault();
            Session.set('variantType', 4);
        },

        'click .c88': (e) => {
            e.preventDefault();
            Session.set('variantType', 5);
        },

        'click .c89': (e) => {
            e.preventDefault();
            Session.set('variantType', 6);
        },


        'click .submitViewer': (e) => {
          e.preventDefault();
          let variantCount = '';
          let variantChosen = Session.get('variantType');
          if (variantChosen === 1) {
              variantCount = Session.get('variant-C77-count')
          } else if (variantChosen === 2) {
              variantCount = Session.get('variant-C78-count')
          } else if (variantChosen === 3) {
              variantCount = Session.get('variant-C79-count')
          } else if (variantChosen === 4) {
              variantCount = Session.get('variant-C87-count')
          } else if (variantChosen === 5) {
              variantCount = Session.get('variant-C88-count')
          } else if (variantChosen === 6) {
              variantCount = Session.get('variant-C89-count')
          }
          const variantVisible = [];
          $('input[name=visible]:checked').each(function() {
              variantVisible.push($(this).val());
          });
          Meteor.call('visibleVariants', variantChosen, variantVisible);
      //    var variantCount = Session.get('variant-C77-count');
          for (let i = 0; i <= variantCount - 1; i++) {
              visible[i].checked= false;
          }
        },

            /*
            'change .loadVariantPic': function(event) {
                event.preventDefault();
                console.log('inside');
                var files = event.target.file;
                console.log(files);
                for (var i = 0, ln = files.length; i < ln; i++) {
                    Images.insert(files[i], function (err, fileObj) {
                        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                    });
                }
            }

             */


    });




