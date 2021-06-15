Meteor.subscribe('SuppliersList');
const Highcharts = require('highcharts');

Session.set('status', true)

Template.singleSupplierResult.helpers({

    supplierTable: () => {
        return SuppliersList.find().fetch();
    },

    'selectedSupplierRow': function(){
        const selectedIssueRow = this._id;
        const selectedIssueId = Session.get('selectedIssueId');
        if (selectedIssueId === selectedIssueRow) {
            return "selected"
        }
    },

    singleSupplierResult: () => {
        let repairInfos = Session.get('repairInfos');
        let singleSupplier = Session.get('selectedSupplierResult')
        let supplierList = {};
        let singleResult = [];
        let statusElement = Session.get('status');
        let result = MachineReady.find({pdiStatus : 1},
            {fields: {newIssues: 1,
                              machineId: 1,
                              repairStatus: 1,
                              omms: 1
                              }}).fetch();
        let returnResult =  supplierFunction(result, singleSupplier, repairInfos, statusElement, supplierList, singleResult)
        returnResult.forEach((element) => {
            if (element.repairTime === undefined) {
                element.repairTime = 0;
            }
        })
        // Sort by Repair Time
        returnResult.sort((a, b) =>  b.repairTime - a.repairTime)
        return returnResult
    },

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

function supplierFunction(result, singleSupplier, repairInfos, statusElement, supplierList, singleResult) {
    result.forEach((element) => {
        element.newIssues.forEach((element2) => {
            if (element2.extern === true &&
                element2.responsible === singleSupplier &&
                element2.checkStatus === statusElement) {
                supplierList = {
                    _id : element2._id,
                    machineNr : element.machineId,
                    pdiTech : element.omms.user,
                    repairStatus: element.repairStatus,
                    errorDescription : element2.errorDescription,
                    pictureLocation : repairInfos + element2.pictureLocation,
                    repairTech : element2.repairTech,
                    repairTime : element2.repairTime,
                    qualityComment : element2.qualityComment,
                    claimNumber : element2.claimNumber,
                    partsOnOrder : element2.partsOnOrder
                }
                singleResult.push(supplierList);
            }
        })
    })
    return singleResult;
}


Template.singleSupplierResult.events({

    'click .selectedSupplier': function (e) {
        e.preventDefault()
        let selectedSupplier = this.supplier;
        Session.set('selectedSupplierResult', selectedSupplier);
    },

    'click .selectedIssue': function(e) {
       e.preventDefault();
       let selectedIssueId = this._id;
       let machineNr = this.machineNr;
       Session.set('selectedIssueId', selectedIssueId)
       Session.set('selectedMachineNr', machineNr)
    } ,
    
    'click .buttonReturn': (e) => {
        e.preventDefault();
        FlowRouter.go('analyzing')
    },

    'click .buttonToggleSupplier': (e) => {
        e.preventDefault();
        if (Session.get('status') === true) {
            Session.set('status', false)
        } else if (Session.get('status') === false) {
            Session.set('status', true)
        }
    },

    'click .buttonParts': (e) => {
        e.preventDefault();

    },

    'submit .qualityComment': function (e) {
       e.preventDefault();
       let comment, claimNr, issueId,machineNr;
        comment = document.getElementById('messageField').value;
        claimNr = document.getElementById('claimField').value;
        issueId = Session.get('selectedIssueId');
        machineNr = Session.get('selectedMachineNr')
        Meteor.call('updateSupplierIssues', machineNr, issueId, comment, claimNr)
        document.getElementById('messageField').value = '';
        document.getElementById('claimField').value = '';
        Session.set('selectedIssueId', '');
        Session.set('selectedMachineNr', '');
    },


    'click .submit-supplier-button': function (e) {
        e.preventDefault();
        let partsOrdered = [];
        let closeCase = [];
        let group = [];
        $('input[name=partsOrdered]:checked').each(function () {
            partsOrdered.push($(this).val());
        });
        $('input[name=group]:checked').each(function () {
            group.push($(this).val());
        });
        $('input[name=closeCase]:checked').each(function () {
            closeCase.push($(this).val());
        });
        Meteor.call('updatePartsGroupClose', partsOrdered, group, closeCase);
        document.getElementById('partsOrdered').checked=false;
        document.getElementById('group').checked=false;
        document.getElementById('closeCase').checked=false;
    }





});