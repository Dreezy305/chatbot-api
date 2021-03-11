"use strict";
const fetch = require("node-fetch");
const { Campaign, r } = require("../model");
const logger = require("../util/log");
const { slug } = require("../util");

const totalCount = async () => {
  let val = await Campaign.orderBy("createdAt")
    .then((data) => data.length)
    .catch((err) => logger(err));
  return val;
};

const newCampaign = (req, res) => {
  let campaign = new Campaign(req.body);
  campaign
    .save()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const updateCampaign = (req, res) => {
  Campaign.get(req.body.id)
    .update(req.body)
    .then(() => {
      res.send({
        success: true,
        message: "Campaign updated",
      });
    })
    .catch((err) => logger(err));
};

const getCampaigns = (req, res) => {
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
      Campaign.orderBy(r.desc("createdAt"))
        .getJoin()
        .slice(off, limit)
        .then((data) => {
          res.send({ success: true, data, count });
        });
    })
    .catch((err) => logger(err));
};

const getCampaign = (req, res) => {
  const id = req.params.id;
  Campaign.get(id)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => {
      logger(err);
      res.send({ success: false, err: "Invalid ID or campaign" });
    });
};

const searchCampaign = (req, res) => {
  let query = req.query.query;

  Campaign.orderBy(r.desc("createdAt"))
    .filter((campaign) =>
      campaign("name")
        .match(query)
        .or(campaign("description").match(query))
        .or(campaign("id").match(query))
    )
    .getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

module.exports = {
  newCampaign,
  updateCampaign,
  getCampaigns,
  getCampaign,
  searchCampaign,
};
