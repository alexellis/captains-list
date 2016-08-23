"use strict"

module.exports = (argv) =>
{
    let options = {mode: "list"};
    argv.map((elem) => {
        let parts = elem.split("=");

        if (parts[0] === "--debug") {
          options.debug = true;
        }
        if (parts[0] === "--mode" && parts[1] === "locations") {
            options.mode = "locations";
        }
        if (parts[0] === "--mode" && parts[1] === "geojson") {
            options.mode = "geojson";
        }
        if (parts[0] === "--help") {
            options.help = "help";
        }
    });

    return options;
};
