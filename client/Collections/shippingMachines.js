Meteor.subscribe("overView");

Session.set('toggleShipList', 1);

    Template.inputMachine.helpers({

        editMachine: function() {
            const selectedMachine = Session.get('selectedMachine');
            return MachineReady.findOne({_id: selectedMachine});
        },



        shippList: function () {
            // Order of shipping date
            let shipToggleList = Session.get('toggleShipList'); //
            switch(shipToggleList) {
                case 1:
                    return MachineReady.find({shipStatus: 0},
                                              {sort: {date: 1}}
                                              );
                case 0:
                  //  let changeDate = new Date("2020-09-31").getTime() / 1000
                    let fiscalYear = '2022-09-31';
                    let result = MachineReady.find({$and: [{date : {$gt: fiscalYear}}, {shipStatus: 1}]},
                        {sort: {date: -1}}).fetch();
                    Session.set('shippedMachines', result.length)

                    return result
            }
        },

        shippedMachines: () => {
          return Session.get('shippedMachines');
        },

        'selected': function() {
            let shippingMachine = this._id;
            let selectedMachine = Session.get('selectedMachine');
            if (shippingMachine === selectedMachine) {
                let result = MachineReady.findOne({_id: selectedMachine}, {fields: {
                    machineId: 1, date: 1, destination: 1, transporter: 1,
                        tireTrack: 1, machineReturn: 1, kit: 1, shippingComment: 1
                    }});
                Session.set('myMachine', result);
                return 'selected'
            }
        },

        myMachine: () => {
            return Session.get('myMachine');
        },

        editMachineId: () => {
            try {
                let result = Session.get('myMachine')
                return result.machineId
            } catch (e) {
            }
        },

        editDate: () => {
            try {
                let result = Session.get('myMachine')
             //   console.log('shipp date', result.date)
                document.getElementById('shippingDate').innerHTML = result.date
                return result.date
            } catch (e) {
              //  console.log('error ', e)
            }
        },

        editDestination: () => {
            try {
                let result = Session.get('myMachine')
                return result.destination
            } catch (e) {
            }
        },

        editTransporter: () => {
            try {
                let result = Session.get('myMachine')
                return result.transporter
            } catch (e) {
            }
        },

        editTire: () => {
            try {
                let result = Session.get('myMachine')
             //   console.log(result.tireTrack)
                return result.tireTrack
            } catch (e) {
            }
        },

        editReturn: () => {
            try {
                let result = Session.get('myMachine')
                return result.machineReturn
            } catch (e) {
            }
        },

        editShippingComment: () => {
            try {
                let result = Session.get('myMachine')
                return result.shippingComment
            } catch (e) {
            }
        },

        noKit: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'No_Kit' || result[i] === 'No_Kit ' || result[i] === 'No Kit') {
                   //     console.log('No Kit detected')
                        return 'checked'
                    }
                }
            } catch (e) {
               // console.log('result ', e)
            }
        },

        newKit1: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'C03_0019') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit2: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'C03_0183') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit3: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'C03_0165') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit7: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'C03_0180') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit4: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'C03_0184') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit5: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'C03_0185') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit6: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'N04_0625') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit13: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'N04_0626') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit8: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'G03_0112') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit9: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'G03_0120') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit10: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'N04_0624') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit11: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'N04_0595') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        },

        newKit12: function() {
            try {
                let result = Session.get('myMachine').kit;
                for (let i = 0; i <= result.length; i++) {
                    if (result[i] === 'N06_0125') {
                        return 'checked'
                    }
                }
            } catch (e) {
            }
        }

    });


    Template.inputMachine.events({


        "submit .inputNewMachine": function(e) {
            e.preventDefault();
            const createUnixTime = ((Date.now())/1000).toFixed(0);
            let createDate = moment().format('YYYY-MM-DD');
            let createTime = moment().format('HH:mm:ss');
            const newMachineInput = e.target.newMachine.value;
            const newShippingDate = e.target.newDate.value;
            const newShippingDestination = e.target.newDestination.value;
            const newShippingTransporter = e.target.newTransporter.value;
            const newShippingKit= [];
            $('input[name = newKit]:checked').each(function() {
                newShippingKit.push($(this).val());
            });
            const newShippingTireTrack = e.target.newTireTrack.value;
            const newShippingReturns = e.target.newReturn.value;
            const newShippingComment = e.target.newComment.value;
            Meteor.call('addToShipList', newMachineInput, newShippingDate,
                createUnixTime, createDate, createTime, newShippingDestination,
                newShippingTransporter, newShippingKit, newShippingTireTrack,
                newShippingReturns, newShippingComment );
            e.target.newTireTrack.value="";
            e.target.newMachine.value="";
            e.target.newDate.value="";
            e.target.newDestination.value="";
            e.target.newTransporter.value="";
            e.target.newTireTrack.value="";
            e.target.newReturn.value = "";
            e.target.newComment.value="";
            document.getElementById('noKit').checked= false;
            document.getElementById('newKit1').checked= false;
            document.getElementById('newKit2').checked= false;
            document.getElementById('newKit3').checked= false;
            document.getElementById('newKit4').checked= false;
            document.getElementById('newKit5').checked= false;
            document.getElementById('newKit6').checked= false;
            document.getElementById('newKit7').checked= false;
            document.getElementById('newKit8').checked= false;
            document.getElementById('newKit9').checked= false;
            document.getElementById('newKit10').checked= false;
            document.getElementById('newKit11').checked= false;
            document.getElementById('newKit12').checked= false;
            document.getElementById('newKit13').checked= false;
            Session.set('selectedMachine', '');
        },

        'submit .find_Machine': function(e) {
            e.preventDefault();
            Session.set('selectedMachine', '');
            let machineId = e.target.inputSearch.value;
            let result = MachineReady.findOne({machineId: machineId}, {fields: {
                    machineId: 1, date: 1, destination: 1, transporter: 1,
                    tireTrack: 1, machineReturn: 1, kit: 1, shippingComment: 1
                }})
            Session.set('myMachine', result)
            e.target.inputSearch.value = ''
        },

        'click .deleteMachine': (e) => {
            e.preventDefault();
            const deleteMachine = Session.get('selectedMachine');
            Meteor.call('removeFromShipList', deleteMachine);
        },

        'click .selectedMachine': function () {
            const newMachine = this._id;
            Session.set('selectedMachine', newMachine);
        },

        'change .load-machine-list': (e) => {
            e.preventDefault();
            const file = e.target.files[0];
            if (!file) {
                return;
            }
            let reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                Meteor.call('upload-machine-list', contents);
            };

            reader.readAsText(file);
            document.getElementById('files').value = [];
        },

        'submit .truckDate': function(e) {
            e.preventDefault();
            const confirmedShipDate = e.target.inputDate.value;
            const truckStatus = 1;
            const machineId = Session.get('selectedMachine');
            Meteor.call('truckOrdered', machineId, truckStatus, confirmedShipDate);
        },

        'click .removeTruck': function(e) {
            e.preventDefault();
            const truckStatus = 0;
            const machineId = Session.get('selectedMachine');
            Meteor.call('truckRemoved', machineId, truckStatus);
        },

        'click .toggleShippedAll': (e) => {
            e.preventDefault();
            let choice = Session.get('toggleShipList');
            if(choice === 1) {
                Session.set('toggleShipList', 0)
            } else {
                Session.set('toggleShipList', 1);
            }
        }


    });



