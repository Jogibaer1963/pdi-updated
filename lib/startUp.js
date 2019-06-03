MachineReady = new Mongo.Collection('machineReadyToGo');
headerReady = new Mongo.Collection('headerReadyToGo');
machineReadyToGo_2016 = new Mongo.Collection('machineReadyToGo_2016');
machineReadyToGo_2017 = new Mongo.Collection('machineReadyToGo_2017');
machineReadyToGo_2018 = new Mongo.Collection('machineReadyToGo_2018');
FailuresList = new Mongo.Collection('failures');
checkPoints = new Mongo.Collection('checkpoints');
pdiCheckList = new Mongo.Collection('pdiCheckList');
headerTrailer = new Mongo.Collection('headerTrailer');
washBayText = new Mongo.Collection('washBayText');
repairOrderPrint = new Mongo.Collection('repairOrderPrint');
siList = new Mongo.Collection('siList');
reworkMachineList = new Mongo.Collection('reworkMachineList');
mcoReview = new Mongo.Collection('mcoReview');
siListDone = new Mongo.Collection('siListDone');
unsuccessLogin = new Mongo.Collection('unsuccessLogin');
successfullLogin = new Mongo.Collection('successfullLogin');
successfullLogout = new Mongo.Collection('successfullLogout');
siMd = new Mongo.Collection('siMd');
siTable = new Mongo.Collection('siTable');
orderParts = new Mongo.Collection('orderParts');
fuelAverage = new Mongo.Collection('fuelAverage');
usersProfil = new Mongo.Collection('usersProfil');
variants_C77 = new Mongo.Collection('variants_C77');
variants_C78 = new Mongo.Collection('variants_C78');
variants_C79 = new Mongo.Collection('variants_C79');
variants_C87 = new Mongo.Collection('variants_C87');
variants_C88 = new Mongo.Collection('variants_C88');
variants_C89 = new Mongo.Collection('variants_C89');
variants_C68 = new Mongo.Collection('variants_C68');
toDoMessage = new Mongo.Collection('toDoMessage');
addIssues = new Mongo.Collection('addIssues');
mainComponents = new Mongo.Collection("mainComponents");
oms = new Mongo.Collection('oms');
images = new Mongo.Collection("images");
newFiscalYear = new Mongo.Collection('MachineReadyToGo_2019');
newHeadYear = new Mongo.Collection('HeadReadyToGo');
dropDownHistoricMachines = new Mongo.Collection('dropDownHistoricMachines');
specialPdiItems = new Mongo.Collection('specialPdiItems');
//images = new Mongo.Collection('images');
preSeriesMachine = new Mongo.Collection('preSeriesMachine');


if (Meteor.isClient) {

    Meteor.startup( function() {

        Session.set('selectedPdiMachine', '');
        Session.set('pdiMachineNumber', '');
        Session.set('selectedErrorId', '');
        Session.set('selectedNewErrorId', '');
        Session.set('findMachine', '');
        Session.set('selectedProfiId', '');
        Session.set('selectedArea', '');
        Session.set('selectedMachine', '');
        Session.set('commMachine', '');
        Session.set('inActiveState', 0);
        Session.set('ipAndPort', 'http://192.168.0.103:3300/images/');
    });

}
