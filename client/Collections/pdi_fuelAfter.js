Template.fuelAfter.events({

    'submit .fuelAfterPdi': function () {
        event.preventDefault();
        const selectedPdiMachine = Session.get('selectedPdiMachine');
        const fuelBeforePdi = Session.get('fuelBeforePdi');
        const fuelAfter = event.target.fuelAfterAll.value;
        const consumption = parseFloat((fuelAfter - fuelBeforePdi).toFixed(1));
        Meteor.call('fuelAfterPdi', selectedPdiMachine, fuelAfter, consumption);
        event.target.fuelAfterAll.value = '';
        Session.set('fuelBeforePdi', '');
        FlowRouter.go('inspectionStart')
    }

});
