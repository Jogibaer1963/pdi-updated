MachineReady = new Mongo.Collection('machineReadyToGo');
headerReady = new Mongo.Collection('headerReadyToGo');FailuresList = new Mongo.Collection('failures');
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
toDoMesssage = new Mongo.Collection('toDoMessage');
commission = new Mongo.Collection('commission');
supplyAreaList = new Mongo.Collection('supplyAreaList');
machineCommTable = new Mongo.Collection('machineCommTable');

if (Meteor.isClient) {

    Meteor.startup( function() {

        Session.set('selectedPdiMachine', '');
        Session.set('pdiMachineNumber', '');
        Session.set('selectedErrorId', '');
        Session.set('selectedNewErrorId', '');
        Session.set('findMachine', '');
        Session.set('selectedProfiId', '');

    });

}
