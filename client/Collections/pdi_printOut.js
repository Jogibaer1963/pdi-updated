if(Meteor.isClient) {

    Template.pdi_printOut.helpers({

        listContent: function () {
            let pdiMachine = Session.get('selectedPdiMachine');
            let year = Session.get('year');
            if (year === 'Pre Series') {
                return preSeriesMachine.find({_id: pdiMachine});
            } else {
                return MachineReady.find({_id: pdiMachine});
            }

        },

        listOutput: () => {
            const selectedPreMachineId = Session.get('selectedPdiMachine');
            let checkResult = {} ;
            try {
                const result = preSeriesMachine.findOne({_id: selectedPreMachineId},
                    {fields: {checkItems: 1}}).checkItems;
                const resultArray = result.filter((fail) => {
                    return fail.failureStatus === 2;
                });
                let path1 = Session.get('ipAndPort');
                return resultArray.map(resultExtract => {
                    let nods = "?a=" + Math.random();
                    checkResult = {id : resultExtract._id,
                        imagePath : path1 + resultExtract.imagePath + nods,
                        errorDescription: resultExtract.errorDescription
                        };
                    return checkResult;
                });
            }
            catch (e) {
            }
        },

    });

}
