


Template.firstAnalyzing.helpers({

    allIssues: function () {
        let result = [];
        Meteor.call('machines', function(err, response) {
            if (response) {
                result = response;
                result.forEach((element) => {
                    if (element.pdi === 1) {
                       // console.log(element.machine, element.ommProfiCam)
                    }

                })
            }
        });

    },

    /*
        let result = MachineReady.find().fetch();
        //const issueArray = [];

        result.forEach((element) => {
                if (element.pdiStatus === 1) {
                    console.log(element.machineId);
                    console.log('user ', element.omms.user);
                }
              //  issueArray.push(element.newIssues[0]);

        })

        console.log(issueArray);
        return(issueArray);


    },

     */


});

Template.firstAnalyzing.events({


});