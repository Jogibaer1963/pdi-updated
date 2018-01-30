if (Meteor.isClient) {

    Handlebars.registerHelper('getSiStatusColor', function(siStatus) {
        switch (siStatus) {
            case 1 : {
                return '#138b0e';
            } break;
            case 0 : {
                return 'orangered';
            } break;
            case 2 : {
               return 'inProcess';
            } break;
            case 3 : {
               return 'inPdiProcess';
            } break;
            case 4 : {
                return '#1f70ff';
            } break;
        }
    });

    Handlebars.registerHelper('getOrderStatusColor', function(orderStatus) {
        switch (orderStatus) {
            case 1 : {
                return '#0f038b';
            } break;
            case 0 : {
                return 'white';
            } break;
        }
    });

    Handlebars.registerHelper('getStatusColor', function(pdiStatus) {
        switch (pdiStatus) {
            case 1 : {
                return '#138b0e';
            } break;
            case 0 : {
                return 'orangered';
            } break;
            case 2 : {
                return 'inProcess';
            }  break;
        }
    });

    Handlebars.registerHelper('getStatusColor', function(repairStatus) {
        switch (repairStatus) {
            case 1 : {
                return '#138b0e';
            } break;
            case 0 : {
                return 'orangered';
            } break;
            case 2 : {
                return 'inProcess';
            }  break;
        }
    });

    Handlebars.registerHelper('getStatusColor', function(washStatus) {
        switch (washStatus) {
            case 1 : {
                return '#138b0e';
            } break;
            case 0 : {
                return 'orangered';
            } break;
            case 2 : {
                return 'inProcess';
            }  break;
        }
    });

    Handlebars.registerHelper('getStatusColor', function(shipStatus) {
        switch (shipStatus) {
            case 1 : {
                return '#138b0e';
            } break;
            case 0 : {
                return 'orangered';
            } break;
            case 2 : {
                return 'inProcess';
            }  break;
        }
    });

    Handlebars.registerHelper('getStatus', function(truckStatus) {
        switch (truckStatus) {
            case 1 : {
                return '#2B42C9';
            } break;
            case 0 : {
                return 'white';
            } break;
        }
    });

    Handlebars.registerHelper('getStatus', function(KitStatus) {
        switch (KitStatus) {
            case 1 : {
                return '#21c913';
            } break;
            case 0 : {
                return 'white';
            } break;
        }
    });

    Handlebars.registerHelper('getStatusLogin', function (loginStatus) {
         switch (loginStatus) {
             case 0: {
                 return 'red';
             } break;
             case 1: {
                 return 'green';
             } break;
         }
    });

}

