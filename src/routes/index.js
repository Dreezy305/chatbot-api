const { Router } = require("express");
const controllers = require("../controllers");

const route = Router();

//Wallet routes
route.get("/api/wallet/:id", controllers.getWallet);

//Loan routes
route.post("/api/loan/create", controllers.newLoan);
route.post("/api/loan/update", controllers.updateLoan);
route.post("/api/loan/easyfinance", controllers.easyLoan);
route.get("/api/loans", controllers.getLoans);
route.get("/api/loan/:id", controllers.getLoan);

module.exports = route;
