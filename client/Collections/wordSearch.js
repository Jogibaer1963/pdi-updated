if (Meteor.isClient) {

 Meteor.subscribe("keyWord");

    Template.wordSearch.events({
        "submit .searchKey": function (event) {
            event.preventDefault();
            const keyWord = event.target.searchWord.value;
            Session.set('keyWord', keyWord);
            event.target.searchWord.value = '';
        }
    });

   Template.wordSearch.helpers({
       keyWordFind: function () {
           const keyWord = Session.get('keyWord');
           if (!!keyWord) {
               return repairOrderPrint.find({Error_Description: {$regex: keyWord, $options: 'i'}});
           }
       }
   });
}