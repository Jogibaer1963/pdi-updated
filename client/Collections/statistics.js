
    Template.fuelChart.topGenresChart = function() {

           Meteor.call('fuelConsumption', function (err, response) {
               if (err) {
                   console.log(err);
               }
               Session.set('elementMachine', response.elementMachine);
               Session.set('elementFuelStart', response.elementFuelStart);
               Session.set('elementFuelAfter', response.elementFuelAfter);
               Session.set('elementConsumption', response.elementConsumption);
           });
        let elementMachine = Session.get('elementMachine');
        let elementFuelStart = Session.get('elementFuelStart');
        let elementFuelAfter = Session.get('elementFuelAfter');
        let elementConsumption = Session.get('elementConsumption');

        return {
            chart: {
                height: 500,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'line',
                zoomType: 'x',
                panning: true,
                panKey: 'shift'
            },
            title: {
                text:  "Fuel consumption per PDI"
            },
            tooltip: {
                pointFormat: '{series.name}:<b>{point.y}</b><br/>',
                valueSuffix: ' Gallon',
                shared: true
            },
            plotOptions: {
                series: {
                    color: '#FF0000'
                }
            },
            xAxis: {
              categories: elementMachine,
              labels: {
                  rotation: 30
              }
            },
            series: [{
                name: 'Fuel start',
                data: elementFuelStart
            },
                {
                    name: 'Fuel end',
                    data: elementFuelAfter,
                    color: '#08F'
                },
                {
                    name: 'Consumption',
                    data: elementConsumption,
                    color: '#1aff11'
                }

            ]
        };

    };


    Template.analyzeRepair.events({

       'submit .datePicker': function (e) {
           e.preventDefault();
           let startDate = event.target.dateStart.value;
           let endDate = event.target.dateEnd.value;
           Meteor.call('analyzeRepair', function (err,  ) {

           });
            Session.set('startUnix', moment(startDate).unix());
            Session.set('endUnix', moment(endDate).unix());
            let startTest = Session.get('startUnix');
            let endTest = Session.get('endUnix')
       }
    });



    Template.analyzeRepair.helpers({

        machineRepair: function () {
           let startUnix = Session.get('startUnix');
           let endUnix = Session.get('endUnix');
           if (startUnix) {
               console.log('Huhuuu');
           Session.set('startUnix', '');
           Session.set('endUnix', '');
           Meteor.call('analyzeRepair', startUnix, endUnix);
           console.log(startUnix, endUnix);
           }
        }


    });