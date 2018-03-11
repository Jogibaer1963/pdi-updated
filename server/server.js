import {Email} from 'meteor/email';


if(Meteor.isServer){

    Meteor.startup( function() {

        Meteor.publish("overView", function () {
            return MachineReady.find({}, {fields: {machineId: 1, date: 1, pdiStatus: 1,
            repairStatus: 1, washStatus: 1, shipStatus: 1, locationId: 1}});
        });

        Meteor.publish("MachineReady", function () {
            return MachineReady.find()
        });

        Meteor.publish("variants_C77", function () {
            return variants_C77.find()
        });

        Meteor.publish("machineReadyToGo_2016", function () {
            return MachineReady_2016.find()
        });

        Meteor.publish("failures", function(){
            return FailuresList.find();
        });

        Meteor.publish("checkpoints", function(){
            return checkPoints.find();
        });

        Meteor.publish("inspectedMachines", function() {
            return InspectedMachines.find();
        });

        Meteor.publish("pdiCheckList", function(){
            return pdiCheckList.find();
        });

        Meteor.publish("headerTrailer", function(){
            return headerTrailer.find();
        });

        Meteor.publish("washBayText", function(){
            return washBayText.find();
        });

       Meteor.publish("repairOrderPrint", function(){
          return repairOrderPrint.find();
        });

        Meteor.publish("siList", function(){
            return siList.find();
        });

        Meteor.publish("ommMain", function(){
            return ommMain.find();
        });

        Meteor.publish("ommSupp", function(){
            return ommSupp.find();
        });

        Meteor.publish("ommUnload", function(){
            return ommUnload.find();
        });

        Meteor.publish("ommCebisMo", function(){
            return ommCebisMo.find();
        });

        Meteor.publish("ommTeraTrack", function(){
            return ommTeraTrack.find();
        });

        Meteor.publish("ommProfiCam", function(){
            return ommProfiCam.find();
        });

        Meteor.publish("reworkMachineList", function(){
            return reworkMachineList.find();
        });

        Meteor.publish("mcoReview", function () {
           return mcoReview.find();
        });

        Meteor.publish("siListDone", function () {
            return siListDone.find();
        });

        Meteor.publish("siMd", function() {
            return siMd.find();
        });

        Meteor.publish("siTable", function() {
            return siTable.find();
        });

        Meteor.publish("fuelAverage", function() {
            return fuelAverage.find();
        });

        Meteor.publish("usersProfil", function() {
            return usersProfil.find();
        });

    });


    Meteor.methods({


        'readConfig': function(machineId, configArray) {
            MachineReady.update({machineId: machineId}, {$set: {config: configArray, configStatus: 1}});
        },

        'analyzeRepair': function (startUnix, endUnix) {
            console.log(startUnix, endUnix);
            if (startUnix) {
                console.log('in Loop');
            let machineList = MachineReady.find({startPdiDate: {$gt: startUnix}}).count();
                console.log(machineList);
            } else {
               console.log('nicht im Loop');
            }
        },

        'fuelConsumption': function () {
            let elementMachine = [];
            let elementFuelStart = [];
            let elementFuelAfter = [];
            let elementConsumption = [];
          let data = MachineReady.find({}, {fields: {machineId: 1, fuelStart: 1, fuelAfter: 1,
                _id: 0}}).fetch();
            data.forEach(function (element) {
                if (element.fuelStart) {
                    elementMachine.push(element.machineId);
                    let a = parseFloat(element.fuelStart);
                    let b = parseFloat(element.fuelAfter);
                    let consumption = b - a;
                    consumption = consumption.toFixed(1);
                    let consumptionData = parseFloat(consumption);
                    elementFuelStart.push(a);
                    elementFuelAfter.push(b);
                    elementConsumption.push(consumptionData);
                }
            });
          return {elementMachine: elementMachine,
                  elementFuelStart: elementFuelStart,
                  elementFuelAfter: elementFuelAfter,
                  elementConsumption: elementConsumption
          };
        },

       'userManualLogout': function (logOutUser) {
            for (i = 0; i < logOutUser.length; i++) {
                const userName = usersProfil.findOne({_id: logOutUser[i]}).username;
               Meteor.users.update({username: userName}, {$set: {'services.resume.loginTokens': []}});
               usersProfil.upsert({username: userName}, {$set: {loginStatus: 0}});
            }
        },

        'userManualDelete': function (deleteUser) {
            for (i = 0; i < deleteUser.length; i++) {
                const userName = usersProfil.findOne({_id: deleteUser[i]}).username;
                Meteor.users.remove({username: userName});
                usersProfil.remove({username: userName});
            }
        },
    /*
        'adminUserLoggedIn': function (err, usersReturn) {
          usersReturn = Meteor.usersProfil.find().fetch();
         return usersReturn;
        },
    */
        'newUser' : function (userConst, passwordConst, role,  createdAt, loggedUser) {
            Accounts.createUser({username: userConst, password: passwordConst});
            setTimeout(function () {
            }, 1000);
          Meteor.users.upsert({username:userConst}, {$addToSet: {roles: role}});
          usersProfil.insert({username: userConst, role: role, createdAt: createdAt,
              createdBy: loggedUser, loginStatus: 0});
        },

        'removeSi': function (siRemove) {
            const siNumberLoad = siTable.findOne({_id: siRemove});
            if(!!siNumberLoad) {
                siNumber = siNumberLoad.siNumber;
                siTable.remove({_id: siRemove});
                siMd.remove({_id: siNumber});
                }
            },

        'siInsert': function (siMdList) {
            siTable.insert({siNumber: siMdList});
        },

        parseUpload(data, siMdList) {
            const item = [];
           check(data, Array);
           for (let i= 0; i < data.length -1; i++) {
               let csvResult = JSON.stringify(data[i]);
               let csvString = csvResult.slice(12,20);
               let _id = new Mongo.Collection.ObjectID().valueOf();
               let result = {_id: _id, siStatus: 0, machine: csvString};
               item.push(result);
           }
          siMd.upsert({_id: siMdList},{machineList: item});
        },

        'changeStatus': function (siNumber, selectedMachineId, setStatus) {
          siMd.update({_id: siNumber, "machineList._id": selectedMachineId}, {$set: {"machineList.$.siStatus": setStatus}});
        },

        'unsuccessLogin': function (userVar, passwordVar, dateLogin) {
            clientIp = this.connection.clientAddress;
            unsuccessLogin.insert({userId: userVar, password: passwordVar, dateLogin: dateLogin, clientIp: clientIp});
        },

        'successfullLogin': function (userVar, dateLogin) {
             clientIp = this.connection.clientAddress;
             successfullLogin.insert({userId: userVar, dateLogin: dateLogin, clientIp: clientIp});
             usersProfil.update({username: userVar}, {$set: {loginStatus: 1, lastLogin: dateLogin, clientIp: clientIp}});
        },

        'successfullLogout': function(logoutId, logoutDate) {
            successfullLogout.insert({logoutId: logoutId, dateLogout: logoutDate});
            usersProfil.update({username: logoutId}, {$set: {loginStatus: 0}});
        },

        'mcoFind': function(searchId) {
          mcoReview.find({mcoId: searchId});
        },

        'mcoNew': function(newEcn, ecnEffectivity, machineRecording, mcoNotes) {
            if(machineRecording === true) {
                machineRecording = 1
            } else {
                machineRecording = 0
            }
             mcoReview.insert({mcoId: newEcn, effectiveDate: ecnEffectivity,
                 machineRecording: machineRecording, statusMachine: 0, statusMco: 0, mcoNotes: mcoNotes});
        },

        'deactivateRework': function(removeSiItem){
            reworkMachineList.update({_id: removeSiItem}, {$set: {active: 0}});
        },

        'reworkMachineList': function(newPosition, errorValue, failureDescription, nameMachineList){
            reworkMachineList.insert({active: 1, errorPos: newPosition, errorNr: errorValue,
                errorDescription: failureDescription, nameMachineList: nameMachineList});
        },

        'removeSiMachine': function(removeSiItem) {
            siList.remove({_id: removeSiItem});
        },

        'siList': function(machine, siItemText) {
            siList.insert({machineNr: machine, errorNr: '-SI-', errorDescription: siItemText});
        },

        'download_2': function (machineNr) {
            const collection = repairOrderPrint.find({Machine_Nr: machineNr}, {fields: {Machine_Nr: 0, _id:
             0}}).fetch();
            const heading = true;
            const delimiter = ";";
            return exportcsv.exportToCSV(collection, heading, delimiter);
        },

        'download_3': function (siId) {
            const collection = reworkMachineList.find({_id: siId}, {machineList: {machineNr: {$gt: 'C0000000'}}}, {fields: {id: 0}}).fetch();
            const heading = false;
            const delimiter = ";";
            return exportcsv.exportToCSV(collection, heading, delimiter);
        },

        'download_statistics': function () {
        const collection = MachineReady.find({}, {fields: {machineId: 1, dateOfCreation: 1, waitPdiTime: 1, date: 1,  pdiDuration: 1, _id: 0 }}).fetch();
        const heading = true;
        const delimiter = ";";
        return exportcsv.exportToCSV(collection, heading, delimiter);
        },

        // called by washList.js set washBay message to inactive, add user, add date
        'removeText': function(removeId, userWashBay, date) {
            if (userWashBay) {
                const userName = Meteor.users.findOne({_id: userWashBay}).username;
                washBayText.update({_id: removeId}, {$set: {active: 0, user: userName, inactiveDate: date}});
            }
        },

        'messageToWashBay': function(machineNr, washMessage, machine_id) {
            washBayText.insert({machineNr: machineNr, washBayMessage: washMessage, active: 1});
            MachineReady.update({_id: machine_id}, {$set: {washStatus: 0}});
        },

        'messageToWashBay_2': function(washMessage, machineId) {
            washBayText.insert({machineNr: machineId, washBayMessage: washMessage, active: 1});
        },

        'truckRemoved': function(machineId, truckStatus) {
            MachineReady.update({_id: machineId}, {$set: {truckStatus: truckStatus}});
        },

        'truckOrdered': function(machineId, truckStatus) {
            MachineReady.update({_id: machineId}, {$set: {truckStatus: truckStatus}});
        },

        'listRemoved': function(machineId, KitStatus) {
            MachineReady.update({_id: machineId}, {$set: {KitStatus: KitStatus}});
        },

        'listPrinted': function(machineId, KitStatus) {
            MachineReady.update({_id: machineId}, {$set: {KitStatus: KitStatus}});
        },

        'insertHeadTrailer': function(headTransporter, trailerId) {
            headerTrailer.insert({status: '1', headTransporter: headTransporter, newTrailer: trailerId});
        },

        'updateHeadTrailer': function(trailerId, newStatus) {
            headerTrailer.update({_id: trailerId}, {$set: {status: newStatus}});
        },

        'deleteTrailer': function(trailerId) {
            headerTrailer.remove({_id: trailerId});
        },

        'finnishPdi': function(pdiMachineId) {
            pdiCheckList.remove({});
            MachineReady.update({_id: pdiMachineId}, {$set: {pdiStatus: 1}});
        },

        'inputNewCheckPoint': function(status, errorPos, errorDescription, range, machineRangeStart, machineRangeEnd) {
            checkPoints.insert({status: status, errorPos: errorPos,
                errorDescription: errorDescription, machineType: range, machineRangeStart: machineRangeStart,
                          machineRangeEnd: machineRangeEnd, checkStatus: 0});
        },

        'editCheckPoint': function(checkId, status, errorPos, errorDescription, range, machineRangeStart, machineRangeEnd, checkStatus) {
            checkPoints.update({_id: checkId}, {$set: {status: status, errorPos: errorPos,
                    errorDescription: errorDescription, machineType: range, machineRangeStart: machineRangeStart,
                    machineRangeEnd: machineRangeEnd, checkStatus: 0}});
        },

        'deactivateCheckPoint': function(deactivateCheck, status) {
            checkPoints.update({_id: deactivateCheck}, {$set: {status: status}})
        },

        'reActiveCheck': function(reActiveCheck, status) {
            checkPoints.update({_id: reActiveCheck}, {$set: {status: status}})
        },

        'editCheckpoint': function(checkPointId, status, errorPos, errorDescription, machineType) {
            checkPoints.update({_id: checkPointId}, {$set: {status: status, errorPos: errorPos,
                errorDescription: errorDescription, machineType: machineType}});
        },

        'generatePdiList': function(selectedPdiMachineId, selectedPdiMachineNr, dateStart, pdiUser, range) {
            siArrayList = [];
            // remove double key... just in case...
         //   InspectedMachines.remove({_id: selectedPdiMachineId});
            // set machine status into pdi active (2)
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {pdiStatus: 2, startPdiDate: dateStart}});
            // prepare database for incoming pdi checkpoints
         //   InspectedMachines.insert({_id: selectedPdiMachineId, machineId: selectedPdiMachineNr,
         //       dateStart: dateStart, user: user});
            // generate Checklist (checkpoint must have active status 1 and only machine in range
            checkPoints.find({status: 1, machineType: {$in: range}},
                {fields: {errorDescription: 1, errorPos: 1, checkStatus: 1, _id: -1}}, {sort: {errorPos: 1}}).forEach(function (copy) {
                     MachineReady.update({_id: selectedPdiMachineId}, {$addToSet: {checkList: (copy)}});
                       });
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {pdiPerformer: pdiUser}});

            // SI added to repair list
            const list = siList.find({machineNr: selectedPdiMachineNr}, {limit:1}).fetch();
            if(list === '') {
            } else {
                siList.find({machineNr: selectedPdiMachineNr}).forEach(function(repOrder){
                    InspectedMachines.upsert({_id: selectedPdiMachineId}, {$addToSet: {repOrder}});
                    siListDone.upsert({_id: selectedPdiMachineId}, {$addToSet: {repOrder}});
                    });
                }
            let machineSi = [];
            let siTableRead = siTable.find().fetch();
            for (k = 0; k < siTableRead.length; k++) {
                let siName = siTableRead[k].siNumber;
                let resultSi = siMd.findOne({_id: siName}, {machineList: {$in: {machine: selectedPdiMachineNr}}}).machineList;
                    for (i = 0; i < resultSi.length; i++) {
                          if (resultSi[i].siStatus < 1) {
                                 machineSi.push(resultSi[i]);
                          }
                    }
                for (i = 0; i < machineSi.length; i++) {
                    if (machineSi[i].machine === selectedPdiMachineNr) {
                        let machineId = machineSi[i]._id;
                        let repOrder = {};
                        repOrder.errorNr = "--SI--";
                        repOrder.errorDescription = siName;
                        repOrder._id = machineId;
                        InspectedMachines.upsert({_id: selectedPdiMachineId}, {$addToSet: {repOrder}});
                        siMd.update({_id: siName, "machineList._id": machineId},
                         {$set:{"machineList.$.siStatus": 3}});
                    }
                }
            }
        },

        'cancelPdi': function(pdiMachineId) {
            MachineReady.update({_id: pdiMachineId}, {$set: {pdiStatus: 0, checkList: [], pdiPerformer: ''}});
            siListDone.remove({_id: pdiMachineId});
        },

        'removeRepairItem': function(id, id2) {
            InspectedMachines.update({_id: id}, {$pull: {repOrder: {_id: id2}}});
        },

        'removeCheckPoint': function(selectedPdiMachineId, selectedCheckPoint) {
            pdiCheckList.update({_id: selectedPdiMachineId},
                {$pull: {checkList: {_id: selectedCheckPoint}}});
        },


        'bigFinger': function (selectedPdiMachineId, selectedCheckPoint) {
            let bigFingerBase = checkPoints.findOne({_id: selectedCheckPoint});
            pdiCheckList.upsert({_id: selectedPdiMachineId}, {$push: {checkList: {_id: bigFingerBase._id,
                errorPos: bigFingerBase.errorPos, errorDescription: bigFingerBase.errorDescription,
                machineType: bigFingerBase.machineType}}});
        },

        'addToCheckList': function(selectedPdiMachineId, repOrder, selectedCheckPoint, machineNr) {
            InspectedMachines.upsert({_id: selectedPdiMachineId}, {$addToSet: {repOrder}});
            pdiCheckList.update({_id: selectedPdiMachineId}, {$pull: {checkList: {_id: selectedCheckPoint}}});
            const errorNr = checkPoints.find({_id:selectedCheckPoint}, {fields: {errorNr: 1}}).fetch();
           const stringError = JSON.stringify(errorNr).slice(39,-3);
            const descriptionNr = checkPoints.find({_id:selectedCheckPoint}, {fields: {errorDescription: 1}}).fetch();
            const stringDescription = JSON.stringify(descriptionNr).slice(48,-3);
            repairOrderPrint.insert({Machine_Nr: machineNr, Error_Nr: stringError, Error_Description:
             stringDescription,
               Repair_Comments: " ", Issue_Resolved: " "});

        },

        // pdi Checklist buttons

        'okButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure}, {$set: {"checkList.$.checkStatus": 1}})
        },

        'nokButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure}, {$set: {"checkList.$.checkStatus": 2}})
        },

        'naButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure}, {$set: {"checkList.$.checkStatus": 3}})
        },


        'findMe': function (machineNr, selectedPdiMachine) {
            InspectedMachines.update({machineId: machineNr}, {$pull: {repOrder: {_id:selectedPdiMachine}}});
        },


        'addToCheckListNew': function(selectedPdiMachineId, repOrder, machineNr) {
            InspectedMachines.upsert({_id: selectedPdiMachineId}, {$addToSet: {repOrder}});
            const stringDescription = JSON.stringify(repOrder).slice(68,-2);
            repairOrderPrint.insert({Machine_Nr: machineNr, Error_Description: stringDescription});
        },

        'orderParts': function (machineNr, loggedInUser, failureAddDescription) {
            const orderStatus = 1;
            orderParts.insert({machineNr: machineNr, user: loggedInUser, description: failureAddDescription,
                orderStatus: orderStatus});
        },

        'pdiMachineInspected': function(selectedPdiMachineId, loggedInUser, fuelMe, ommMain, ommSupp, ommFitting,
                                        ommTerra, ommCebis, ommProfiCam) {
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {fuelStart: fuelMe}});
            InspectedMachines.update({_id: selectedPdiMachineId}, {$set: {user: loggedInUser, ommMain: ommMain,
                ommSupp: ommSupp, Fitting: ommFitting, ommTerra: ommTerra, ommCebis: ommCebis, ommProfiCam: ommProfiCam}});

        },

        'machineInspected': function(selectedPdiMachine, dateStop, pdiDuration, waitPdiTime, pdiMachine) {
            MachineReady.update({_id:selectedPdiMachine}, {$set: {pdiStatus: 1, stopPdiDate: dateStop,
                pdiDuration: pdiDuration, waitPdiTime: waitPdiTime}});
            pdiCheckList.remove({_id: selectedPdiMachine});
            const repairOrder = InspectedMachines.findOne({_id: selectedPdiMachine});
            MachineReady.upsert({_id: selectedPdiMachine}, {$addToSet: {repairOrder: repairOrder}});
            siList.remove({machineNr: pdiMachine});
        },

        'fuelAfterPdi': function (selectedPdiMachine, fuelAfter, consumption) {
          MachineReady.update({_id: selectedPdiMachine}, {$set: {fuelAfter: fuelAfter, consumption: consumption}});
          fuelAverage.update({}, {$push: {consumption: consumption}});
        },

        'machineUser': function (machineId, userLoggedIn, arrayOrder) {
            orderParts.insert({_id: userLoggedIn, machineNr: machineId, user: userLoggedIn});
            setTimeout(function () {
            }, 1000);

            for (i = 0; i < arrayOrder.length; i++) {
                let repOrder = {};
                repOrder._id = Random.id();
                repOrder.description = arrayOrder[i];
                orderParts.upsert({_id: userLoggedIn}, {$addToSet: {repOrder}});
            }
        },

        'sendEmail': function (to, from, subject, loggedUser) {
            setTimeout(function () { }, 1000);
            const orderFind = orderParts.find({_id: loggedUser}).fetch();
                if (orderFind.length === 0  ) {
                    } else {
                        SSR.compileTemplate('htmlEmail', Assets.getText('html-email.html'));
                        Template.htmlEmail.helpers({
                        orderNr: function () {
                            setTimeout(function () {
                            }, 1000);
                        return orderFind;
                        }
                        });
                    this.unblock();
                        Email.send({
                            to: to,
                            from: from,
                            subject: subject,
                            html: SSR.render('htmlEmail', {machineNr: ''})
                        });
                    }
            orderParts.remove({_id: loggedUser});
        },

        'removeFailureId': function(selectedFailurePoint) {
            FailuresList.remove({_id: selectedFailurePoint});
        },

        'insertFailureId': function(newErrorId, newErrorDescribe) {
            FailuresList.insert({errorid: newErrorId, error_describ: newErrorDescribe});
        },

        'stopWashing': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 0}});
        },

        'stopPdi': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {pdiStatus: 0}});
        },

        'stopRepair': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {repairStatus: 0}});
        },

        'skipPdi': function(pdiMachineId) {
            MachineReady.update({_id: pdiMachineId}, {$set: {pdiStatus: 1}});
        },

        'finishWashing': function(selectedCheckPoint, dateStop, washDuration, waitWashTime) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 1, stopWashDate: dateStop, washDuration: washDuration, waitWashTime: waitWashTime}});
        },

        'locationUpdate': function(selectedPdiMachine, locationId) {
            MachineReady.update({_id: selectedPdiMachine}, {$set: {locationId: locationId}});
        },

        'reserveUpdate': function(selectedPdiMachine, reservedId) {
            MachineReady.update({_id: selectedPdiMachine}, {$set: {reservedFor: reservedId}});
        },

        'removeFromSiList': function (siItem) {
           siList.remove({_id: siItem});
        },

        'machineRep': function(machineRepaired, workingHour) {
            InspectedMachines.remove({_id: machineRepaired});
            MachineReady.update({_id: machineRepaired}, {$set: {repairStatus: 1, machineHour: workingHour}});
        },

        'updateWashList': function(selectedCheckPoint, dateStart) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 2, startWashDate: dateStart}});
        },


        'updateRepairList': function(selectedCheckPoint, dateStart) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {repairStatus: 2, startRepairDate: dateStart}});
        },

        'shipMeInProcess': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {shipStatus: 2}});
        },

        'machineIsGone': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {shipStatus: 1}});
        },
        // shipping Machines
        'removeFromShipList': function(selectedMachine) {
            MachineReady.remove(selectedMachine);
        },

        'addToShipList': function(newMachineInput, newShippingDate, createUnixTime, createDate, createTime,
            newShippingDestination, newShippingTransporter, newShippingKit, newShippingTireTrack, newShippingComment ) {

            MachineReady.insert({
                machineId: newMachineInput,
                dateOfCreation: createDate,
                timeOfCreation: createTime,
                pdiStatus: 0,
                repairStatus: 0,
                washStatus: 0,
                shipStatus: 0,
                unixTime: createUnixTime,
                date: newShippingDate,
                destination: newShippingDestination,
                transporter: newShippingTransporter,
                kit: newShippingKit,
                tireTrack: newShippingTireTrack,
                shippingComment: newShippingComment
            });
        },

        'addHeadToShipList': function(newHeadInput, newShippingDate, createUnixTime, createDate, createTime,
                                      newShippingDestination, newShippingTransporter, newShippingKit, newShippingComment ) {
            MachineReady.insert({
                newHeadId: newHeadInput,
                dateOfCreation: createDate,
                timeOfCreation: createTime,
                pdiStatus: 1,
                repairStatus: 1,
                washStatus: 1,
                shipStatus: 0,
                unixTime: createUnixTime,
                date: newShippingDate,
                destination: newShippingDestination,
                transporter: newShippingTransporter,
                kit: newShippingKit,
                shippingComment: newShippingComment
            });
        },

        'editShipInfo': function(selectedMachine, newMachine, newShippingDate, newShippingDestination, newShippingTransporter,
                                 newShippingTireTrack, newShippingKit, newShippingComment) {
            MachineReady.update({_id:selectedMachine},
                {$set: {machineId: newMachine,
                    date: newShippingDate,
                    destination: newShippingDestination,
                    transporter: newShippingTransporter,
                    tireTrack: newShippingTireTrack,
                    kit: newShippingKit,
                    shippingComment: newShippingComment}

                });
        },

        'editShipHead': function(selectedHead, newHead, newShippingDate, newShippingDestination, newShippingTransporter,
                                 newShippingTireTrack, newShippingKit, newShippingComment) {
            MachineReady.update({_id:selectedHead},
                {$set: {newHeadId: newHead,
                    date: newShippingDate,
                    destination: newShippingDestination,
                    transporter: newShippingTransporter,
                    tireTrack: newShippingTireTrack,
                    kit: newShippingKit,
                    shippingComment: newShippingComment}
                });
        }
    });
 }





