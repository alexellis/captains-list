"use strict"


module.exports = class Parser {

    constructor(cheerio) {
        this.modules = { "cheerio": cheerio };
    }

    // sanitize(handle) {
    //     let text = handle.toLowerCase();
    //     if (text[0] == "@") {
    //         text = text.substring(1);
    //     }
    //     if (handle.indexOf("twitter.com") > -1) {
    //         text = text.substring(text.lastIndexOf("\/") + 1)
    //     }
    //     return { text: text, valid: text.indexOf("http") == -1 };
    // }

    parsePages(text) {
        let pages = this.getPages(text);
        return pages;
    }

    parseCaptain(text) {
        let $ = this.modules.cheerio.load(text);

        let link = $(".twitter_link").text();
        let locationElement = $(".sidebar_captains ul");
        let ul = 0;
        let location = "";
        locationElement.each(function(i, elem) {
            if (elem.name == "ul") {
                if (ul == 1) {
                    location = $(this).find("li").text();
                }
                ul++;
            }
        });
        return { "link": link, "location": location };
    }

    getPages(text) {
        let $ = this.modules.cheerio.load(text);

        let people = $("a");
        let handles = [];
        people.each((i, person) => {
            let handle = person.attribs.href;
            if (handles.indexOf(handle) == -1) {
                handles.push(handle);
            }
        });
        return handles;
    }

};