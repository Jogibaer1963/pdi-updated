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
                   let variant_C77 = [];
                   variant_C77 = variants_C77.find({}, {sort: {variant: 1}}).fetch();
                   variant_C77.forEach((element) => {
                       element.imagePath = Session.get('configInfos') + element.imagePath
                   });
                   return variant_C77;
               case 2:
                   let variant_C78 = [];
                   variant_C78 = variants_C78.find({}, {sort: {variant: 1}}).fetch();
                   variant_C78.forEach((element) => {
                       element.imagePath = Session.get('configInfos') + element.imagePath
                   });
                   return variant_C78;
               case 3:
                   let variant_C79 = [];
                   variant_C79 = variants_C79.find({}, {sort: {variant: 1}}).fetch();
                   variant_C79.forEach((element) => {
                       element.imagePath = Session.get('configInfos') + element.imagePath
                   });
                   return variant_C79;
               case 4:
                   let variant_C87 = [];
                   variant_C87 = variants_C87.find({}, {sort: {variant: 1}}).fetch();
                //   let variant_C87_length = variants_C87.find().count();
                //   Session.set('variant-C87-count', variant_C87_length);
                   variant_C87.forEach((element) => {
                       element.imagePath = Session.get('configInfos') + element.imagePath
                   });
                   return variant_C87;
               case 5:
                   let variant_C88 = [];
                   variant_C88 = variants_C88.find({}, {sort: {variant: 1}}).fetch();
                  // let variant_C88_length = variants_C88.find().count();
                  // Session.set('variant-C88-count', variant_C88_length);
                   variant_C88.forEach((element) => {
                       element.imagePath = Session.get('configInfos') + element.imagePath
                   });
                   return variant_C88;
               case 6:
                   let variant_C89 = [];
                   variant_C89 = variants_C89.find({}, {sort: {variant: 1}}).fetch();
                 //  let variant_C89_length = variants_C89.find().count();
                 //  Session.set('variant-C89-count', variant_C89_length);
                   variant_C89.forEach((element) => {
                      element.imagePath = Session.get('configInfos') + element.imagePath
                   });

                   return variant_C89;
           }
        },

        'selectedClass': function () {
            const selected = this._id;
            const selectedVariant = Session.get('selectedVariant');
            if (selected === selectedVariant) {
                return "selected";
            }
        },


    });



    Template.variantsViewer.events({

        'click .openInspections': function (e) {
            e.preventDefault();
            const selectedVariant = this._id;
            Session.set('selectedVariant', selectedVariant);
        },

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

        'click .variant-visible': function(e) {
            e.preventDefault();
            let newStatus = '';
            if(this.status === 0) {
                newStatus = 1;
            } else {
                newStatus = 0;
            }
            let variantType = Session.get('variantType');
            Meteor.call('toggleVariant',variantType ,this._id ,newStatus)
        },
/*
        'change input': function(ev) {
            const selectedVariant = Session.get('selectedVariant');
            if(selectedVariant) {
                _.each(ev.target.files, function(file) {
                    Meteor.saveVariant(file, file.name);
                });
            } else {

            }
        }

 */

    });




