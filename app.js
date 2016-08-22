"use strict"

let cheerio = require('cheerio');
let Parser = require('./parser');
let request = require('request');
let fs = require('fs');

let debug = process.argv.length > 2 && process.argv[2] == "--debug"

let parser = new Parser(cheerio);
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
      console.log(cap.text);
      valid++;
    }
  });
  if(debug) {
    console.log("\nCaptains: " + captains.length +", invalid handles: " + (captains.length - valid));
  }
});

