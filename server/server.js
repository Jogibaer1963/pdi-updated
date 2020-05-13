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
    });




    Meteor.methods({


        'coaDate': (machineId, coaDate) => {
            MachineReady.upsert({machineId: machineId}, {$set: {coaDate: coaDate}});
          //  console.log(machineId);
            preSeriesMachine.upsert({preMachineId: machineId}, {$set: {coaDate: coaDate}});
    },

       'preSeriesOverView': () => {
           const resultArray = [];
           let resultStep1 = preSeriesMachine.find({}, {sort: {preMachineId: 1}}).fetch();
           if (resultStep1.length === 0) {
             //  console.log("leer");
           } else {
               let arrayLength = resultStep1.length;
               for (let i = 0; i <= (arrayLength - 1); i++) {
                   let _id = resultStep1[i]._id;
                   let newIssuesLength = resultStep1[i].newIssues.length;
                   let checkPointCount = resultStep1[i].checkItems.length;
                   let machineNumber = resultStep1[i].preMachineId;
                   let date = resultStep1[i].date;
                   let coaDate = resultStep1[i].coaDate;
                   let pdiStatusId = resultStep1[i].pdiStatus;
                   let checkItemIssue = 0;
                   for (let k = 1; k <= checkPointCount; k++) {
                       try {
                           if (resultStep1[i].checkItems[k].failureStatus === 2) {
                               checkItemIssue++;
                           }
                       } catch (e) {
                       }
                   }
                   let result = ({
                       _id: _id,
                       machineNumber: machineNumber,
                       date: date,
                       coaDate: coaDate,
                       pdiStatusId: pdiStatusId,
                       newIssueCount: newIssuesLength,
                       checkPointCount: checkPointCount,
                       checkItemIssue: checkItemIssue
                   });
                   resultArray.push(result);
               }
           }
           return resultArray;
       },

    'preSeriesAddCheck': (addNewFailure) => {
        preSeriesAddChecks.insert({errorDescription: addNewFailure});
    },

    //-----------------------------------------Called 1 time to generate the Checklist Data base --------------
    'generateDataBase': () => {
        for ( let i = 1; i <= 337; i++) {
            let uniqueId= Random.id();
            images.insert({
                _id: uniqueId,
                imagePath: "Slide"+ i + ".JPG",
                activeStatus: 1,
                failureStatus: 0,
                timeOfFix: "",
                checkedBy: "",
                cantRepair: 0,
                errorDescription: ""
            });
        }
    },

    //----------------------------------------------- Load checklist for preview or edit ------------------

    'preSeriesCheckUp': () => {
      const result = images.find().fetch();
      console.log(result);
    },

    //----------------------------------------------- Load Pre series Machine numbers  --------------------

    'enterPreMachine': (preMachine, shipDate) => {
        preSeriesMachine.insert({preMachineId: preMachine,
                                      date: shipDate,
                                      pdiStatus: 0,
                                      configStatus: 0,
                                      user: '',
                                      dateStart: '',
                                      checkItems: [],
                                      machineConfig: [],
                                      newIssues: [],
                                      counter: []});

    },

    'readPreConfig': function(machineId, configArray) {
        preSeriesMachine.update({preMachineId: machineId},
            {$set: {config: configArray, configStatus: 1}});
    },

    //------------------------------------------  Prepare checklist for specific Machine --------------

    'prepareCheckList': (user, selectedPreMachine, dateStart) => {

        let type = '';
        let variantPreMachine = [];
        let variantPreMD = [];
        let variantPreItem = [];
        let variantPrePath = [];
        let machinePreConfiguration = [];
        let preConfigStyle = [];

        if(selectedPreMachine) {
              let result = preSeriesMachine.findOne({_id: selectedPreMachine},
                                                   {fields: {preMachineId: 1}}).preMachineId;
                 type = result.slice(0,3);
                }

        // Load Type Variant

        let newVariant = 'variants_' + type;
        let variantsList = Mongo.Collection.get(newVariant).find({},
            {fields: {status: 1, variant: 1, variantDescription: 1, image: 1}},
            {sort: {variant: 1}}).fetch();

        variantsList.forEach((variantValue, k) => {
            if (variantValue.status === 1) {
                     variantPreMD[k] = variantValue.variant;
                     variantPreItem[k] = variantValue.variantDescription;
                     variantPrePath[k] = variantValue.imagePath;
            }
        });

        // Load Machine Configuration and select config items

        let combineVariant = preSeriesMachine.find({_id: selectedPreMachine},
                                                        {fields: {config: 1}},
                                                        {sort: {variant: 1}}).fetch();
        let k = (combineVariant[0]).config;

        k.forEach((variantMarker, i) => {
            let uniqueId= Random.id();
                variantPreMachine[i] = variantMarker;
            let match = variantPreMD.indexOf(variantPreMachine[i]);
            if (match >= 1) {
                preConfigStyle[match] = {
                            _id: uniqueId,
                            'config': variantPreMD[match],
                            'configItem': variantPreItem[match],
                            'imagePath': variantPrePath[match],
                            machinePreConfigStatus: 0
                };
                machinePreConfiguration.push(preConfigStyle[match]);
            }
        });

        let checkList = images.find ({activeStatus: {$gt: 0} }).fetch();
        let result = checkList.length;
        console.log(result);
        // Add all lists to the database after checklist is loaded

        if (checkList) {
            preSeriesMachine.upsert({_id: selectedPreMachine},
                                    {$set: {imageCount: result,
                                                    machineConfig: machinePreConfiguration,
                                                    checkItems: checkList,
                                                    dateStart: dateStart,
                                                    user: user,
                                                    pdiStatus: 2,
                                                    newIssues: [],

                                                    counter: []
                                                                }});
        }
    },


              // Cancel Pre Check

    'cancelPreCheck': (preMachine) => {
        preSeriesMachine.update({_id: preMachine}, {$set: {checkItems: [],
                                                                            machineConfig: [],
                                                                            counter: [],
                                                                            progressBar: 0,
                                                                            user: '',
                                                                            pdiStatus: 0,
                                                                            newIssues: []}})
    },


        //  Config result

    'configPreResult': (id, target, result) => {
            preSeriesMachine.update({_id: id, 'machineConfig._id': target},
                {$set: {'machineConfig.$.machinePreConfigStatus': result}});
    },


                //  Check point nok or Ok
                //  target = image ID

    'preCheckNok': (selectedPreMachineId, targetId, result, user) => {
        preSeriesMachine.update({_id: selectedPreMachineId, 'checkItems._id': targetId},
                               {$set: {'checkItems.$.failureStatus': result,
                                                'checkItems.$.checkedBy': user}});
        let checkResult = {
                            id: targetId,
                            result: result
                          };
        let checkCounter = preSeriesMachine.findOne({_id: selectedPreMachineId},
                                                    {fields: {counter: 1, _id: 0}}).counter;

        if(checkCounter) {

            const foundCheck = checkCounter.find( checkId => checkId.id === targetId);

            if (!foundCheck) {
                preSeriesMachine.update({_id: selectedPreMachineId},
                                        {$push: {counter: checkResult}});
                let counter = preSeriesMachine.findOne({_id: selectedPreMachineId},
                                                       {fields: {counter: 1,
                                                               imageCount:1,
                                                               _id: 0}});
                let checkPoints = counter.imageCount;
                let counterFound = counter.counter;
                let progress =  ((100 / (checkPoints)) * counterFound.length).toFixed(2);
                preSeriesMachine.update({_id: selectedPreMachineId},
                    {$set: {progressBar: progress}})
            } else {
                preSeriesMachine.update({_id: selectedPreMachineId, 'counter.id': targetId},
                                        {$set: {'counter.$.result': result}});
            }
        }
    },

    //---------------------------------------- evaluate ok, nok, add message to pic -----------------

    'addMessageToPic': (selectedPreMachineId, target, message) => {
        preSeriesMachine.update({_id: selectedPreMachineId, 'checkItems._id': target},
            {$set: {'checkItems.$.errorDescription': message}})

    },

    'addNewPreFailure': (id, addNewFailure) => {
        let uniqueId = Random.id();
        preSeriesMachine.upsert({_id: id},
            {$push: {newIssues: {_id: uniqueId, checkStatus: true, errorDescription: addNewFailure}}});
    },

    'removePreFailure': (id, openFailure) => {
        preSeriesMachine.update({_id: id}, {$pull: {newIssues : {_id: openFailure}}});
    },

    'preSeriesFinished': (id) => {
        preSeriesMachine.update({_id: id}, {$set: {pdiStatus: 1}});
    },

    //-------------------------------------- Specify Team for each failure --------------

     'teamSpecifier': (machineId, team, idCheck) => {
         MachineReady.update({_id: machineId, 'newIssues._id': idCheck},
             {$set: {'newIssues.$.responsible': team
                      }})
     },

  //-------------------------------------------------- Historic PDI's ------------------------------------

        'historicPdi': (selected) => {
          return dropDownHistoricMachines.findOne({_id: selected}).id;
        },

 //----------------------------------------------------- Components -----------------------------------------------------------------------
/*
        'moveMachines': (newMoveMe) => {
            newMoveMe.forEach((result) => {
                const machineToMove = MachineReady.findOne({_id: result});
                newFiscalYear.insert(machineToMove);
                MachineReady.remove({_id: result});
            })

        },

 */

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
            let k = 0;
            let contentString = JSON.stringify(contents);
            let dateVariant = contentString.substr(1, 10);
            let typeVariant = contentString.substr(53, 3);
           // console.log(contentString);
           // console.log(typeVariant);
                   if (typeVariant === 'C77') {
                variants_C77.remove({});
            } else if (typeVariant === 'C78') {
                variants_C78.remove({});
            } else if (typeVariant === 'C79') {
                variants_C79.remove({});
            } else if (typeVariant === 'C87') {
                variants_C87.remove({});
            } else if (typeVariant === 'C88') {
                variants_C88.remove({});
            } else if (typeVariant === 'C89') {
                variants_C89.remove({});
            } else {
                       console.log('Type ', typeVariant, ' not found');
                   }
            let re = /MD_[A-Z][0-9][0-9]/g;
            let variant = re[Symbol.match](contents);
            let uniqueArray = Array.from(new Set(variant));
            let arrayCount = uniqueArray.length;
            let pattern = "\\t\\t\\t\\t";
            for (let i = 0; i < arrayCount; i++) {
                let variantCatch_1a = uniqueArray[i];
                let variantCatch_1b = variantCatch_1a + pattern;
                let variantCatch_2a = uniqueArray[i + 1];
                let variantCatch_2b = variantCatch_2a + pattern;
                let variantPos_1 = contentString.indexOf(variantCatch_1b);
                let variantPos_2 = contentString.indexOf(variantCatch_2b);
                let newVariant = contentString.slice(variantPos_1, variantPos_2);
                let newVariant_1 = newVariant.replace(/\\t/g, " ");
                let textPosition = newVariant_1.indexOf("\\r\\n");
                let newVariantText = newVariant_1.slice(textPosition + 4);
                let newUniqueVariant = newVariantText.split("\\r\\n");
                    newUniqueVariant.pop();
                let count = newUniqueVariant.length;
                for (k=0; k < count; k++) {
                    let arrayElement = newUniqueVariant.shift();
                    let stringArrayElement = JSON.stringify(arrayElement);
                    let firstElement = stringArrayElement.slice(1, 8);
                    let variantMatch = uniqueArray[i] + '_' + firstElement;
                    let variantModule = variantMatch.replace(/\s/g, '');
                    let variantDescription = stringArrayElement.slice(15);
                    if (typeVariant === 'C77') {
                        variants_C77.remove();
                        variants_C77.insert({variant: variantModule,
                            variantDescription: variantDescription,
                            imagePath: "http://",
                            status: 1,
                            dateLoaded: dateVariant,
                            type: typeVariant});
                        } else if (typeVariant === 'C78') {
                            variants_C78.remove();
                            variants_C78.insert({variant: variantModule,
                            variantDescription: variantDescription,
                            imagePath: "http://",
                            status: 1,
                            dateLoaded: dateVariant,
                            type: typeVariant});
                        } else if (typeVariant === 'C79') {
                        variants_C79.remove();
                        variants_C79.insert({variant: variantModule,
                            variantDescription: variantDescription,
                            imagePath: "http://",
                            status: 1,
                            dateLoaded: dateVariant,
                            type: typeVariant});
                        } else if (typeVariant === 'C87') {
                        variants_C87.remove();
                        variants_C87.insert({variant: variantModule,
                            variantDescription: variantDescription,
                            imagePath: "http://",
                            status: 1,
                            dateLoaded: dateVariant,
                            type: typeVariant});
                        } else if (typeVariant === 'C88') {
                        variants_C88.remove();
                        variants_C88.insert({variant: variantModule,
                            variantDescription: variantDescription,
                            imagePath: "http://",
                            status: 1,
                            dateLoaded: dateVariant,
                            type: typeVariant});
                        } else if (typeVariant === 'C89') {
                        variants_C89.remove();
                        variants_C89.insert({variant: variantModule,
                            variantDescription: variantDescription,
                            imagePath: "http://",
                            status: 1,
                            dateLoaded: dateVariant,
                            type: typeVariant});
                        } else {
                        console.log('Type ', typeVariant, ' not available');
                    }
                }
            }
        },

        'readVariantPic': function (contents) {

        },

        'readConfig': function(machineId, configArray) {
            MachineReady.update({machineId: machineId},
                {$set: {config: configArray, configStatus: 1}});
        },


        'toggleVariant': function(variantType, id, toggle) {
            let variantToChange = '';
            if (variantType === 1) {
              variantToChange = 'variants_' + 'C77';
            } else if (variantType === 2) {
              variantToChange = 'variants_' + 'C78';
            } else if (variantType === 3) {
              variantToChange = 'variants_' + 'C79';
            } else if (variantType === 4) {
              variantToChange = 'variants_' + 'C87';
            } else if (variantType === 5) {
              variantToChange = 'variants_' + 'C88';
            } else if (variantType === 6) {
              variantToChange = 'variants_' + 'C89';
            }
            Mongo.Collection.get(variantToChange).update({_id: id}, {$set: {status: toggle}});
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
        'machineRep': function(machineRepaired, workingHour) {
          MachineReady.update({_id: machineRepaired}, {$set: {machineHours: workingHour, repairStatus: 1}});
        },

        'changeStatus': function (siNumber, selectedMachineId, setStatus) {
          siMd.update({_id: siNumber, "machineList._id": selectedMachineId},
                                     {$set: {"machineList.$.siStatus": setStatus}});
        },

        'unsuccessLogin': function (userVar, passwordVar, dateLogin) {
           let clientIp = this.connection.clientAddress;
            unsuccessLogin.insert({userId: userVar, password: passwordVar, dateLogin: dateLogin, clientIp: clientIp});
        },

        'successfullLogin': function (userVar, dateLogin) {
          let clientIp = this.connection.clientAddress;
             successfullLogin.insert({userId: userVar, dateLogin: dateLogin, clientIp: clientIp});
             usersProfile.update({username: userVar}, {$set: {loginStatus: 1,
                                                                                lastLogin: dateLogin,
                                                                                 clientIp: clientIp}});
        },

        'successfullLogout': function(logoutId, logoutDate) {
            successfullLogout.insert({logoutId: logoutId, dateLogout: logoutDate});
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

            let variantMachine = [];

            let  variantMD = [];
            let  variantItem = [];
            let  variantPath = [];
            let  machineConfiguration = [];
            let  configStyle = [];
            let  checkType = [];



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
                console.log('nicht definierter Maschinen Typ (server.js zeile 625)', typeOfMachine);
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
            let variantsList = Mongo.Collection.get(newVariant).find({},
                                    {fields: {status: 1, variant: 1, variantDescription: 1, image: 1}},
                                    {sort: {variant: 1}}).fetch();
            variantsList.forEach((variantValue, k) => {
                if (variantValue.status === 1) {
                  variantMD[k] = variantValue.variant;
                  variantItem[k] = variantValue.variantDescription;
                  variantPath[k] = variantValue.imagePath;
                }
            });

            // Load Machine Configuration and select config items

            let combineVariant = MachineReady.find({_id: selectedPdiMachineId},
                                                    {fields: {config: 1}},
                                                    {sort: {variant: 1}}).fetch();
            let k = (combineVariant[0]).config;
                k.forEach((variantMarker, i) => {
                let uniqueId= Random.id();
                   variantMachine[i] = variantMarker;
                   let match = variantMD.indexOf(variantMachine[i]);
                   if (match >= 1) {
                       configStyle[match] = {
                           _id: uniqueId,
                           'config': variantMD[match],
                           'configItem': variantItem[match],
                           'imagePath': variantPath[match],
                           machineConfigStatus: 0
                       };
                       machineConfiguration.push(configStyle[match]);
                   }
            });
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {machineConfig: machineConfiguration}});

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
                                    checkStatus: true,
                                    errorDescription: siIssue
                             }}
                        });
                    }
                }

            // add special pdi items
