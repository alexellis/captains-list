"use strict"

let cheerio = require('cheerio');
let Parser = require('./parser');
let Location = require('./location');
let request = require('request');
let fs = require('fs');
let optionsReader = require('./optionsReader');

let debug = false;

let options = optionsReader(process.argv);

if(options.help) {
  let helpStr = `captains:
  --debug                       Print additional information
  --mode=list                   Set the output mode: available modes are 
                                  <list,locations>
  --help                        This information`
  console.log(helpStr); 
  return;
}

let createList = (next, done) => {
  let parser = new Parser(cheerio);

  request.get("https://www.docker.com/community/docker-captains", (err, res, text) => {
    let captains = parser.parse(text);

    let valid = 0;
    let sorted = captains.sort((x,y) => {
      if(x.text > y.text) {
        return 1;
      }
      else if(x.text < y.text) {
        return -1;
      }
      return 0;
    });
    next(sorted, done);
  });
};

let printer = (captains, done) => {
  captains.forEach((cap)=> {
    if(cap.valid) {
      console.log(cap.text);
    }
    done();
  });
}

let locationPrinter = (captains, done) => {
  let location = new Location(cheerio, request);
  let work = captains.length;
  captains.forEach((cap)=> {
    if(cap.valid) {
      location.retrieve(cap.text, (details) => {
        console.log(cap.text + ": " +  details);
        work--;
        if(work==0) {
          return;
        }
      });
    }
    else {
      work--;
    }
  });
};

let next = printer;
if(options.mode=="locations") {
  next = locationPrinter;
}


createList(next, () => {

});
