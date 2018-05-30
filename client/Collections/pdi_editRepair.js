

Template.editRepair.helpers({

   showRepair: function() {
       let result = '';
       let editId = localStorage.getItem('editMachine');
       Meteor.call('editRepair', editId, function(error, result) {
           if(error) {
               console.log('error',error);
           } else {
               let resultJson = result.shift();
               console.log('result', resultJson);
               console.log('response 1', resultJson._id);
               console.log('response 2', resultJson.newIssues);
           }
       });
       return result.newIssues;
   }

});