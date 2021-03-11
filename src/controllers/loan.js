"use strict";
const fetch = require("node-fetch");
const querystring = require("querystring");
const { Loan, r } = require("../model");
const logger = require("../util/log");
const { slug, SHA512, SHA256 } = require("../util");

const totalCount = async () => {
  let val = await Loan.orderBy("createdAt")
    .then((data) => data.length)
    .catch((err) => logger(err));
  return val;
};

const getDealer = async (id) => {
  const url = `http://localhost:${process.env.PORT}/api/wallet/${id}`;
  let dealer = await fetch(url, {
    headers: {
      "content-type": "application/json",
      apikey: process.env.APP_SECRET,
    },
  }).then((response) => response.json());

  return dealer;
};

const easyFinanceLoan = async (body) => {
  const token = SHA512(`${process.env.EASY_FINANCE_TOKEN};;${body.request_id}`);

  const url = process.env.EASY_FINANCE_URL + "?" + querystring.stringify(body);
  let finance = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: token,
    },
  }).then((response) => {
    return response.json();
  });

  return finance;
};

const newLoan = (req, res) => {
  const {
    amount,
    make,
    model,
    year,
    dealerId,
    lotNumber,
    provider,
    narration,
  } = req.body;

  Loan.filter({ dealerId, status: "pending" })
    .then((car) => {
      if (car.length) {
        res.send({
          success: false,
          error: "You have a pending loan. You can't request for another",
        });
      } else {
        getDealer(dealerId).then((dealer) => {
          let random = slug();

          const request_id = SHA256(random);

          const financeData = {
            name: dealer.data.accountDetails.accountName,
            email: dealer.data.metaInfo.email,
            dealer_id: dealerId,
            bank_name: dealer.data.accountDetails.bank,
            account_name: dealer.data.accountDetails.accountName,
            account_no: dealer.data.accountDetails.accountNumber,
            car_make: make,
            car_model: model,
            car_year: year,
            amount,
            lot_no: lotNumber,
            request_id,
          };

          easyFinanceLoan(financeData).then((finance) => {
            if (finance) {
              let interest =
                provider === "EasyFinance"
                  ? {
                      interest: process.env.EASY_FINANCE_INTEREST,
                      type: "daily",
                    }
                  : { interest: 2.5, type: "monthly" };

              const payload = {
                name: dealer.data.accountDetails.accountName,
                email: dealer.data.metaInfo.email,
                dealerId: dealerId,
                bankName: dealer.data.accountDetails.bank,
                accountName: dealer.data.accountDetails.accountName,
                accountNumber: dealer.data.accountDetails.accountNumber,
                make,
                model,
                year,
                amount,
                lotNumber,
                requestId: request_id,
                provider,
                interest,
                narration,
              };

              let loan = new Loan(payload);

              loan.save().then((data) => {
                res.send({ success: true, data });
              });
            } else {
              res.send({ success: false, error: "Easy finance error" });
            }
          });
        });
      }
    })
    .catch((err) => logger(err));
};

const updateLoan = (req, res) => {
  Loan.filter({
    requestId: req.body.requestId,
  })
    .update(req.body)
    .then((data) => {
      if (data.length) {
        res.send({
          success: true,
          message: "Loan updated",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Invalid Loan ID.",
        });
      }
    })
    .catch((err) => logger(err));
};

const easyLoan = (req, res) => {
  Loan.filter({
    requestId: req.body.requestId,
  })
    .update(req.body)
    .then((data) => {
      if (data.length) {
        res.send({
          success: true,
          message: "Loan updated",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Invalid Loan ID.",
        });
      }
    })
    .catch((err) => logger(err));
};

const getLoans = (req, res) => {
  let off = 0,
    page = Number(req.query.page),
    limit = Number(req.query.limit);

  if (page > 1) {
    off = limit * page;
    off = off - limit;
    limit = limit + off;
  }

  totalCount()
    .then((count) => {
      Loan.orderBy(r.desc("createdAt"))
        .slice(off, limit)
        .then((data) => {
          res.send({ success: true, data, count });
        });
    })
    .catch((err) => logger(err));
};

const getLoan = (req, res) => {
  const id = req.params.id;
  Loan.filter({ requestId: id })
    .then((data) => {
      res.send({ success: true, data: data[0] });
    })
    .catch((err) => {
      logger(err);
      res.send({ success: false, err: "Invalid ID or loan" });
    });
};

module.exports = {
  newLoan,
  updateLoan,
  easyLoan,
  getLoans,
  getLoan,
};
