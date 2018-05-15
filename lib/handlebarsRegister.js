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
                ;
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


    Handlebars.registerHelper('getMachineConfigStatus', function (checkStatus) {
        switch (checkStatus) {
            case 1: {
                return 'green';
            }
            case 2: {
                return 'red';
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

   UI.registerHelper('getCommStatus', function (e) {
        switch (e) {
            case 0 : {                 // 0 = not touched
                return 'orangered';
            }
            case 1 : {
                return 'in-active-button';      // 1 = done
            }
            case 2 : {
                return 'comm-in-process' ;    // 2 = in process
            }
            case 3 : {
                return '#a914da';    // 3 = pause
            }
        }
    });




}