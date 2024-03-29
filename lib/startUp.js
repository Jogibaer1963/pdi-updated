MachineReady = new Mongo.Collection('machineReadyToGo');
FailuresList = new Mongo.Collection('failures');
checkPoints = new Mongo.Collection('checkpoints');
pdiCheckList = new Mongo.Collection('pdiCheckList');
// headerTrailer = new Mongo.Collection('headerTrailer');
washBayText = new Mongo.Collection('washBayText');
siList = new Mongo.Collection('siList');
reworkMachineList = new Mongo.Collection('reworkMachineList');
mcoReview = new Mongo.Collection('mcoReview');
siListDone = new Mongo.Collection('siListDone');
siMd = new Mongo.Collection('siMd');
siTable = new Mongo.Collection('siTable');
orderParts = new Mongo.Collection('orderParts');
// fuelAverage = new Mongo.Collection('fuelAverage');
usersProfile = new Mongo.Collection('usersProfile');
variants = new Mongo.Collection('variants');
toDoMessage = new Mongo.Collection('toDoMessage');
addIssues = new Mongo.Collection('addIssues');
mainComponents = new Mongo.Collection("mainComponents");
oms = new Mongo.Collection('oms');
images = new Mongo.Collection("images");
// machineReadyToGo_2019 = new Mongo.Collection('MachineReadyToGo_2019');
newHeadYear = new Mongo.Collection('HeadReadyToGo');  //  Header Database
dropDownHistoricMachines = new Mongo.Collection('dropDownHistoricMachines');
specialItems = new Mongo.Collection('specialPdiItems');
preSeriesMachine = new Mongo.Collection('preSeriesMachine');
preSeriesAddChecks = new Mongo.Collection("preSeriesAddChecks");
SuppliersList = new Mongo.Collection('suppliersList');
TeamList = new Mongo.Collection('teamList')
machineCommTable = new Mongo.Collection('machineCommTable');
historicMachines = new Mongo.Collection('historicMachines');
lineOrders = new Mongo.Collection('50_line_orders')



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
/*
        Session.set('ipAndPort', 'http://192.168.0.120:3300/images/');
        Session.set('configInfos', 'http://192.168.0.120:3300/config-items/');
        Session.set('repairInfos', 'http://192.168.0.120:3300/repair-items/');
        Session.set('messagePort', 'http://localhost:3000/')

*/




       Session.set('messagePort', 'http://10.40.1.47:3000/')
       Session.set('ipAndPort', 'http://10.40.1.47:3200/images/');
       Session.set('configInfos', 'http://10.40.1.47:3200/config-items/');
       Session.set('repairInfos', 'http://10.40.1.47:3200/repair-items/');




    });

}
