if(Meteor.isClient) {

    Meteor.subscribe("pdiCheckList");

    Template.pdiCheckList.helpers({

        'selectedClass': function() {
            event.preventDefault();
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        },

        'checkMe': function() {
            event.preventDefault();
            const machineId = Session.get('selectedPdiMachine');
            return pdiCheckList.find({_id: machineId}, {sort: {'errorPos': 1}});
        },

        failureId: function() {
            event.preventDefault();
                 return Session.get('selectedErrorId');
        },

        failureAddDescription: function() {
            failureText = Session.get('failureAddDescription');
            return failureText;
        }

    });

    Template.pdiCheckList.events({

        'click .showCheckList': function(event) {
            event.preventDefault();
            const openInspect = this._id;
            Session.set('selectedCheckPoint', openInspect);
            const repOrder = checkPoints.findOne({_id: openInspect});
            Session.set('repairOrder', repOrder);
        },

        'click .good': function(event) {
            event.preventDefault();
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            const selectedPdiMachineId = Session.get('selectedPdiMachine');

           Meteor.call('removeCheckPoint', selectedPdiMachineId, selectedCheckPoint)
        },

        'click .bigFinger': function () {
            event.preventDefault();
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            const selectedPdiMachineId = Session.get('selectedPdiMachine');
            Meteor.call('bigFinger', selectedPdiMachineId, selectedCheckPoint);
        },



        'click .bad': function(event) {
            event.preventDefault();
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            if(selectedCheckPoint === "" ) {
            } else {
                Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
                const selectedPdiMachineId = Session.get('selectedPdiMachine');
                const repOrder = Session.get('repairOrder');
                const machineNr = Session.get('pdiMachineNumber');
                Meteor.call('addToCheckList', selectedPdiMachineId, repOrder, selectedCheckPoint,
                    machineNr);
                Session.set('selectedCheckPoint', '');
                Session.set('repairOrder', '');
            }
        },



        'click .machineNewAtt': function() {
            event.preventDefault();
            const specialAtt = 1;
            Session.set('specialAtt', specialAtt);
        },

        'click .orderPart, addCheckPointsToList': function() {
            event.preventDefault();
            const orderStat = 1;
            Session.set('orderStat', orderStat);
        },

        'submit .addCheckPointsToList': function(event) {
            event.preventDefault();
            Session.set('pdiMachineNumber', localStorage.getItem('pdiMachine'));
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            const machineNr = Session.get('pdiMachineNumber');
            const selectedPdiMachineId = Session.get('selectedPdiMachine');
            let failureAddDescription = event.target.failureDescription.value;
            const specialAtt = Session.get('specialAtt');
            const orderParts = Session.get('orderStat');
            if(specialAtt === 1) {
               const addText = '**********';
               failureAddDescription = addText + ' ' + failureAddDescription + ' ' + addText;
            }
           if(orderParts === 1) {
                console.log(specialAtt);
               const loggedInUser = Session.get('currentLoggedInUser');
               const addOrder = '***** Parts on Order *****   ';
               failureAddDescription = addOrder + ' ' + failureAddDescription;
               Meteor.call('orderParts', machineNr, loggedInUser, failureAddDescription);
            }
            if(failureAddDescription === "") {
                console.log(failureAddDescription);
            } else {
            const orderId = machineNr + (new Date().getTime());
            const repOrder = {'_id': orderId, 'errorDescription': failureAddDescription,
                'orderStatus': orderParts};
            Meteor.call('addToCheckListNew', selectedPdiMachineId, repOrder, machineNr);
            event.target.failureDescription.value = '';
                Session.set('specialAtt', '');
                Session.set('orderStat', '');
            }
            Session.set('specialAtt', '');
            Session.set('orderStat', '');
        }
    });


    Template.addPdiItems.helpers({

        'selectedClass': function() {
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        },

        foundNewFailure: function() {
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            const selectedPdiMachineId = Session.get('selectedPdiMachine');
            return  InspectedMachines.findOne({_id: selectedPdiMachineId});
        },
    });


    Template.addPdiItems.events({
        'click .erasePoint': function () {
            event.preventDefault();
            const machineNr = Session.get('pdiMachineNumber');
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            Meteor.call('findMe', machineNr, selectedCheckPoint);
        },


        'click .posPdiFinished': function() {
            event.preventDefault();
            window.confirm("PDI Finished ?");
            if(confirm("PDI Finished") === true) {
              } else {
                return false;
            }
            const dateStop = Date.now();
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            const selectedPdiMachine = Session.get('selectedPdiMachine');
            const startTime = MachineReady.findOne({_id: selectedPdiMachine}, {fields: {startPdiDate: 1,
                _id: 0}});
            const pdiDuration = convertMS(dateStop - startTime.startPdiDate);
            const unixTime = MachineReady.findOne({_id: selectedPdiMachine}, {fields: {unixTime: 1, _id: 0}});
            const waitPdiTime = convertMS(startTime.startPdiDate - unixTime.unixTime);
            Session.set('pdiMachineNumber', localStorage.getItem('pdiMachine'));
            const pdiMachine = Session.get('pdiMachineNumber');
            const orderFind = InspectedMachines.find({machineId: pdiMachine, "repOrder.orderStatus": 1},
                {_id: 0, repOrder: {$elemMatch: {orderStatus: 1}}}).fetch();
            if (orderFind.length === 0) {
                }  else {
                stringOrder = JSON.stringify(orderFind);
                const stringCount = stringOrder.match(/Parts on Order/gi).length ;
                    if ( stringCount !== null && stringCount.length <1 ) {
                    } else {
                        const machineId = Session.get('pdiMachineNumber');
                        const userLoggedIn = Session.get('currentLoggedInUser');
                        // ermitteln der Bestellung
                        const emailArray_2 = [];
                        for (i = 0; i < stringCount; i++) {
                            const posOrder = stringOrder.indexOf("***** Parts on Order *****");  //Zahl zur ersten order
                            const slicedOrder = stringOrder.slice(posOrder + 30);
                            const stringEnd = slicedOrder.indexOf('"');
                            const stringOfOne = slicedOrder.substring(0, stringEnd);
                            emailArray_2.push(stringOfOne);
                            stringOrder = stringOrder.substring(stringEnd + posOrder);
                        }
            Meteor.call('machineUser', machineId, userLoggedIn, emailArray_2);
            Meteor.call('sendEmail', ['juergen.hauser@claas.com'],
                  'Claas_Quality@mailgun.com', 'Parts Order request', userLoggedIn);
                     }
            }
            Meteor.call('machineInspected', selectedPdiMachine, dateStop, pdiDuration, waitPdiTime,
                pdiMachine);
            FlowRouter.go('fuelAfter');
        },

        'click .showFinalCheck': function() {
            event.preventDefault();
            const openInspect = this._id;
            Session.set('selectedCheckPoint', openInspect);
        }
    });

    Template.chooseFailureList.helpers({
        
        failureList: function () {
            event.preventDefault();
            Session.set('selectedFailure', "");
            return FailuresList.find({}, {sort: {error_describ: 1}});
        },

        'selectedClass': function() {
            event.preventDefault();
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedFailure');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        }
    });

    Template.chooseFailureList.events({

        'click .showFailureList': function() {
            event.preventDefault();
            Session.set('selectedErrorId', '');
            const failureId = this._id;
            Session.set('selectedFailure', failureId);
            const errorId = FailuresList.findOne({_id: failureId}).errorid;
            Session.set('selectedErrorId', errorId);
        }
    });


    Template.washBayMessage.helpers({
        

    });

    Template.washBayMessage.events({
        'submit .messageToWashBay': function() {
            event.preventDefault();
            const washMessage = event.target.message.value;
            const machineNr = Session.get('pdiMachineNumber');
            const machine_id = Session.get('selectedPdiMachine');
            Meteor.call('messageToWashBay', machineNr, washMessage, machine_id);
            event.target.message.value = '';
            }
    });

}


function convertMS(ms) {
    let d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return(   d + ' d '  + h + ' h ' + m + ' m '  + s +' s');
}



