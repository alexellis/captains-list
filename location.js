"use strict"

module.exports = class Location {

  constructor(cheerio, request, geocoder, geocoderHttpAdapter) {
    this.modules = {
      "cheerio": cheerio,
      "request": request,
      "geocoder": geocoder,
      "geocoderHttpAdapter": geocoderHttpAdapter
    };
  }

  retrieve(handle, callback) {
    this.modules.request.get("https://twitter.com/" + handle, (err, res, text) => {
      callback(this.parse(text));
    });
  }

  retrieveCoordinates(handle, callback) {
    let httpAdapter = new this.modules.geocoderHttpAdapter(null, {
      headers: {
        'user-agent': 'Captains List https://github.com/alexellis/captains-list',
      }
    });
    let options = {
      provider: 'openstreetmap',
      httpAdapter: httpAdapter,
      formatter: null,
      limit: 1,
    };

    let geocoder = this.modules.geocoder(options);

    this.retrieve(handle, (details)=> {
        geocoder.geocode(details, function(err, res) {
          callback(function(text) {
            if (res && res.length > 0) {
              return [
                res[0].longitude,
                res[0].latitude
              ];
            }
            return [];
          }());
        });
    });
  }

  parse(text) {
    let $ = this.modules.cheerio.load(text);
    let location = $(".ProfileHeaderCard-locationText");
    return location.text().replace(/(\r\n|\n|\r)/gm,"").trim();
  }
};
