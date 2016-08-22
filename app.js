"use strict"

let cheerio = require('cheerio');
let Parser = require('./parser');
let Location = require('./location');
let request = require('request');
let fs = require('fs');

let debug = false;

let modeCallback = (cap) => console.log(cap.text);

process.argv.map(function(elem) {
  let parts = elem.split("=");
  if (parts[0] === "--debug") {
    debug = true;
  }

  if (parts[0] === "--mode" && parts[1] === "location") {
    modeCallback = function(cap) {
      location.retrieve(cap.text, function(location) {
        if (!location) {
          location = "undefined";
        }
        console.log(cap.text + " - " + location);
      });
    }
  }

  if (parts[0] === "--help") {
    let helpStr = `captains:
    --debug                       Print additional information
    --mode=default                Set the output mode: available modes are <default,location>
    --help                        Guess what!`
    console.log(helpStr);
    process.exit()
  }

});

let parser = new Parser(cheerio);
let location = new Location(cheerio, request);

// fs.readFile("./docker-captains.html", "utf8", (err, text)=>{
request.get("https://www.docker.com/community/docker-captains", (err, res, text) => {
  let captains = parser.parse(text);
  if(debug) {
    console.log("|Captain|")
  }

  let valid = 0;
  captains.sort((x,y) => {
     if(x.text > y.text) {
       return 1;
     }
     else if(x.text < y.text) {
       return -1;
     }
     return 0;
  }).forEach((cap) => {
    if(cap.valid) {
      modeCallback(cap);
      valid++;
    }
  });

  if(debug) {
    console.log("\nCaptains: " + captains.length +", invalid handles: " + (captains.length - valid));
  }
});

