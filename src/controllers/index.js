"use strict";

const { dealerJobs } = require("./job");
const { getWallet } = require("./wallet");
const { newLoan, updateLoan, easyLoan, getLoans, getLoan } = require("./loan");

module.exports = {
  getWallet,
  newLoan,
  easyLoan,
  updateLoan,
  getLoans,
  getLoan,
  dealerJobs,
};
