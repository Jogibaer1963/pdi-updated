Meteor.subscribe('images');


Template.checkGenerator.events({

   'change #files': function (event, template) {
       const files = event.target.file;
       console.log(files);
           Image.insert(files, function (err, fileObj){
               console.log(files);
           });
               // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP

   }

});