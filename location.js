"use strict"

module.exports = class Location {

  constructor(cheerio, request) {
    this.modules = {
      "cheerio": cheerio,
      "request": request
    };
  }

  retrieve(handle, callback) {
    this.modules.request.get("https://twitter.com/" + handle, (err, res, text) => {
      callback(this.parse(text));
    });
  }

  parse(text) {
    let $ = this.modules.cheerio.load(text);
    let location = $(".ProfileHeaderCard-locationText");
    return location.text().replace(/(\r\n|\n|\r)/gm,"").trim();
  }
};
