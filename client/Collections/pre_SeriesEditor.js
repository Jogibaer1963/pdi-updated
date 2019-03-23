

Template.checkListEditor.helpers({

    listOverView:()=> {
    const result = preSeriesCheck.find().fetch();
    console.log(result);
    return result;
    }


});