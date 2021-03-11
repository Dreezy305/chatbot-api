const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const logger = require("../util/log");
const routes = require("../routes");
const cron = require("node-cron");
const { dealerJobs } = require("../controllers/job");

//Routing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

const isValidApiKey = (req, res, next) => {
  const apikey = req.headers.apikey;

  apikey === process.env.APP_SECRET
    ? next()
    : res.status(400).send({ success: false, error: "Invalid API key" });
};

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../../log/access.log"),
  {
    flags: "a",
  }
);

// setup the logger
app.use(
  morgan(
    ":remote-addr - :remote-user :method :status :url :referrer :user-agent :response-time ms :date[web]",
    {
      stream: accessLogStream,
    }
  )
);

app.use(isValidApiKey);
app.use(routes);

app.use((err, req, res, next) => {
  logger(err.stack);
  res.status("500").send({ err: "Please check the API docs." });
});

app.use((req, res) => {
  res.status(404).send({ err: "Oops! Page not found or has been deleted." });
});

cron.schedule("*/15 * * * *", () => {
  console.log("Starting cron....");
  dealerJobs();
});

module.exports = app;
