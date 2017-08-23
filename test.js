var OpenGeocoder = require('node-open-geocoder');

var geo = new OpenGeocoder();

geo.geocode('135 pilkington avenue, birmingham', function(err, res) {
 console.log(err,res);
});
