Template.coaDate.helpers ({


});



Template.coaDate.events({

    'submit .inputEditMachine': (e) => {
        e.preventDefault();
        const machineId = e.target.newMachine.value;
        const coaDate = e.target.newDate.value;
        console.log(machineId, coaDate);
        Meteor.call('coaDate', machineId, coaDate);
        e.target.newMachine.value = '';
        e.target.newDate.value = ''
    }

});
