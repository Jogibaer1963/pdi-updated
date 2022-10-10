
// Maschinen ergebniss sortiet nach Maschinen nummern mit Rep Zeit Graph
/*
    repairSummary: () => {
      let repairInfo = Session.get('repairInfos');
      let machineRepairTime = [];
      let result = MachineReady.find({repairStatus: 1}, {
          fields: {newIssues: 1, machineId: 1, omms: 1}}).fetch();
      result.forEach((element) => {
          let machineNr = element.machineId;
          let user = element.omms.user;
          let issues = element.newIssues;
          issues.forEach((element2) => {
              let issueObject = {
                  machineNr: machineNr,
                  pdiTech: user,
                  errorDescription: element2.errorDescription,
                  pictureLocation: repairInfo +  element2.pictureLocation,
                  repairTech: element2.repairTech,
                  repairComment: element2.repairComment,
                  repairTime: element2.repairTime,
                  responsible: element2.responsible,
                  repairStatus: element2.repairStatus,
              }
              machineRepairTime.push(issueObject);
          })
      })
        // Sort result by Machine Number (machineNr is nested in an object)

        machineRepairTime.sort( (a, b) => {
            if (a.machineNr < b.machineNr) return -1
            return a.machineNr > b.machineNr ? 1 : 0
        })
        // prepare arrays for Graph (machine Nr -> x-Axis, summary Repair time -> y-Axis)
        let machineArray = [];
        let repairArray = [];
        let machineRepairArray = [];
        let machineNr = '';
        let repairTime = 0;
        machineRepairTime.forEach((element) =>  {
            machineNr = element.machineNr;
            if (element.repairTime === undefined || element.repairTime === "") {
                repairTime = 0;
            } else {
                repairTime = parseInt(element.repairTime);
            }
            let machineRepair = {
                name: machineNr,
                value: repairTime
               }
            machineRepairArray.push(machineRepair)
            })
        // summary repair time to each single machine number. Name 'name' in object must match
        // 'name' in function !!
        const res = Array.from(machineRepairArray.reduce(
            (m, {name, value}) => m.set(name, (m.get(name) || 0) + value), new Map
        ), ([name, value]) => ({name, value}));
        // build Arrays for Graph
        res.forEach((element) => {
            machineArray.push(element.name);
            repairArray.push(element.value);
        })
        Session.set('machineArray', machineArray);
        Session.set('repairArray', repairArray);
        return machineRepairTime;
    },

   machinesOverRepairTime: function () {
        // Gather data:
        let machine = Session.get('machineArray');
        let repairTime = Session.get('repairArray');

        // Use Meteor.defer() to create chart after DOM is ready:
        let titleText = ' Machines summary repair time';
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
                    width: 2500,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Repair Time in minutes',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: machine,
                    title: {
                        enabled: true,
                        text: 'Machine',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                series: [
                    {
                        name: 'Repair Time',
                        type: 'column',
                        data: repairTime
                    }
                ]
            });
        });
    },

 */