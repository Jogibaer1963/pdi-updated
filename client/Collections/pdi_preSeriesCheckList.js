Meteor.subscribe('preSeriesCheckList');


Template.checkGenerator.events({

   'change #inputGroupFile02': () => {
       event.preventDefault();
    const uploader = require('base64-image-upload');
        console.log('upload');
        var image = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
        uploader.setApiUrl("http://192.168.0.107:3300/dashboard/files/");
        uploader.upload(image, {mime:"image/png", headers: {'X-Access-Token': '123456789'}}, function(err, response){
            if (!err && response.statusCode === 200){
                console.log(JSON.parse(response.body));
                // handle response
            } else {
                console.log(err, response);
                // handle errors
            }
        });
    }

});