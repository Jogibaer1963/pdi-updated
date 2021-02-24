const Highcharts = require('highcharts');


Template.fuelConsumption.helpers({

    fuelConsumption: function () {
        let machineArray = [];
        let fuelStartArray = [];
        let fuelAfterArray = [];
        let fuelPdiConsumption = [];
        let result = MachineReady.find({}, {fields: {machineId: 1,
                omms: 1,
                fuelAfter: 1 }}).fetch();
        result.forEach((element) => {
            try {
                if (element.fuelAfter && element.omms.fuelStart) {
                    machineArray.push(element.machineId);
                    fuelStartArray.push(parseFloat(element.omms.fuelStart));
                    fuelAfterArray.push(parseFloat(element.fuelAfter));
                    fuelPdiConsumption.push(parseFloat((parseFloat(element.fuelAfter) -
                                            parseFloat(element.omms.fuelStart)).toFixed(1)));

                }
            } catch {}
        })

        // Gather data:

        let average = (fuelPdiConsumption.reduce((a,b) => a + b , 0) / fuelPdiConsumption.length).toFixed(1);
     //   let annualCarts = cartsCounter.reduce((a,b) => a + b, 0);
        let annualCategories = machineArray.length;
        let chartWidth = annualCategories * 50;
        let titleText = annualCategories + " Machines " + " consumed on average " + average + " Gallons of Fuel per Pdi";
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_2', {

                title: {
                    text: titleText
                },

                tooltip: {
                    shared: true
                },

                chart: {

                    style: {
                        fontFamily: '\'Unica One\', sans-serif'
                    },
                    plotBorderColor: '#606063',
                    height: 800,
                    width: chartWidth,
                    zoomType: 'xy'
                },

                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Fuel',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },

                xAxis: {
                    categories:  machineArray,
                    title: {
                        enabled: true,
                        text: 'Machines',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },

                series: [
                    {
                        name: 'Fuel consumption prior start',
                        type: 'column',
                        data: fuelStartArray
                    },
                    {
                        name: 'Fuel consumption after Pdi',
                        type: 'spline',
                        data: fuelAfterArray
                    },
                    {
                        name: 'average use for Pdi',
                        type: 'spline',
                        data: fuelPdiConsumption
                    }
                ]
            });
        });
    },


});


Template.fuelConsumption.events({


});