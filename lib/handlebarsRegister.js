if (Meteor.isClient) {



    Handlebars.registerHelper('getSiStatusColor', function (siStatus) {
        switch (siStatus) {
            case 1 : {
                return '#138b0e';
            }
            case 0 : {
                return 'orangered';
            }
            case 2 : {
                return 'inProcess';
            }
            case 3 : {
                return '#ff58fa';
            }
            case 4 : {
                return '#1f70ff';
            }
        }
    });

    Handlebars.registerHelper('getOrderStatusColor', function (orderStatus) {
        switch (orderStatus) {
            case 1 : {
                return '#0f038b';
            }
            case 0 : {
                return 'white';
            }
        }
    });

    Handlebars.registerHelper('getStatusColor', function (pdiStatus) {
        switch (pdiStatus) {
            case 1 : {
                return '#138b0e';
            }
            case 0 : {
                return 'orangered';
            }
            case 2 : {
                return 'inProcess';
            }
        }
    });

    Handlebars.registerHelper('getStatusColor', function (repairStatus) {
        switch (repairStatus) {
            case 1 : {
                return '#138b0e';
            }
            case 0 : {
                return 'orangered';
            }
            case 2 : {
                return 'inProcess';
            }
        }
    });

    Handlebars.registerHelper('getStatusColor', function (washStatus) {
        switch (washStatus) {
            case 1 : {
                return '#138b0e';
            }
            case 0 : {
                return 'orangered';
            }
            case 2 : {
                return 'inProcess';
            }
        }
    });

    Handlebars.registerHelper('getStatusColor', function (shipStatus) {
        switch (shipStatus) {
            case 1 : {
                return '#138b0e';
            }
            case 0 : {
                return 'orangered';
            }
            case 2 : {
                return 'inProcess';
            }
        }
    });

    Handlebars.registerHelper('getStatusTruck', function (truckStatus) {
        switch (truckStatus) {
            case 1 : {
                return '#2B42C9';
            }
            case 0 : {
                return 'white';
            }
        }
    });

    Handlebars.registerHelper('getStatusGo', function (readyToGo) {
        switch (readyToGo) {
            case 1 : {
                return '#59c91e';
            }
            case 0 : {
                return 'white';
            }
        }
    });

    Handlebars.registerHelper('getStatusKit', function (KitStatus) {
        switch (KitStatus) {
            case 1 : {
                return '#2ac9bc';
            }
            case 0 : {
                return 'white';
            }
        }
    });

    Handlebars.registerHelper('getStatusLogin', function (loginStatus) {
        switch (loginStatus) {
            case 0: {
                return 'red';
            }
            case 1: {
                return 'green';
            }
        }
    });

    Handlebars.registerHelper('getConfigColor', function (configStatus) {
        switch (configStatus) {
            case 0: {
                return 'red';
            }
            case 1: {
                return 'green';
            }
        }
    });

    Handlebars.registerHelper('getMachineConfigStatus', function (machineConfigStatus) {
        switch (machineConfigStatus) {
            case 1: {
                return 'green';
            }
            case 2: {
                return 'red';
            }
        }
    });

    Handlebars.registerHelper('getMachineConfigStatus', function (machinePreConfigStatus) {
        switch (machinePreConfigStatus) {
            case 1: {
                return 'green';
            }
            case 2: {
                return 'red';
            }
        }
    });


    Handlebars.registerHelper('getMachineConfigStatus', function (checkStatus) {
        switch (checkStatus) {
            case 1: {
                return '#92ff8e';
            }
            case 2: {
                return 'red';
            }
        }
    });

    Handlebars.registerHelper('getActiveStatus', (active) => {
        switch (active) {
            case 1 : {
                return ''
            }
            case 0: {
                return 'inActiveButton-1'
            }
        }
    });

    Handlebars.registerHelper('getToDoStatus', function (toDoStatus) {
        switch (toDoStatus) {
            case 0: {
                return 'red';
            }
            case 1: {
                return 'inProcess';
            }
            case 2: {
                return 'green';
            }
        }
    });

    Handlebars.registerHelper('variantVisible', (status) => {
        switch (status) {
            case 1 : {
                return ''
            }
            case 0: {
                return 'noVariant'
            }
        }
    });


    UI.registerHelper('getStatusColor', function (supplyStatus) {
        switch (supplyStatus) {
            case 0 : {
                return 'orangered';
            }
            case 1 : {
                return '#138b11';
            }
            case 2 : {
                return 'inProcess';
            }
        }
    });

    Handlebars.registerHelper('inActive_Input', () => {
        let inActiveState = Session.get('componentChosen');
        if(inActiveState === 0) {
            return 'in-active-button';
        }
    });

    Handlebars.registerHelper('inActive_1', () => {
        let inActiveState = Session.get('status');
        if(inActiveState === 2) {
            return 'inActiveButton-1';
        }
    });

    Handlebars.registerHelper('inActive_2', () => {
        let inActiveState = Session.get('status');
        if(inActiveState === 0) {
            return 'inActiveButton-1';
        }
    });

    Meteor.saveFile = function(blob, name, typeFile, callback) {
        const openFailure = Session.get('openFailure');
        let selectedPdiMachineId = Session.get('selectedPdiMachineId');
        // check if image is from pdi (selectedPdiMachineId) or from Repair (selectedMachineId)
        if (selectedPdiMachineId === undefined) {
            selectedPdiMachineId = Session.get('selectedMachineId')
        }
        let fileReader = new FileReader(),
            method, encoding = 'binary', type = typeFile || 'binary';
        switch (type) {
            case 'text':
                // Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
                method = 'readAsText';
                encoding = 'utf8';
                break;
            case 'binary':
                method = 'readAsBinaryString';
                encoding = 'binary';
                break;
            default:
                method = 'readAsBinaryString';
                encoding = 'binary';
                break;
        }
        fileReader.onload = function(file) {
            console.log(openFailure, selectedPdiMachineId)
            Meteor.call('saveFile', file.target.result, name, encoding, openFailure, selectedPdiMachineId, callback);
        };
        fileReader[method](blob);
        Session.set('openFailure', '');
    };


    Meteor.saveConfigFile = function(blob, name, path, typeFile, callback) {
        const selectedVariantId = Session.get('selectedVariantId');
        let fileReader = new FileReader(),
            method, encoding = 'binary', type = typeFile || 'binary';
        switch (type) {
            case 'text':
                // Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
                method = 'readAsText';
                encoding = 'utf8';
                break;
            case 'binary':
                method = 'readAsBinaryString';
                encoding = 'binary';
                break;
            default:
                method = 'readAsBinaryString';
                encoding = 'binary';
                break;
        }
        fileReader.onload = function(file) {
            Meteor.call('saveConfigFile', file.target.result, name, path, encoding, selectedVariantId, callback);
        };
        fileReader[method](blob);
        Session.set('openFailure', '');
    };

}