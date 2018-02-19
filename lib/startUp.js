MachineReady = new Mongo.Collection('machineReadyToGo');
MachineReady_2016 = new Mongo.Collection('machineReadyToGo_2016');
FailuresList = new Mongo.Collection('failures');
checkPoints = new Mongo.Collection('checkpoints');
InspectedMachines = new Mongo.Collection('inspectedMachines');
pdiCheckList = new Mongo.Collection('pdiCheckList');
headerTrailer = new Mongo.Collection('headerTrailer');
washBayText = new Mongo.Collection('washBayText');
repairOrderPrint = new Mongo.Collection('repairOrderPrint');
siList = new Mongo.Collection('siList');
ommMain = new Mongo.Collection('ommMain');
ommSupp = new Mongo.Collection('ommSupp');
ommUnload = new Mongo.Collection('ommUnload');
ommCebisMo = new Mongo.Collection('ommCebisMo');
ommTeraTrack = new Mongo.Collection('ommTeraTrack');
ommProfiCam = new Mongo.Collection('ommProfiCam');
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


if (Meteor.isClient) {

    Meteor.startup( function() {

  //      Meteor.subscribe("failures");
        Meteor.subscribe("checkpoints");
   //     Meteor.subscribe("inspectedMachines");
        Meteor.subscribe("pdiCheckList");
        Meteor.subscribe("headerTrailer");
        Meteor.subscribe("washBayText");
        Meteor.subscribe("siList");
  //      Meteor.subscribe("ommMain");
  //      Meteor.subscribe("ommSupp");
  //      Meteor.subscribe("ommUnload");
  //      Meteor.subscribe("ommCebisMo");
  //      Meteor.subscribe("ommTeraTrack");
  //      Meteor.subscribe("ommProfiCam");
        Meteor.subscribe("reworkMachineList");
        Meteor.subscribe("siListDone");
  //      Meteor.subscribe("repairOrderPrint");
        Meteor.subscribe("siMd");
        Meteor.subscribe("siTable");
        Meteor.subscribe("orderParts");
        Meteor.subscribe("fuelAverage");
        Meteor.subscribe("MachineReady_2016");




        Session.set('selectedPdiMachine', '');
        Session.set('pdiMachineNumber', '');
        Session.set('selectedErrorId', '');
        Session.set('selectedNewErrorId', '');
        Session.set('findMachine', '');
        Session.set('selectedMainOm', '');
        Session.set('selectedSuppOm', '');
        Session.set('selectedUnloadOm', '');
        Session.set('selectedCemosOm', '');
        Session.set('selectedTeraTrackOm', '');
        Session.set('selectedProfiCam', '');
        Session.set('selectedProfiId', '');

    });

}
