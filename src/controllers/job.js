"use strict";
require("dotenv").config();

const fetch = require("node-fetch");
const axios = require("axios");
const logger = require("../util/log");
const { asyncForEach } = require("../util");

/**
 *  This function gets all the dealers that have been qualified for financing from CMS group
 * "dealer-financing"
 * @param {string} token authentication token from FCG
 */
const dealerFinancingExceptions = async (token) => {
  const url = `${process.env.FCG_BASE_HREF}auction/`;
  const getTheDealersInCMSGroupQuery = `
    {dealerGroup(id:"${process.env.DEALER_FINANCING_GROUP_ID}"){list{id,name,description,country,hide,dealers,createdById,createdByName,createdAt,updatedAt}}}
  `;
  try {
    const json = await (
      await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/graphql",
          Authorization: `Bearer ${token}`,
        },
        body: getTheDealersInCMSGroupQuery,
      })
    ).json();
    const dealerGroups = json.data.dealerGroup.list[0].dealers;
    return dealerGroups;
  } catch (error) {
    logger(error);
  }
};

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

const getWallet = async (id) => {
  const url = `http://localhost:${process.env.PORT}/api/wallet/${id}`;
  let dealer = await fetch(url, {
    headers: {
      "content-type": "application/json",
      apikey: process.env.APP_SECRET,
    },
  }).then((response) => response.json());

  return dealer;
};

const getActiveDealers = async (token) => {
  const query = `{user(limit:100,metaInfo:{maxAmountBids:{from:30},status:{include:"active"}},sort:[{field:"firstname",order:"DESC"}],page:1,userClass:DEALER){list{id,firstname,lastname,email,groups,dealerManager,internalId,createdAt,isCheckedIn,metaInfo{legalCompanyName,status,companyName,email,internalId,dealerManager,phone,street,city,maxAmountBids,businessCategory,places,taxId}},count}}`;
  try {
    const dealers = await axios.post(
      `${process.env.FCG_BASE_HREF}auth/`,
      query,
      {
        headers: {
          "Content-Type": "application/graphql",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!dealers || !dealers.data) return null;
    return dealers.data.data.user.list;
  } catch (error) {
    logger(error);
  }
};

const setMaxBid = async (dealerId, walletAmount, token, financedDealers) => {
  let maxBid = walletAmount;
  if (financedDealers.includes(dealerId)) {
    maxBid = walletAmount * 2;
  }
  const query = `{updateUser(id:"${dealerId}", metaInfo: {maxAmountBids: ${maxBid}}){metaInfo {maxAmountBids}}}`;

  const response = await fetch(`${process.env.FCG_BASE_HREF}auth/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/graphql",
      Authorization: `Bearer ${token}`,
    },
    body: query,
  });
  let data = await response.json();
  return data;
};

const dealerJobs = () => {
  getToken()
    .then(async (token) => {
      const financedDealers = await dealerFinancingExceptions(token);
      getActiveDealers(token).then((dealers) => {
        asyncForEach(dealers, async (item) => {
          await getWallet(item.metaInfo.internalId).then((response) => {
            let id = response.data.id;

            let balance = response.data ? response.data.accountBalance : 0;

            if (balance) {
              setMaxBid(id, balance, token, financedDealers)
                .then((updates) => {
                  console.log(
                    response.data.metaInfo.companyName,
                    updates.data.updateUser.metaInfo
                  );
                })
                .catch((err) => logger(err));
            }
          });
        });
      });
    })
    .catch((err) => logger(err));
};

dealerJobs();

module.exports = { dealerJobs };
