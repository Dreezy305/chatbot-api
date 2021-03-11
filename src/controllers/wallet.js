"use strict";
const fetch = require("node-fetch");
const logger = require("../util/log");

const getToken = async () => {
  const url = `${process.env.INTERNAL_API}login`;
  let res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: process.env.INTERNAL_USER,
      password: process.env.INTERNAL_PASS,
    }),
  });

  let data = await res.json();
  let token = data.user.data.login.token;
  return token;
};

const getDealer = async (id, token) => {
  const url = `${process.env.INTERNAL_API}dealerdetails/${id}`;
  let dealer = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ authToken: token }),
  }).then((response) => response.json());

  return dealer;
};

const getAccountDetails = async (id, token) => {
  const url = `${process.env.INTERNAL_API}dealer/${id}`;
  let dealer = await fetch(url, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());

  return dealer;
};

const getWallet = (req, res) => {
  const id = req.params.id;

  getToken()
    .then((token) => {
      getDealer(id, token).then((dealer) => {
        dealer = dealer.list[0];
        // let dealerId = dealer.metaInfo.virtualAccountOrWalletId;

        getAccountDetails(id, token).then((wallet) => {
          let clientId = wallet.rows[0].clientId;
          wallet = wallet.rows[0].mifosExtId;
          wallet = wallet.split("|");
          wallet = wallet[2];
          wallet = {
            accountName: dealer.metaInfo.companyName,
            accountNumber: wallet,
            bank: "Providus",
          };
          dealer.accountDetails = wallet;

          const url = `${process.env.INTERNAL_API}walletbalances/${clientId}`;

          fetch(url, {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              let account = data.savingsAccounts;

              account = account.filter(
                (item) => item.shortProductName === "EWLT"
              );
              account = account[0].accountBalance;
              dealer.accountBalance = account;

              res.send({ success: true, data: dealer });
            });
        });
      });
    })
    .catch((err) => logger(err));
};

module.exports = {
  getWallet,
};
