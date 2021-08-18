//import {Email} from 'meteor/email';
import {Random} from 'meteor/random';
import { Meteor } from 'meteor/meteor';




if(Meteor.isServer){

    Meteor.startup( function() {

        Meteor.publish("overView", () => {
            return MachineReady.find({machineId: {$gt: 'C6800000'},
                                               $or: [{shipStatus: 0}, {shipStatus: 1}]});

        });

        Meteor.publish("preOverView", () => {
           return  preSeriesMachine.find({},
                     {fields: {preMachineId: 1,
                                       date: 1,
                                       pdiStatus: 1,
                                       configStatus: 1
                                   }},
                                {sort: {preMachineId: 1}});
        });

        Meteor.publish("MachineReady", function () {
            return MachineReady.find()
        });

        Meteor.publish("checkpoints", function(){
            return checkPoints.find();
        });

        Meteor.publish("headerTrailer", function(){
            return headerTrailer.find();
        });

        Meteor.publish("washBayText", function(){
            return washBayText.find();
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

        Meteor.publish("usersProfile", function() {
            return usersProfile.find();
        });

        Meteor.publish("toDoMessage", function() {
            return toDoMessage.find();
        });

        Meteor.publish("addIssues", function() {
            return addIssues.find();
        });

        Meteor.publish("mainComponents", function() {
            return mainComponents.find();
        });

        Meteor.publish("newHeadYear", function() {
            return newHeadYear.find();
        });

        Meteor.publish("dropDownHistoricMachines", function() {
            return dropDownHistoricMachines.find();
        });

        Meteor.publish("specialItems", function() {
            return specialItems.find();
        });

        Meteor.publish("images", function() {
            return images.find();
        });

        Meteor.publish("oms", function() {
            return oms.find();
        });

        Meteor.publish("preSeriesMachine", function() {
            return preSeriesMachine.find();
        });

        Meteor.publish("preSeriesAddChecks", function() {
            return preSeriesAddChecks.find();
        });

        Meteor.publish("variants", function() {
            return variants.find();
        });

        Meteor.publish("SuppliersList", function() {
            return SuppliersList.find();
        });

        Meteor.publish("TeamList", function() {
            return TeamList.find();
        });

        Meteor.publish("machineCommTable", function() {
            return machineCommTable.find();
        });

        Meteor.publish("orderParts", function() {
            return orderParts.find();
        });

    });




    Meteor.methods({
/*
        'newIdForIssues': () => {
          let result = MachineReady.find({}, {fields: {newIssues: 1}}).fetch();
          result.forEach((element) => {
                  if (element.newIssues !== undefined) {
                          element.newIssues.forEach((element2) => {
                        //  console.log(element2._id, element2.errorDescription)
                          let newId = Random.id();
                          MachineReady.update({_id: element._id, 'newIssues._id': element2._id},
                              {$set: {'newIssues.$._id': newId}})
                        //  console.log(element2._id, element2.errorDescription)
                         })
                  }
                })

            console.log('done')
        },

 */



   // ************* Remove last year shipped machines from database  **************************

            'removeMachines': () => {
                let result = MachineReady.find().fetch();
                result.forEach((element) => {
                    if (element.machineId >= 'C7900001' &&
                        element.machineId <= 'C7900999' &&
                        element.shipStatus === 1
                    ) {
                        console.log(element.machineId, element._id);
                        MachineReady.remove({_id: element._id})
                    }
                })
        },

        //  ********************  Team List   ********************

        'newTeamAdd': (newSupplier) => {
            TeamList.insert({team: newSupplier})
        },

        'removeTeam': (removeId) => {
            TeamList.remove({_id: removeId})
        },


        //  ********************   Supplier List & quality comments & claims ****************

        'newSupplierAdd': (newSupplier) => {
          SuppliersList.insert({supplier: newSupplier})
        },

        'removeSupplier': (removeId) => {
            SuppliersList.remove({_id: removeId})
        },

        'addSupplierToRepair': (machineNr, issueId, selectedSupplier) => {
            if (issueId && selectedSupplier) {
            MachineReady.update({machineId: machineNr, 'newIssues._id' : issueId},
                                {$set: {'newIssues.$.responsible': selectedSupplier,
                                                 'newIssues.$.extern': true,
                                                 'newIssues.$.newEntry': true}
                                })
            }
        },

        'updateQualityComment': (machineNr, selectedLineId, qualityText, partsOrder, amountOrdered,
                                 claimNumber, partNumber) => {
            let partsStatus, amountOnOrder;
            partsStatus = parseInt(partsOrder)
            amountOnOrder = parseInt(amountOrdered);
            if (partsStatus === 1) {
                MachineReady.update({machineId: machineNr, 'newIssues._id' : selectedLineId},
                    {$set: {'newIssues.$.qualityComment' : qualityText,
                            'newIssues.$.partsOrder': partsStatus}});
            } else if (partsStatus === 2) {
                MachineReady.update({machineId: machineNr, 'newIssues._id' : selectedLineId},
                    {$set: {'newIssues.$.qualityComment' : qualityText,
                            'newIssues.$.partsOrder': partsStatus,
                            'newIssues.$.claimNumber': claimNumber,
                            'newIssues.$.partNumber': partNumber}});
            }
            if (partsStatus === 2) {
                // open Order
                orderParts.insert({machineId: machineNr, selectedLineId : selectedLineId,
                    qualityText : qualityText, partsOrder: partsStatus,
                    claimNumber: claimNumber, partNumber: partNumber})
            } else if (partsStatus === 1) {
                // part arrived
                orderParts.update({selectedLineId : selectedLineId},
                    {$set: {partsOrder: partsStatus}})
            }
           // checking if all parts are delivered for specific Machine
            if (amountOnOrder >= 1 ) {
                partsStatus = 2;
                MachineReady.update({machineId: machineNr}, {$set: {partsOnOrder: partsStatus,
                        amountOnOrder: amountOnOrder}})
            } else if (amountOnOrder === 0) {
                partsStatus = 1;
                MachineReady.update({machineId: machineNr}, {$set: {partsOnOrder: partsStatus,
                        amountOnOrder: amountOnOrder}})
            }


        },

        'updateSupplierIssues': (machineNr, issueId, comment, claimNr) => {
                MachineReady.update({machineId : machineNr, 'newIssues._id' : issueId},
                                   {$set: {'newIssues.$.qualityComment' : comment,
                                                    'newIssues.$.claimNumber' : claimNr}})
        },

        'updatePartsGroupClose':(partsOrdered, group, closeCase) => {
                console.log(partsOrdered, group, closeCase)
             if (partsOrdered.length !== 0) {
                console.log('parts on order', partsOrdered)
                 partsOrdered.forEach((element) => {
                     let machineNr = element.slice(18, 28)
                     let issueId = element.slice(0, 17)
                     console.log('Machine Nr ', machineNr, 'issueId', issueId, partsOrdered)
                     MachineReady.update({machineId : machineNr, 'newIssues._id' : issueId},
                         {$set: {'newIssues.$.partsOnOrder': true}})
                 })
            }
            if (group.length !== 0) {
                console.log('group detected')
            }
            if (closeCase.length !== 0) {
                closeCase.forEach((element) => {
                    let machineNr = element.slice(18, 28)
                    let issueId = element.slice(0, 17)
                    console.log('close Case detected', issueId, machineNr)
                    MachineReady.update({machineId : machineNr, 'newIssues._id' : issueId},
                        {$set: {'newIssues.$.checkStatus': false}})
                })
            }
        },

        // *********************************   analyzing -> analyzingResponseTeam  *********************

        'choseTeam': (team, failureId, machineId) => {
                MachineReady.update({_id: machineId, 'newIssues._id': failureId},
                                    {$set: {'newIssues.$.responsible': team}})

        },

        //  *******************************************************
        // ToDo : change fiscal year automatically

        'fiscalYear': () => {
            let changeDate = new Date("2020-09-31").getTime() / 1000
          return MachineReady.find({unixShipDate : {$gt: changeDate}}).fetch();
        },


        'readConfig': function(machineId, configArray) {
            MachineReady.update({machineId: machineId},
                {$set: {config: configArray, configStatus: 1}});
        },

        'readReConfig': function(contentArray) {
                console.log('starting')
                let reConfigArray = [];
                let reConfigObj = {};
                contentArray.forEach((element) => {
                    let result = element.split(',');
                    try {
                        let string = 'MD_' + result[2].split('/').join('_').slice(0, 8);
                        reConfigObj = {
                            identifier : result[1],
                            config : string
                        }
                        MachineReady.update({machineId : result[0]},
                            {$addToSet: {reConfigArray : reConfigObj}})
                    } catch(e) {}
                })
            console.log('done')
        },

/*
        'machines': () => {
                let result = MachineReady.find({pdiStatus: 1}).fetch();
                result.forEach(function(element) {
                    let date = element.startPdiDate
                    if (date !== undefined) {
                       let machine = element.machineId;
                        console.log(machine)
                       let unixPdiDate = date.getTime().toFixed(0);
                       let unixPdiDateInt = parseInt(unixPdiDate, 10);

                       MachineReady.update({machineId: machine},
                           {$set: {unixPdiDate: unixPdiDateInt}})
                    }

                })
        },
*/

        'coaDate': (machineId, coaDate) => {
            MachineReady.upsert({machineId: machineId}, {$set: {coaDate: coaDate}});
          //  console.log(machineId);
            preSeriesMachine.upsert({preMachineId: machineId}, {$set: {coaDate: coaDate}});
    },

    //---------------------------------------- evaluate ok, nok, add message to pic -----------------

    'addMessageToPic': (selectedPreMachineId, target, message) => {
        preSeriesMachine.update({_id: selectedPreMachineId, 'checkItems._id': target},
            {$set: {'checkItems.$.errorDescription': message}})

    },

    //-------------------------------------- Specify Team for each failure --------------

     'teamSpecifier': (machineId, team, idCheck) => {
         MachineReady.update({_id: machineId, 'newIssues._id': idCheck},
             {$set: {'newIssues.$.responsible': team,
                      }})
     },

  //-------------------------------------------------- Historic PDI's ------------------------------------

        'historicPdi': (selected) => {
          return dropDownHistoricMachines.findOne({_id: selected}).id;
        },

 //----------------------------------------------------- Components -----------------------------------------------------------------------

        'moveHeads': (newMoveMe) => {
            newMoveMe.forEach((result) => {
                const machineToMove = MachineReady.findOne({_id: result});
                newHeadYear.insert(machineToMove);
                MachineReady.remove({_id: result});
            })
        },

        'addNewComponent': (newComponent) => {
            let newId = Random.id();
            mainComponents.insert({_id: newId, component: newComponent});
        },

        'addSubComponent': (component_id, newSubComponent) => {
            let newId = Random.id();
            mainComponents.upsert({_id: component_id},
                                 {$push: {subComponent:
                                             {_id: newId, component: newSubComponent}}} )
        },

//--------------------------------------------------------  Variants -----------------------------------------------------------------------
        'readVariant': function (contents) {
            let cbpat8Array = [];
            let mainGroupVariant = '';
            let cbpat8Pos = 0;
            let contentString = JSON.stringify(contents);
            let latestUpdate = new Date().toLocaleDateString();
            let stringTypePos = contentString.search("Type C");
            // looking for C8x
            let combineType = contentString.slice(stringTypePos + 5, 1250);
            // find positions of all cbpat8, store group in array
            let cbpat8Count = (contentString.match(/cbpat8/g) || []).length;
            let newContentString = contentString;
            for (let i = 0; i <= cbpat8Count - 1; i++) {
                cbpat8Pos = newContentString.search("cbpat8");
                cbpat8Array.push(cbpat8Pos);
                newContentString = newContentString.slice(cbpat8Pos + 8);
            }
            let j = 0;
            cbpat8Array.forEach((element) => {
               let groupVariantString = contentString.substring(j, j + element);
                let cbpat3Count = (groupVariantString.match(/cbpat3/g) || []).length;
                if (cbpat3Count !== 0) {
                     mainGroupVariant = groupVariantString.substring(0, 6);
                    for (let k = 0; k <= cbpat3Count - 1; k ++) {
                        let countCbpat3Start = groupVariantString.search("cbpat3");
                        let groupVariant = groupVariantString.substring(countCbpat3Start + 22);
                        let countCbpat3End = groupVariant.search("cell");
                        let singleGroup = groupVariant.slice(0, countCbpat3End - 15);
                        let singleVariant = singleGroup.substring(0, 4);
                        let singleGroupVariant = mainGroupVariant + '_' + singleVariant;
                        let textVariant = (singleGroup.replace((singleVariant + '_'), '')).slice(0, 49);
                        let id = combineType + '_' + singleGroupVariant;
                        let z = textVariant.search('          L ');
                        if (z < 0) {
                            try {
                                variants.upsert({_id: id},
                                    {
                                    variant : singleGroupVariant,
                                    type: combineType,
                                    variantDescription: textVariant,
                                    imagePath: "noInfo.JPG",
                                    status: 1,
                                    dateLoaded: latestUpdate
                                });
                            } catch (e) {
                                console.log(e)
                            }
                        }
                        groupVariantString = groupVariant.replace(singleGroup, '');
                    }
                }
                j = 8 + j + element;
            })
        },

    'toggleVariant': function(variantType, id, toggle) {
            variants.update({_id: id}, {$set: {status: toggle}});
        },

//----------------------------------------------------------- Fuel control ------------------------------------------------------------------
        'fuelConsumption': function () {
            let elementMachine = [];
            let elementFuelStart = [];
            let elementFuelAfter = [];
            let elementConsumption = [];
          let data = MachineReady.find({}, {fields: {machineId: 1, fuelStart: 1, fuelAfter: 1,
                _id: 0}}).fetch();
            data.forEach( (element) => {
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
            for (let i = 0; i < logOutUser.length; i++) {
                const userName = usersProfile.findOne({_id: logOutUser[i]}).username;
               Meteor.users.update({username: userName}, {$set: {'services.resume.loginTokens': []}});
               usersProfile.upsert({username: userName}, {$set: {loginStatus: 0}});
            }
        },

        'userManualDelete': function (deleteUser) {
            for (let i = 0; i < deleteUser.length; i++) {
                const userName = usersProfile.findOne({_id: deleteUser[i]}).username;
                Meteor.users.remove({username: userName});
                usersProfile.remove({username: userName});
            }
        },

        'newUser' : function (userConst, passwordConst, role,  createdAt, loggedUser) {
            Accounts.createUser({username: userConst, password: passwordConst});
            setTimeout(function () {
            }, 1000);
          Meteor.users.upsert({username:userConst}, {$addToSet: {roles: role}});
          usersProfile.insert({username: userConst, role: role, createdAt: createdAt,
              createdBy: loggedUser, loginStatus: 0});
        },
//-----------------------------------------------------------  SI Control -------------------------------------------------------
        'removeSi': function (siRemove) {
            const siNumberLoad = siTable.findOne({_id: siRemove});
            if(!!siNumberLoad) {
                let siNumber = siNumberLoad.siNumber;
                siTable.update({_id: siRemove}, {$set: {active: 0}});
                siMd.update({_id: siNumber}, {$set: {active: 0}});
                }
            },

        'reactSi': (siReact) => {
            const siNumberLoad = siTable.findOne({_id: siReact});
            if(!!siNumberLoad) {
                let siNumber = siNumberLoad.siNumber;
                siTable.update({_id: siReact}, {$set: {active: 1}});
                siMd.update({_id: siNumber}, {$set: {active: 1}});
            }
        },

        'siInsert': function (siMdList) {
            siTable.insert({siNumber: siMdList, active: 1});
        },

        'parseUpload': function (data, siMdList) {
            const item = [];
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
        'machineRep': function(machineRepaired, workingHour, fuel) {
          MachineReady.update({_id: machineRepaired}, {$set: {machineHours: workingHour,
                                                                              repairStatus: 1,
                                                                              fuelEnd: fuel}});
        },

        'changeStatus': function (siNumber, selectedMachineId, setStatus) {
          siMd.update({_id: siNumber, "machineList._id": selectedMachineId},
                                     {$set: {"machineList.$.siStatus": setStatus}});
        },

        'successLogin': function (userVar, dateLogin) {
          let clientIp = this.connection.clientAddress;
             usersProfile.update({username: userVar}, {$set: {loginStatus: 1,
                                                                                lastLogin: dateLogin,
                                                                                 clientIp: clientIp}});
        },

        'successLogout': function(logoutId, logoutDate) {
            usersProfile.update({username: logoutId}, {$set: {loginStatus: 0}});
        },

        /* ----------------------------------- MCO input and search ---------------------------------------------  */

        'mcoNew': function(newEcn, ecnEffectivity, machineRecording, materialScrap, mcoNotes, mcoTeam) {

             mcoReview.insert({mcoId: newEcn,
                                    effectiveDate: ecnEffectivity,
                                    machineRecording: machineRecording,
                                    materialStatus: materialScrap,
                                    statusMachine: 0,
                                    statusMco: 0,
                                    mcoNotes: mcoNotes,
                                    mcoTeam: mcoTeam
                                 });
        },

        'mcoSearch': function(newMcoSearch, mcoReCording, matStatus, mcoSearchString) {
           // console.log(newMcoSearch, mcoReCording, matStatus, mcoSearchString);
          //  const result = mcoReview.find({mcoTeam: newMcoSearch}).fetch();
        },

        /* -----------------------------------------------  Re work  ------------------------------------------------ */

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
         //   const collection = MachineReady.find({machineId: machineNr}, {fields: {
         //                                                                          'checkListIssues.errorDescription': 1,
          //                                                                          _id: 0}}).fetch();
        },

        'editRepair': function(editId) {
          return MachineReady.find({_id: editId},
                                   {fields: {newIssues: 1,
                                            checkListIssues: 1 }}).fetch();
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

            let machineConfiguration = [];
            let reConfiguration = [];
            let configStyle = {};
            let reConfigStyle = {};
            let checkType = [];

            MachineReady.update({_id: selectedPdiMachineId}, {$set: {pdiStatus: 2,
                                                                     startPdiDate: dateStart,
                                                                     pdiPerformer: pdiUser}});

            // Check points
            let typeOfMachine = machineType.toString();

            if(typeOfMachine === 'C77') {
                 checkType = checkPoints.find({machineRangeEndC77: {$gt: pdiMachineNr}, status: 1},
                                                 {fields: {errorDescription: 1, errorPos: 1}}).fetch();
            } else if (typeOfMachine === 'C78') {
                 checkType = checkPoints.find({machineRangeEndC78: {$gt: pdiMachineNr}, status: 1},
                                                 {fields: {errorDescription: 1, errorPos: 1}}).fetch();
            } else if (typeOfMachine === 'C79') {
                 checkType = checkPoints.find({machineRangeEndC79: {$gt: pdiMachineNr}, status: 1},
                                                 {fields: {errorDescription: 1, errorPos: 1}}).fetch();
            } else if (typeOfMachine === 'C87') {
                 checkType = checkPoints.find({machineRangeEndC79: {$gt: pdiMachineNr}, status: 1},
                                                 {fields: {errorDescription: 1, errorPos: 1}}).fetch();
            } else if (typeOfMachine === 'C88') {
                 checkType = checkPoints.find({machineRangeEndC79: {$gt: pdiMachineNr}, status: 1},
                                                 {fields: {errorDescription: 1, errorPos: 1}}).fetch();
            } else if (typeOfMachine === 'C89') {
                 checkType = checkPoints.find({machineRangeEndC79: {$gt: pdiMachineNr}, status: 1},
                                                 {fields: {errorDescription: 1, errorPos: 1}}).fetch();
            } else {
               // console.log('nicht definierter Maschinen Typ (server.js zeile 625)', typeOfMachine);
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
            let variantResult = variants.find({type: type},  {fields: {status: 1,
                                                                        variant: 1,
                                                                        variantDescription: 1,
                                                                        imagePath: 1}},
                                                                        {sort: {variant: 1}}).fetch();

            // Load Machine Configuration and select config items only status 1

            let combineVariant = MachineReady.find({_id: selectedPdiMachineId},
                                                    {fields: {config: 1, reConfigArray: 1}},
                                                    {sort: {variant: 1}}).fetch();
            // Origin Configuration
            combineVariant[0].config.forEach((element) => {
                variantResult.forEach((element2) => {
                    if (element === element2.variant && element2.status === 1) {
                        let uniqueId= Random.id();
                      configStyle = {
                          _id: uniqueId,
                          config: element2.variant,
                          configItem: element2.variantDescription,
                          imagePath: element2.imagePath,
                          machineConfigStatus: 0
                      }
                        machineConfiguration.push(configStyle);
                    }
                })
            })
            // Load re.configuration. Add variant is green (status 2) remove variant is red (status 1)
            let machineConfigStatus = 0;
            try {
                 combineVariant[0].reConfigArray.forEach((element) => {
                    if (element.identifier === '+') {
                        machineConfigStatus = 1;
                    } else if (element.identifier === '-') {
                        machineConfigStatus = 2;
                    }
                    variantResult.forEach((element2) => {
                        if (element.config === element2.variant && element2.status === 1) {
                            let uniqueId= Random.id();
                            reConfigStyle = {
                                _id: uniqueId,
                                identifier: element.identifier,
                                config: element2.variant,
                                configItem: element2.variantDescription,
                                imagePath: element2.imagePath,
                                machineConfigStatus: machineConfigStatus
                            }
                            reConfiguration.push(reConfigStyle);
                        }
                    })
                })
            } catch (error) {}

            MachineReady.update({_id: selectedPdiMachineId}, {$set: {
                                                machineConfig: machineConfiguration,
                                                reConfigArray: reConfiguration
                                                     }});


            // SI added to repair list

                let testResult = siTable.find({active: 1}).fetch();
                for(let i = 0; i < testResult.length; i++) {
                    let idSi = testResult[i].siNumber;
                    let siIssue = '-SI- ' + idSi;
                    let siMachine = (siMd.find({_id: idSi}).fetch()).shift();
                    let newArray = siMachine.machineList;
                    let result = newArray.find(k => k.machine === pdiMachineNr);
                    if(result) {
                        let selectedMachineId = result._id;
                        let setStatus = 2;
                        siMd.update({_id: siMachine._id, "machineList._id": selectedMachineId},
                            {$set: {"machineList.$.siStatus": setStatus}});
                        let uniqueIdSi = Random.id();
                        MachineReady.update({_id: selectedPdiMachineId}, {
                            $push: {
                                newIssues: {
                                    _id: uniqueIdSi,
                                    "checkStatus": true,
                                    "errorDescription" : siIssue,
                                    "pictureLocation" : "noPicture.JPG",
                                    "pictureUpload" : "No Image",
                                    "repairStatus" : (0),
                                    "repairTech" : "",
                                    "repairComment" : "",
                                    "repairDateTime" : "",
                                    "repairDuration" : "",
                                    "responsible" : ""
                             }}
                        });
                    }
                }

            // add Single Machines Item

            let siListResult = siList.find({machineNr: pdiMachineNr}).fetch();
            for(let i=0; i< siListResult.length; i++) {
                let singleResult = siListResult[i];
                let siIssue = '-SI- ' + singleResult.errorDescription;
                let uniqueIdSi = Random.id();
                MachineReady.update({_id: selectedPdiMachineId}, {
                    $push: {
                        newIssues: {
                            "_id": uniqueIdSi,
                            "checkStatus": true,
                            "errorDescription" : siIssue,
                            "pictureLocation" : "noPicture.JPG",
                            "pictureUpload" : "No Image",
                            "repairStatus" : (0),
                            "repairTech" : "",
                            "repairComment" : "",
                            "repairDateTime" : "",
                            "repairDuration" : "",
                            "responsible" : ""
                        }}
                });
            }

            // add additional pdi items to repair
            try {
                let pdiItemList = specialItems.findOne({_id: "addToPdi"},
                                                       {fields: {pdiItems: 1}}).pdiItems;
                pdiItemList.forEach((element) => {
                    let pdiDescription = "- Added Items -" + element.pdiItem
                    let uniqueIdSi = Random.id();
                    MachineReady.update({_id: selectedPdiMachineId}, {
                        $push: {
                            newIssues: {
                                "_id": uniqueIdSi,
                                "checkStatus": true,
                                "errorDescription" : pdiDescription,
                                "pictureLocation" : "noPicture.JPG",
                                "pictureUpload" : "No Image",
                                "repairStatus" : (0),
                                "repairTech" : "",
                                "repairComment" : "",
                                "repairDateTime" : "",
                                "repairDuration" : "",
                                "responsible" : ""
                            }
                        }
                    })
                })
            } catch(e) {}
        },

        'coAuditor': function(machineId, user) {
          MachineReady.update({machineId: machineId}, {$set: {coAuditor: user}});
        },


        'fuelAfterPdi': function(selectedPdiMachine, selectedPdiMachineNr, fuelAfter) {
            let date = Date.now();
            MachineReady.update({_id: selectedPdiMachine}, {$set: {fuelAfter: fuelAfter,
                    pdiStatus: 1,
                     unixPdiDate: date}});
            specialItems.update({}, {$inc: {pdiFinished: 1, pdiLeft: -1}})
            let result = siList.find({machineNr: selectedPdiMachineNr}).fetch();
            if(result) {
                for(let i=0; i<result.length; i++) {
                    let removeSi = result[i];
                    let removeId = removeSi._id;
                    siList.remove({_id: removeId});
                }
            }
        },

        'setGoal': function(goal) {
            let setGoal = parseInt(goal);
            specialItems.update({}, {$set: {pdiWeekGoal: setGoal,
                                                                                    pdiFinished: 0,
                                                                                     pdiLeft: setGoal}})
        },

        //---------------------------------------------  other PDI operations ------------------------------------------------------
        // Meteor call from pdi_si.js addingToPdi.events 'submit .add-item-to-pdi'
        'pdiItem': (pdiItem) => {
            let uniqueId = Random.id();
                specialItems.upsert({_id: 'addToPdi'}, {$push: {pdiItems: {_id: uniqueId,
                                                                                        pdiItem: pdiItem}
                                                                                   }});
        },

        'removePdiItem': (pdiId) => {
            specialItems.update({_id: "addToPdi"}, {$pull: {"pdiItems": {_id:  pdiId}}});
        },


        'stopPdi': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {pdiStatus: 0}});
        },

        'stopRepair': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {repairStatus: 0}});
        },

        'skipPdi': function(pdiMachineId, user) {
            MachineReady.update({_id: pdiMachineId}, {$set: {pdiStatus: 1,
                                                                            checkList: [],
                                                                            machineConfig: [],
                                                                            pdiPerformer: user,
                                                                            startPdiDate: '',
                                                                            fuelStart: '',
                                                                            newIssues: [],
                                                                            batteries: "",
                                                                            omms: ""
                                                                        }});
        },

        'cancelPdi': function(pdiMachineId) {
            MachineReady.update({_id: pdiMachineId}, {$set: {pdiStatus: 0,
                                                                             checkList: [],
                                                                             machineConfig: [],
                                                                             pdiPerformer: '',
                                                                             startPdiDate: '',
                                                                             fuelStart: '',
                                                                             newIssues: [],
                                                                             batteries: "",
                                                                             omms: ""
                                                                     }});

        },

        //----------------------------------------  Check points -------------------------------------

        //pdi Config Buttons

        'configOkButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "machineConfig._id": idFailure},
                                  {$set: {"machineConfig.$.machineConfigStatus": 1}});
        },

        'configNokButton': (machineId, idFailure, idIdentifier) => {
            MachineReady.update({_id: machineId, "machineConfig._id": idIdentifier},
                {$set: {"machineConfig.$.machineConfigStatus": 2}});
            let uniqueId = Random.id();
            let addNewFailure = 'Check config ' + idFailure;
            MachineReady.upsert({_id: machineId}, {$push: {newIssues: {_id: uniqueId,
                                                                                            checkStatus: true,
                                                                                            errorDescription: addNewFailure,
                                                                                            pictureLocation : "noPicture.JPG",
                                                                                            pictureUploaded : "No Image",
                                                                                            repairStatus : (0),
                                                                                            repairTech : "",
                                                                                            repairComment : "",
                                                                                            repairDateTime : "",
                                                                                            repairDuration : "",
                                                                                            responsible : ""
                                                                                                            }}});
        },

        // pdi Checklist buttons

        'okButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure},
                {$set: {"checkList.$.checkStatus": 1, "checkList.$.failStatus": false}})
        },

        'nokButton': (machineId, idFailure, errorDescription) => {
           // console.log()
            MachineReady.update({_id: machineId, "checkList._id": idFailure},
                {$set: {"checkList.$.checkStatus": 2, "checkList.$.failStatus": true}});
            let uniqueId = Random.id();
            let addNewFailure = 'From Checklist - ' + errorDescription;
            MachineReady.upsert({_id: machineId}, {$push: {newIssues: {_id: uniqueId,
                                                                                        checkStatus: true,
                                                                                        errorDescription: addNewFailure,
                                                                                        pictureLocation : "noPicture.JPG",
                                                                                        pictureUploaded : "No Image",
                                                                                        repairStatus : (0),
                                                                                        repairTech : "",
                                                                                        repairComment : "",
                                                                                        repairDateTime : "",
                                                                                        repairDuration : "",
                                                                                        responsible : ""
                                                                                                         }}});
        },

        'naButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure},
                {$set: {"checkList.$.checkStatus": 3}})
        },

        // Add additional Failure to checklist

        'addNewFailure': (selectedPdiMachineId, addNewFailure) => {
          //  console.log(selectedPdiMachineId, addNewFailure)
            let uniqueId = Random.id();
            MachineReady.upsert({_id: selectedPdiMachineId},
                                        {$push: {newIssues: {_id: uniqueId,
                                                                       checkStatus: true,
                                                                       errorDescription: addNewFailure,
                                                                       pictureLocation: 'noPicture.JPG',
                                                                       pictureUploaded: 'No Image',
                                                                       repairStatus: (0),
                                                                       repairTech: "",
                                                                       repairComment: "",
                                                                       repairDateTime: "",
                                                                       repairDuration: "",
                                                                       responsible: ""
                                                                 }}});
        },

        'removeFailure': (selectedPdiMachineId, openFailure) => {
          MachineReady.update({_id: selectedPdiMachineId}, {$pull: {newIssues : {_id: openFailure}}});
        },

        'orderParts': function (machineNr, loggedInUser, failureAddDescription) {
            const orderStatus = 1;
            orderParts.insert({machineNr: machineNr, user: loggedInUser, description: failureAddDescription,
                orderStatus: orderStatus});
        },

        // Add / remove issue to finished PDI list

        'newPdiIssue': (machineId, newIssue) => {
            let uniqueId = Random.id();
            MachineReady.upsert({machineId: machineId}, {$push: {newIssues: {_id: uniqueId,
                                                                "checkStatus" : true,
                                                                "errorDescription" : newIssue,
                                                                "pictureLocation" : "noPicture.JPG",
                                                                "pictureUpload" : "No Image",
                                                                "repairStatus" : (0),
                                                                "repairTech" : "",
                                                                "repairComment" : "",
                                                                "repairDateTime" : "",
                                                                "repairDuration" : "",
                                                                "responsible" : ""
                                                              }}
            });
            addIssues.insert({machineId: machineId, newIssues: newIssue, addStatus: 1});
        },

        'removePdiIssue': (machineId, pdiIssue) => {
            MachineReady.update({machineId: machineId}, {$pull: {newIssues : {_id: pdiIssue}}});
        },

        'issueNoticed': (_id) => {
            addIssues.remove({_id: _id});
        },

        // --------------------------------------------------------------------------------------------------------------

        'pdiMachineBattery': function(selectedPdiMachineId, loggedInUser, battC13CCA, battC13Volt,
                                      mtuG001CCA, mtuG001Volt, mtuG005CCA, mtuG005Volt, mtuG004CCA, mtuG004Volt,
                                      manBatt_1CCA, manBatt_1Volt, manBatt_2CCA, manBatt_2Volt  ) {
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {batteries: {user: loggedInUser, battC13CCA, battC13Volt,
                                      mtuG001CCA, mtuG001Volt, mtuG005CCA, mtuG005Volt, mtuG004CCA, mtuG004Volt,
                                                       manBatt_1CCA, manBatt_1Volt, manBatt_2CCA, manBatt_2Volt, battStatus: 1}}});

        },

        'pdiMachineOmm': function(selectedPdiMachineId, loggedInUser, fuelMe, ommMain, ommSupp,
                                  ommUnload,ommProfiCam, ommCebis, ommTerra) {
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {omms: {user: loggedInUser, fuelStart: fuelMe,
                    ommMain, ommSupp, ommUnload, ommProfiCam, ommCebis,  ommTerra, ommStatus: 1}}});
        },

        'machineUser': function (machineId, userLoggedIn, arrayOrder) {
            orderParts.insert({_id: userLoggedIn, machineNr: machineId, user: userLoggedIn});
            setTimeout(function () {
            }, 1000);

            for (let i = 0; i < arrayOrder.length; i++) {
                let repOrder = {};
                repOrder._id = Random.id();
                repOrder.description = arrayOrder[i];
                orderParts.upsert({_id: userLoggedIn}, {$addToSet: {repOrder}});
            }
        },

   // -------------------------------------------------- Wash List -------------------------------------------
        'stopWashing': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 0}});
        },

        'finishWashing': function(selectedCheckPoint, dateStop, washDuration, waitWashTime) {
            MachineReady.update({_id:selectedCheckPoint},
                {$set: {washStatus: 1,
                        stopWashDate: dateStop,
                        washDuration: washDuration,
                        waitWashTime: waitWashTime}});
        },

        'updateWashList': function(selectedCheckPoint, dateStart) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 2, startWashDate: dateStart}});
        },

        'locationUpdate': function(selectedPdiMachine, locationId) {
            MachineReady.update({_id: selectedPdiMachine}, {$set: {locationId: locationId}});
        },

    // ---------------------------------------- To Do -------------------------------------------------

        'submitToDo': function(toDoText, dateNow, needDate, toDoUser) {
            toDoMessage.insert({toDoText: toDoText, dateNow: dateNow, needDate: needDate, toDoUser: toDoUser, toDoStatus: 0});
        },

        'setToDo': (inProcessItem, status) => {
            if(status === 0) {
            toDoMessage.update({_id: inProcessItem}, {$set: {toDoStatus: status}});
            } else if(status === 1) {
                toDoMessage.update({_id: inProcessItem}, {$set: {toDoStatus: status}});
            } else if(status === 2) {
                let dateNow = moment().format('L');
                toDoMessage.update({_id: inProcessItem}, {$set: {toDoStatus: status, clearDate: dateNow}});
            }
        },

    // ------------------------------------------- Repair ------------------------------------------------

        'reActivate': (machineNumber) => {
            MachineReady.update({machineId: machineNumber}, {$set: {repairStatus: 0}});
        },



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

        'confirmRepair': (repairId, repairUser, repairComment, time, machineId) => {
            let industrialMinutes = time * 1.66;
            MachineReady.update({_id: machineId, 'newIssues._id': repairId},
                                        {$set: {'newIssues.$.repairStatus': 1,
                                                         'newIssues.$.repairTech': repairUser,
                                                         'newIssues.$.repairComment': repairComment,
                                                         'newIssues.$.repairTime': time,
                                                         'newIssues.$.industrialTime': industrialMinutes
                                            }})
        },

        // ------------------------------------  Machine ------------------------------------

        'machineReadyToGo': (readyGo) => {
            for (let i = 0; i < readyGo.length; i++) {
                MachineReady.update({_id: readyGo[i]}, {$set: {readyToGo: 1}});
            }
        },

        // -------------------------------------  Head  -------------------------------------

        'addHeadToShipList': function(newHeadInput, newShippingDate, createUnixTime, createDate, createTime,
                newShippingDestination, newShippingTransporter, newShippingKit, newShippingComment ) {
            newHeadYear.insert({
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

        'editShipHead': function(selectedHead, newHead, newShippingDate, newShippingDestination, newShippingTransporter,
                                 newShippingKit, newShippingComment) {
            newHeadYear.update({_id:selectedHead},
                {$set: {newHeadId: newHead,
                        date: newShippingDate,
                        destination: newShippingDestination,
                        transporter: newShippingTransporter,
                        kit: newShippingKit,
                        shippingComment: newShippingComment}
                });
        },

        'headReadyToGo': (readyGo) => {
            for (let i = 0; i < readyGo.length; i++) {
                newHeadYear.update({_id: readyGo[i]}, {$set: {readyToGo: 1}});
            }
        },

        'headIsGone': function(selectedCheckPoint) {
            newHeadYear.update({_id:selectedCheckPoint}, {$set: {shipStatus: 1}});
        },

        'removeHeadFromShipList': function(selectedMachine) {
            newHeadYear.remove(selectedMachine);
        },

        'headTruckOrdered': function(machineId, truckStatus, confirmedShipDate) {
            newHeadYear.update({_id: machineId}, {$set: {truckStatus: truckStatus, confirmedShipDate: confirmedShipDate}});
        },

        'headTruckRemoved': function(machineId, truckStatus) {
            newHeadYear.update({_id: machineId}, {$set: {truckStatus: truckStatus, confirmedShipDate: ''}});
        },

        // -----------------------------------------------------------------------------------


        // shipping Machines

        'addToShipList': function(newMachineInput, newShippingDate, createUnixTime, createDate, createTime,
            newShippingDestination, newShippingTransporter, newShippingKit, newShippingTireTrack,
                          newShippingReturns, newShippingComment ) {
            try {
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
                machineReturn: newShippingReturns,
                shippingComment: newShippingComment
            });
            } catch(err) {
                console.log(err.message)
            }
               // console.log('kein eror ?')
        },



        'editShipInfo': function(selectedMachine, newMachine, newShippingDate, newShippingDestination, newShippingTransporter,
              newShippingTireTrack, newShippingKit, newShippingReturns, newShippingComment) {
            MachineReady.update({_id:selectedMachine},
                {$set: {machineId: newMachine,
                    date: newShippingDate,
                    destination: newShippingDestination,
                    transporter: newShippingTransporter,
                    tireTrack: newShippingTireTrack,
                    kit: newShippingKit,
                    machineReturn: newShippingReturns,
                    shippingComment: newShippingComment}
                });
        },

        'removeFromShipList': function(selectedMachine) {
            MachineReady.remove(selectedMachine);
        },

        saveFile: function(blob, name, encoding, failureId, selectedPdiMachineId) {
          //  console.log(name, encoding, failureId, selectedPdiMachineId)
            let path = '/files/repair-items/';
            encoding = encoding || 'binary';
            name = failureId + '.JPG';
            let fs = Npm.require('fs');
            fs.writeFile(path + name, blob, encoding, function(err) {
                if (err) {
                    throw (new Meteor.Error(500, 'Failed to save file.', err));
                } else {
                 console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
                }
            });
            MachineReady.update({_id: selectedPdiMachineId, 'newIssues._id': failureId},
                                            {$set: {'newIssues.$.pictureLocation': name,
                                                    'newIssues.$.pictureUploaded': 'Image Up'
                                                    }})
        },

        saveConfigFile: function(blob, name, path, encoding, selectedVariantId) {
            console.log(path, name, selectedVariantId)
            path = '/files/config-items/';
            encoding = encoding || 'binary';
            name = selectedVariantId + '.JPG';
            let fs = Npm.require('fs');
            fs.writeFile(path + name, blob, encoding, function(err) {
                if (err) {
                    throw (new Meteor.Error(500, 'Failed to save file.', err));
                } else {
                   // console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
                }
            });
            variants.update({_id: selectedVariantId},
                {$set: {imagePath: name}})
        },


    });
}