/*
            const specialItems = specialPdiItems.find().fetch();
                MachineReady.update({_id: selectedPdiMachineId},
                    {$set: {specialPdiItems: specialItems}});

 */

            // add Single Machines Item

            let siListResult = siList.find({machineNr: pdiMachineNr}).fetch();
            for(let i=0; i< siListResult.length; i++) {
                let singleResult = siListResult[i];
                let siIssue = '-SI- ' + singleResult.errorDescription;
                let uniqueIdSi = Random.id();
                MachineReady.update({_id: selectedPdiMachineId}, {
                    $push: {
                        newIssues: {
                            _id: uniqueIdSi,
                            checkStatus: true,
                            errorDescription: siIssue
                        }}
                });
            }
        },

        'coAuditor': function(machineId, user) {
          MachineReady.update({machineId: machineId}, {$set: {coAuditor: user}});
        },


        'fuelAfterPdi': function(selectedPdiMachine, selectedPdiMachineNr, fuelAfter) {
            MachineReady.update({_id: selectedPdiMachine}, {$set: {fuelAfter: fuelAfter, pdiStatus: 1}});
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

        'stopPdi': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {pdiStatus: 0}});
        },

        'stopRepair': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {repairStatus: 0}});
        },

        'skipPdi': function(pdiMachineId) {
            MachineReady.update({_id: pdiMachineId}, {$set: {pdiStatus: 1}});
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
            MachineReady.upsert({_id: machineId}, {$push: {newIssues: {_id: uniqueId, checkStatus: 2, errorDescription: addNewFailure}}});
        },

        // pdi Checklist buttons

        'okButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure},
                {$set: {"checkList.$.checkStatus": 1, "checkList.$.failStatus": false}})
        },

        'nokButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure},
                {$set: {"checkList.$.checkStatus": 2, "checkList.$.failStatus": true}})
        },

        'naButton': (machineId, idFailure) => {
            MachineReady.update({_id: machineId, "checkList._id": idFailure},
                {$set: {"checkList.$.checkStatus": 3}})
        },

        // Add additional Failure to checklist

        'addNewFailure': (selectedPdiMachineId, addNewFailure) => {
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
                                                                checkStatus: true,
                                                                errorDescription: newIssue,
                                                                pictureLocation: "",
                                                                pictureUploaded: 'No Image',
                                                                repairStatus: (0),
                                                                repairTech: "",
                                                                repairComment: "",
                                                                repairDateTime: "",
                                                                repairDuration: ""}}
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
                                  ommUnload,ommProfiCam, ommCebis, ommCebisTouch, ommTerra, ommDuals) {
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {omms: {user: loggedInUser, fuelStart: fuelMe,
                    ommMain, ommSupp, ommUnload,ommProfiCam, ommCebis, ommCebisTouch, ommTerra, ommDuals, ommStatus: 1}}});
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

        'confirmRepair': (repairId, repairUser, repairComment, machineId) => {
            MachineReady.update({_id: machineId, 'newIssues._id': repairId},
                                        {$set: {'newIssues.$.repairStatus': 1,
                                                         'newIssues.$.repairTech': repairUser,
                                                         'newIssues.$.repairComment': repairComment  }})
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

        saveFile: function(blob, name, path, encoding, failureId, selectedPdiMachineId) {
            path = '/files/repair-items/';
            encoding = encoding || 'binary';
            name = failureId + '.JPG';
            let fs = Npm.require('fs');
            fs.writeFile(path + name, blob, encoding, function(err) {
                if (err) {
                    throw (new Meteor.Error(500, 'Failed to save file.', err));
                } else {
                  // console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
                }
            });
            console.log(name);
            MachineReady.update({_id: selectedPdiMachineId, 'newIssues._id': failureId},
                {$set: {'newIssues.$.pictureLocation': name,
                        'newIssues.$.pictureUploaded': 'Image Up'
                        }})
        },
/*
        saveVariant: function(blob, name, path, encoding, failureId, selectedPdiMachineId) {
            path = '/files/repair-items/';
            encoding = encoding || 'binary';
            name = failureId + '.JPG';
            let fs = Npm.require('fs');
            fs.writeFile(path + name, blob, encoding, function(err) {
                if (err) {
                    throw (new Meteor.Error(500, 'Failed to save file.', err));
                } else {
                    // console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
                }
            });
            console.log(name);
            MachineReady.update({_id: selectedPdiMachineId, 'newIssues._id': failureId},
                {$set: {'newIssues.$.pictureLocation': name,
                        'newIssues.$.pictureUploaded': 'Image Up'
                    }})
        },

 */


    });




 }





