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

                let path1= "http://192.168.0.109:3300/images/";
                return returnArray = resultArray.map(resultExtract => {
                    checkResult = {id : resultExtract._id,
                        active: resultExtract.activeStatus,
                        failureStatus: resultExtract.failureStatus,
                        imagePath : path1 + resultExtract.imagePath,
                        position : resultExtract.position,
                        issue : resultExtract.issueDescription};
                    return checkResult;
                });

            }
            catch (e) {
            }
        },


    });




}