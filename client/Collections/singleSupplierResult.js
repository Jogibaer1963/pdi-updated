Meteor.subscribe('SuppliersList');
const Highcharts = require('highcharts');


Template.singleSupplierResult.helpers({

    supplierTable: () => {
        return SuppliersList.find().fetch();
    },

    singleSupplierResult: () => {
        let repairInfos = Session.get('repairInfos');
        let singleSupplier = Session.get('selectedSupplierResult')
        let supplierList = {};
        let singleResult = [];
        let result = MachineReady.find({pdiStatus : 1},
            {fields: {newIssues: 1,
                              machineId: 1,
                              repairStatus: 1,
                              omms: 1
                              }}).fetch();
       // console.log('first ', result)
        result.forEach((element) => {
       //     console.log('Machine ', element.machineId)
            element.newIssues.forEach((element2) => {
                if (element2.extern === true && element2.responsible === singleSupplier) {
                    supplierList = {
                        issueId : element2._id,
                        machineNr : element.machineId,
                        pdiTech : element.omms.user,
                        repairStatus: element.repairStatus,
                        errorDescription : element2.errorDescription,
                        pictureLocation : repairInfos + element2.pictureLocation,
                        repairTech : element2.repairTech,
                        repairTime : element2.repairTime
                    }
                    singleResult.push(supplierList);
                }

            })
        })
        return singleResult;
    },
/*
    supplierTable: () => {
        let finalResult = [];
        let uniqueResult = [];
        let machineRepairTime = [];
        let machineRepair = [];
        let totalRepairPer = [];
        let counterResult = [];
        let result = analyzingDatabase.find().fetch();
        result.forEach((element) => {
            if (element.extern === true) {
                finalResult.push(element.issueResponsible);
                machineRepairTime.push(element.machineNr)
                let machineTime = {
                    machine: element.machineNr,
                    repairTime: element.repairTime
                }
                machineRepair.push(machineTime)
            }
        })
        let uniqueMachines = machineRepairTime.filter((x, i, a) => a.indexOf(x) === i);
        uniqueMachines.forEach((element) => {
            machineRepair.forEach((element2) => {
                if (element === element2.machine) {
                    totalRepairPer.push(parseInt(element2.repairTime));
                }
            })
            counterResult.push((totalRepairPer.reduce((a,b) => a + b, 0)))
            totalRepairPer = [];
        })
        let unique = finalResult.filter((v, i, a) => a.indexOf(v) === i)
        unique.forEach((element) => {
            let suppResult = {
                supplier: element
            }
            uniqueResult.push(suppResult);
        })
        Session.set('annualMachines', uniqueMachines);
        Session.set('annualRepTime', counterResult)
        return uniqueResult
    },

 */


    annualMachineRepairResult: function () {
        // Use Meteor.defer() to create chart after DOM is ready:
        // Gather data:
        let annualRepairTime = Session.get('annualRepTime');
        let annualMachines = Session.get('annualMachines');
        let titleText = 'PDI Repair Time per Machine';
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_5', {
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
                    height: 500,
                    width: 900,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Repair Time in min',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: annualMachines,
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
                        name: 'Repair Time per Machine',
                        type: 'column',
                        data: annualRepairTime
                    },
                    {
                        name: 'Machines',
                        type: 'spline',
                        data: annualMachines
                    }
                ]
            });
        });
    },



    /* ------------------------------------------ Annual Supplier result  ------------------ */

/*
    annualSupplierRepairResult: function () {
        // Use Meteor.defer() to create chart after DOM is ready:
        // Gather data:
        let suppResult = [];
        let uniqueSuppResult = [];
        let supplierTotal = [];
        let supplierWithTime = [];
        let totalRepairPer = [];
        let counterSuppResult = [];
        let result = analyzingDatabase.find().fetch();

        // ********  collecting all Supplier (supplierTotal) and supplier with repair time (supplierWithTime *********

        result.forEach((element) => {
            if (element.extern === true) {
                supplierTotal.push(element.issueResponsible)
                let supplierTime = {
                    supplier: element.issueResponsible,
                    repairTime: element.repairTime
                }
                supplierWithTime.push(supplierTime)
            }
        })

        //  *************  collecting Suppliers in 1 array ***********************

       let uniqueSupplier = supplierTotal.filter((x, i, a) => a.indexOf(x) === i); // sort by suppliers

        // ************  Filter and collect repair Time by supplier  **************
       uniqueSupplier.forEach((element) => {
           supplierWithTime.forEach((element2) => {
                if (element === element2.supplier) {
                    totalRepairPer.push(parseInt(element2.repairTime));
                }
            })
            counterSuppResult.push((totalRepairPer.reduce((a,b) => a + b, 0)))
            totalRepairPer = [];
        })
        let unique = suppResult.filter((v, i, a) => a.indexOf(v) === i)
        unique.forEach((element) => {
            let suppResult = {
                supplier: element
            }
            uniqueSuppResult.push(suppResult);
        })
        console.log(unique)
        let annualRepairTime = counterSuppResult;
        let annualMachines = uniqueSupplier;
        let titleText = 'PDI Repair Time per Supplier';
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_6', {
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
                    height: 500,
                    width: 900,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Repair Time in min',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: annualMachines,
                    title: {
                        enabled: true,
                        text: 'Supplier',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                series: [
                    {
                        name: 'Repair Time per Supplier',
                        type: 'column',
                        data: annualRepairTime
                    },
                    {
                        name: 'Supplier',
                        type: 'spline',
                        data: annualMachines
                    }
                ]
            });
        });
    },

 */


});



Template.singleSupplierResult.events({

    'click .selectedSupplier': function (e) {
        e.preventDefault()
        let selectedSupplier = this.supplier;
        Session.set('selectedSupplierResult', selectedSupplier);
    },
    
    'click .buttonReturn': (e) => {
        e.preventDefault();
        FlowRouter.go('supplierResultList')
    }



});