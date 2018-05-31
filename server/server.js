import {Email} from 'meteor/email';
import { Random } from 'meteor/random';


if(Meteor.isServer){

    Meteor.startup( function() {

        Meteor.publish("overView", function () {
            return MachineReady.find({}, {fields: {machineId: 1, date: 1, pdiStatus: 1,
            repairStatus: 1, washStatus: 1, shipStatus: 1, locationId: 1}});
        });

        Meteor.publish("MachineReady", function () {
            return MachineReady.find()
        });

        Meteor.publish("headerReady", function () {
            return headerReady.find()
        });

        Meteor.publish("checkpoints", function(){
            return checkPoints.find();
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

        Meteor.publish("variants_C79", function() {
            return variants_C79.find();
        });

        Meteor.publish("variants_C78", function() {
            return variants_C78.find();
        });

        Meteor.publish("variants_C77", function() {
            return variants_C77.find();
        });

        Meteor.publish("variants_C89", function() {
            return variants_C89.find();
        });

        Meteor.publish("variants_C88", function() {
            return variants_C88.find();
        });

        Meteor.publish("variants_C87", function() {
            return variants_C87.find();
        });

        Meteor.publish("variants_C68", function() {
            return variants_C68.find();
        });

        Meteor.publish("toDoMessage", function() {
            return toDoMesssage.find();
        });

    });






    Meteor.methods({

//--------------------------------------------------------  Variants -----------------------------------------------------------------------
        'readVariant': function (contents) {
            let newContent = contents.replace(/[\t\r\n]/g, '');
            let newContent_2 = newContent.replace(/"/g, "'");
            let newContent_3 = newContent_2.split(/\s*,\s*/);
            let contentLength = newContent_3.length;
            for (i = 0; i < contentLength; i++) {
                let variant_id = JSON.stringify(newContent_3[i]);
                let variantMarker = variant_id.slice(1, 12);
                let stringLength = variant_id.length;
                let variantPart = variant_id.slice(15, (stringLength - 1));
                let variantDescription = variantPart.replace(/'/g, '');
                variants_C68.insert({variant: variantMarker,
                    variantDescription: variantDescription,
                    imagePath: "http://",
                    status: 1 });
            }
        },

        'readConfig': function(machineId, configArray) {
            MachineReady.update({machineId: machineId}, {$set: {config: configArray, configStatus: 1}});
        },
//----------------------------------------------------------- Fuel control ------------------------------------------------------------------
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
//------------------------------------------------------------ Admin User Control ------------------------------------------------------
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

        'newUser' : function (userConst, passwordConst, role,  createdAt, loggedUser) {
            Accounts.createUser({username: userConst, password: passwordConst});
            setTimeout(function () {
            }, 1000);
          Meteor.users.upsert({username:userConst}, {$addToSet: {roles: role}});
          usersProfil.insert({username: userConst, role: role, createdAt: createdAt,
              createdBy: loggedUser, loginStatus: 0});
        },
//-----------------------------------------------------------  SI Control -------------------------------------------------------
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
//------------------------------------------------------------------------------------------------------------------------------------------
        'machineRep': function(machineRepaired, workingHour) {
          MachineReady.update({_id: machineRepaired}, {$set: {machineHours: workingHour, repairStatus: 1}});
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
            const collection = MachineReady.find({machineId: machineNr}, {fields: {
                                                                                   'checkListIssues.errorDescription': 1,
                                                                                    _id: 0}}).fetch();
            console.log(collection);
            /*
            const heading = true;
            const delimiter = ";";
            return exportcsv.exportToCSV(collection, heading, delimiter);
            */
        },

        'editRepair': function(editId) {
          return MachineReady.find({_id: editId}, {fields: {newIssues: 1, checkListIssues: 1 }}).fetch();

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

        'messageToWashBay': function(machine_id, machineNr, washMessage ) {
            washBayText.insert({machineNr: machineNr, washBayMessage: washMessage, active: 1});
            MachineReady.update({_id: machine_id}, {$set: {washStatus: 0}});
        },

        'messageToWashBay_2': function(machineNr, washMessage) {
            washBayText.insert({machineNr: machineNr, washBayMessage: washMessage, active: 1});
       //     MachineReady.update({_id: machineId}, {$set: {washBayMessages: {washMessage}}});
        },

        'messageToWashBay_3': function(machineId, machineNr, washMessage) {
            washBayText.insert({machineNr: machineNr, washBayMessage: washMessage, active: 1});
            MachineReady.update({_id: machineId}, {$set: {washBayMessages: {washMessage}}});
        },

        'truckRemoved': function(machineId, truckStatus) {
            MachineReady.update({_id: machineId}, {$set: {truckStatus: truckStatus, confirmedShipDate: ''}});
        },

        'truckOrdered': function(machineId, truckStatus, confirmedShipDate) {
            MachineReady.update({_id: machineId}, {$set: {truckStatus: truckStatus, confirmedShipDate: confirmedShipDate}});
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

        'inputNewCheckPoint': function(status, errorPos, errorDescription, range, checkStatus, machineRangeEndC77,
                                                                                  machineRangeEndC78, machineRangeEndC79) {
            checkPoints.insert({status: status,
                                errorPos: errorPos,
                                errorDescription: errorDescription,
                                machineType: range,
                                machineRangeEndC77: machineRangeEndC77,
                                machineRangeEndC78: machineRangeEndC78,
                                machineRangeEndC79: machineRangeEndC79,
                                checkStatus: 0});
        },

        'editCheckPoint': function(checkId, status, errorPos, errorDescription, range, checkStatus, machineRangeEndC77,
                                                                                machineRangeEndC78, machineRangeEndC79) {
            checkPoints.update({_id: checkId}, {$set: {status: status,
                                                        errorPos: errorPos,
                                                        errorDescription: errorDescription,
                                                        machineType: range,
                                                        machineRangeEndC77: machineRangeEndC77,
                                                        machineRangeEndC78: machineRangeEndC78,
                                                        machineRangeEndC79: machineRangeEndC79,
                                                        checkStatus: 0}});
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
  // -------------------------------------------- Generate PDI List -------------------------------------------------


        'generatePdiList': function(selectedPdiMachineId, pdiMachineNr, dateStart, pdiUser, machineType) {
            machineConfig = [];
            variant = [];
            siArrayList = [];
            variantMachine = [];
            configDescription = [];
            variantMD = [];
            variantItem = [];
            machineConfiguration = [];
            configStyle = [];
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {pdiStatus: 2,
                                                                     startPdiDate: dateStart,
                                                                     pdiPerformer: pdiUser}});
            let checkType = [];
            if(machineType === 'C77') {
                 checkType = checkPoints.find({machineRangeEndC77: {$lt: pdiMachineNr}}, {fields: {errorDescription: 1,
                                                                                         errorPos: 1}}).fetch();
            } else if(machineType === 'C78') {
                 checkType= checkPoints.find({machineRangeEndC78: {$lt: pdiMachineNr}}, {fields: {errorDescription: 1,
                                                                                           errorPos: 1}}).fetch();
            } else if(machineType.toString() === 'C79') {
                 checkType = checkPoints.find({machineRangeEndC79: {$gt: pdiMachineNr}}, {fields: {errorDescription: 1,
                                                                                           errorPos: 1}}).fetch();
            }
            let checkList = checkPoints.find({status: 1, machineType: {$in: [machineType.toString()]}},
                                                               {fields: {errorDescription: 1,
                                                                                 errorPos: 1,
                                                                              machineType: 1 }}).fetch();
            checkList.push.apply(checkList, checkType);
            let sortK = _.sortBy(checkList, 'errorPos');

            MachineReady.update({_id: selectedPdiMachineId}, {$set: {checkList: sortK}});

            // Load Type Variant

            let type = pdiMachineNr.slice(0,3);
            let newVariant = 'variants_' + type;
            let variantsList = Mongo.Collection.get(newVariant).find({}, {sort: {variant: 1}}).fetch();
            variantsList.forEach((variantValue, k) => {
              variantMD[k] = variantValue.variant;
              variantItem[k] = variantValue.variantDescription;
            });

            // Load Machine Configuration and select config items

            let combineVariant = MachineReady.find({_id: selectedPdiMachineId}, {fields: {config: 1, _id: 0}}, {sort: {variant: 1}}).fetch();
            let k = (combineVariant[0]).config;
                k.forEach((variantMarker, i) => {
                   uniqueId= Random.id();
                   variantMachine[i] = variantMarker;
                   let match = variantMD.indexOf(variantMachine[i]);
                   configStyle[match] = {_id: uniqueId,
                                         'config': variantMD[match],
                                         'configItem': variantItem[match],
                                         machineConfigStatus: 0
                                        };
               machineConfiguration.push(configStyle[match]);
            });
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {machineConfig: machineConfiguration}});

            // SI added to repair list

                let resultSi = siMd.find({$and: [{'machineList.machine': "C7900669"}, {'machineList.siStatus': 0}]}).fetch();
                let result = resultSi.shift();
                let stringResult = JSON.stringify(result).toString();
                let stringLength = stringResult.length
                let firstComma = stringResult.indexOf(',');
                let idSlice = stringResult.slice(7, firstComma);
                let machineSlice = stringResult.slice(firstComma + 1, stringLength - 1);
                console.log(machineSlice);

/*
                    for (i = 0; i < resultSi.length; i++) {
                          if (resultSi[i].siStatus < 1) {
                                 machineSi.push(resultSi[i]);
                          }
                    }
                for (i = 0; i < machineSi.length; i++) {
                    if (machineSi[i].machine === pdiMachineNr) {
                        let machineId = machineSi[i]._id;
                        let repOrder = {};
                        repOrder.errorDescription = siName;
                        repOrder._id = machineId;
                        console.log(repOrder);
                        siMd.update({_id: siName, "machineList._id": machineId}, {$set:{"machineList.$.siStatus": 3}});
                    }
                } */
           // }

        },

        'cancelPdi': function(pdiMachineId) {
            MachineReady.update({_id: pdiMachineId}, {$set: {pdiStatus: 0,
                                                             checkList: [],
                                                             machineConfig: [],
                                                             pdiPerformer: '',
                                                             startPdiDate: '',
                                                             fuelStart: ''
                                                     }});
            siListDone.remove({_id: pdiMachineId});
        },

        'removeCheckPoint': function(selectedPdiMachineId, selectedCheckPoint) {
            pdiCheckList.update({_id: selectedPdiMachineId},
                {$pull: {checkList: {_id: selectedCheckPoint}}});
        },

        //pdi Config Buttons

        'configOkButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "machineConfig._id": idFailure}, {$set: {"machineConfig.$.machineConfigStatus": 1}});
        },

        'configNokButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "machineConfig._id": idFailure}, {$set: {"machineConfig.$.machineConfigStatus": 2}});
            let uniqueId = Random.id();
            let addNewFailure = 'Check config' + '';
            MachineReady.upsert({_id: machineId}, {$push: {newIssues: {_id: uniqueId, checkStatus: 2, errorDescription: addNewFailure}}});
        },


        // pdi Checklist buttons

        'okButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure}, {$set: {"checkList.$.checkStatus": 1, "checkList.$.failStatus": false}})
        },

        'nokButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure}, {$set: {"checkList.$.checkStatus": 2, "checkList.$.failStatus": true}})
        },

        'naButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure}, {$set: {"checkList.$.checkStatus": 3}})
        },

        // Add additional Failure to checklist

        'addNewFailure': (selectedPdiMachineId, addNewFailure) => {
            let uniqueId = Random.id();
            MachineReady.upsert({_id: selectedPdiMachineId}, {$push: {newIssues: {_id: uniqueId, checkStatus: true, errorDescription: addNewFailure}}});
        },

        'removeFailure': (selectedPdiMachineId, openFailure) => {
          MachineReady.update({_id: selectedPdiMachineId}, {$pull: {newIssues : {_id: openFailure}}});
        },

        'orderParts': function (machineNr, loggedInUser, failureAddDescription) {
            const orderStatus = 1;
            orderParts.insert({machineNr: machineNr, user: loggedInUser, description: failureAddDescription,
                orderStatus: orderStatus});
        },

        'pdiMachineBattery': function(selectedPdiMachineId, loggedInUser, battC13CCA, battC13Volt,
                                      mtuG001CCA, mtuG001Volt, mtuG005CCA, mtuG005Volt, mtuG004CCA, mtuG004Volt,
                                      manBatt_1CCA, manBatt_1Volt, manBatt_2CCA, manBatt_2Volt  ) {
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {batteries: {user: loggedInUser, battC13CCA, battC13Volt,
                                      mtuG001CCA, mtuG001Volt, mtuG005CCA, mtuG005Volt, mtuG004CCA, mtuG004Volt,
                                                       manBatt_1CCA, manBatt_1Volt, manBatt_2CCA, manBatt_2Volt}}});
        },

        'pdiMachineOmm': function(selectedPdiMachineId, loggedInUser, fuelMe, ommMain, ommSupp,
                                  ommUnload,ommProfiCam, ommCebis, ommCebisTouch, ommTerra, ommDuals) {
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {omms: {user: loggedInUser, fuelStart: fuelMe,
                    ommMain, ommSupp, ommUnload,ommProfiCam, ommCebis, ommCebisTouch, ommTerra, ommDuals}}});
        },

        'fuelAfterPdi': function (selectedPdiMachine, fuelAfter) {
          MachineReady.update({_id: selectedPdiMachine}, {$set: {fuelAfter: fuelAfter, pdiStatus: 1}});
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
   // -------------------------------------------------- Wash List -------------------------------------------
        'stopWashing': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 0}});
        },

        'finishWashing': function(selectedCheckPoint, dateStop, washDuration, waitWashTime) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 1, stopWashDate: dateStop, washDuration: washDuration, waitWashTime: waitWashTime}});
        },

        'updateWashList': function(selectedCheckPoint, dateStart) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 2, startWashDate: dateStart}});
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

        'locationUpdate': function(selectedPdiMachine, locationId) {
            MachineReady.update({_id: selectedPdiMachine}, {$set: {locationId: locationId}});
        },
/*

        'reserveUpdate': function(selectedPdiMachine, reservedId) {
            MachineReady.update({_id: selectedPdiMachine}, {$set: {reservedFor: reservedId}});
        },

*/

        'removeFromSiList': function (siItem) {
           siList.remove({_id: siItem});
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





