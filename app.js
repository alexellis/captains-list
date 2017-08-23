"use strict"

let cheerio = require('cheerio');
let Parser = require('./parser');
let Location = require('./location');
let request = require('request');
let async = require('async');
let fs = require('fs');
let optionsReader = require('./optionsReader');

let debug = false;

let options = optionsReader(process.argv);

if (options.help) {
    let helpStr = `captains:
  --debug                       Print additional information
  --mode=list                   Set the output mode: available modes are 
                                  <list,json>
                                  json option also includes locations.
  --help                        This information`
    console.log(helpStr);
    return;
}

let createList = (next, done) => {
    let parser = new Parser(cheerio);

    request.get("https://www.docker.com/api/docker_captains_ajax/all/all/all/all/all/all", (err, res, text) => {
        let captainPages = parser.parsePages(text);

        getCaptains(captainPages, (err, captains) => {
            let sorted = captains.sort((x, y) => {
                if (x.text > y.text) {
                    return 1;
                } else if (x.text < y.text) {
                    return -1;
                }
                return 0;
            });

            next(sorted, done);
        });
    });
};

let printer = (captains, done) => {
    captains.forEach((cap) => {
        console.log(cap.text);
    });
    done();
}

let locationPrinter = (captains, done) => {
    let location = new Location(cheerio, request);
    captains.forEach((cap) => {
        console.log(cap.text + ": " + cap.location);
    });
};

let jsonPrinter = (captains, done) => {
    console.log(JSON.stringify(captains));
};

let next = printer;
if (options.mode == "json") {
    next = jsonPrinter;
}


createList(next, () => {});

function getCaptains(pages, done) {
    let parser = new Parser(cheerio);
    let concurrent = 10;
    let captains = [];
    let q = async.queue((task, cb) => {
            let req = {
                url: "https://www.docker.com/" + task
            };
            request.get(req, (err, res, body) => {
                let captain = parser.parseCaptain(body);
                captains.push({ "text": captain.link, "location": captain.location });

                cb(err);
            });
        },
        concurrent);

    pages.forEach((page) => {
        q.push(page);
    });

    q.drain = function() {
        done(null, captains);
    }
}