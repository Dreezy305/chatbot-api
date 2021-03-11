"use strict";

const fs = require("fs");
const path = require("path");
const moment = require("moment");

const logger = (error) => {
  const date = moment().format("MMM D, YYYY @ hh:mm:ss A");
  const log = `${error}... => ${date} \n`;

  if (process.env.ENVIRONMENT === "production") {
    fs.appendFile(path.resolve("log/error.log"), log, (err) => {
      if (err) throw err;
    });
  } else {
    console.error(log);
  }
};

module.exports = logger;
