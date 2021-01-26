Meteor.subscribe('SuppliersList');
const Highcharts = require('highcharts');

Session.set('selectedSupplierResult', '');

Template.suppliersListView.helpers({

    suppliersList: () => {
        return SuppliersList.find();
    },

    'selectedSupplier': function(){
      let selectSupp = this._id;
      let selectedSupp = Session.get('selectedSupp')
      if (selectedSupp === selectSupp) {
          return 'selected';
      }
    },
});

Template.suppliersListView.events({

    'click .selectedSupplier': function(e){
      e.preventDefault();
      const selected = this._id;
      console.log('selected', selected);
      Session.set('selectedSupp', selected);
    },

    'submit .newSupplier':(e) => {
        e.preventDefault();
        let newSupplier = e.target.inputSupplier.value;
        Meteor.call('newSupplierAdd', newSupplier);
        e.target.inputSupplier.value = '';
    },

    'click .buttonReturn': (e) => {
        e.preventDefault();
        FlowRouter.go('analyzing');
    },

    'click .supplierRemoveButton': (e) => {
        e.preventDefault();
        let removeId = Session.get('selectedSupp');
        Meteor.call('removeSupplier', removeId);
    }
});

Template.supplierResultList.helpers({

    suppliersResultList: () => {
      let finalResult = [];
      let result = analyzingDatabase.find().fetch();
       result.forEach((element) => {
           if (element.extern === true) {
               finalResult.push(element);
           }
       })
        return finalResult;
    },

    supplierTable: () => {
        let finalResult = [];
        let uniqueResult = [];
        let result = analyzingDatabase.find().fetch();
        result.forEach((element) => {
            if (element.extern === true) {
                finalResult.push(element.issueResponsible);
            }
        })
        let unique = finalResult.filter((v, i, a) => a.indexOf(v) === i)
        unique.forEach((element) => {
            let suppResult = {
                supplier: element
            }
            uniqueResult.push(suppResult);
        })
        return uniqueResult
    }


})

Template.supplierResultList.events({

    'click .selectedSupplier': function (e) {
        e.preventDefault()
        let selectedSupplier = this.supplier;
        Session.set('selectedSupplierResult', selectedSupplier);
        FlowRouter.go('singleSupplierResult')
    }

});

Template.singleSupplierResult.helpers({
    singleSupplierResult: () => {
        let singleSupplier = Session.get('selectedSupplierResult')
        let singleResult = [];
        let result = analyzingDatabase.find().fetch();
        result.forEach((element) => {
            if (element.extern === true && element.issueResponsible === singleSupplier) {
                singleResult.push(element);
            }
        })
        return singleResult;
    },

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
                        text: 'Picking Time in min',
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

    /* ------------------------------------------  Analysis by Month  ------------------ */


});

Template.singleSupplierResult.events({

    'click .selectedSupplier': function (e) {
        e.preventDefault()
        let selectedSupplier = this.supplier;
        Session.set('selectedSupplierResult', selectedSupplier);
    }



});