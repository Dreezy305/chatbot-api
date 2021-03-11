"use strict";
const fetch = require("node-fetch");
const { Organisation, r } = require("../model");
const logger = require("../util/log");
const { slug } = require("../util");

const totalCount = async () => {
  let val = await Organisation.orderBy("createdAt")
    .then((data) => data.length)
    .catch((err) => logger(err));
  return val;
};

const newOrganisation = (req, res) => {
  Organisation.filter({ userId: req.body.userId, name: req.body.name }).then(
    (val) => {
      if (val.length === 0) {
        req.body.slug = slug();
        let user = new Organisation(req.body);
        user
          .save()
          .then((data) => {
            res.send({ success: true, data });
          })
          .catch((err) => logger(err));
      } else {
        res.send({
          success: false,
          err: "Duplicate entry. Company already exists!",
        });
      }
    }
  );
};

const updateOrganisation = (req, res) => {
  Organisation.get(req.body.id)
    .update(req.body)
    .then(() => {
      res.send({
        success: true,
        message: "Organisation updated",
      });
    })
    .catch((err) => logger(err));
};

const getOrganisations = (req, res) => {
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
      Organisation.orderBy(r.desc("createdAt"))
        .getJoin()
        .slice(off, limit)
        .then((data) => {
          res.send({ success: true, data, count });
        });
    })
    .catch((err) => logger(err));
};

const getOrganisation = (req, res) => {
  const id = req.params.id;
  Organisation.get(id)
    .getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => {
      logger(err);
      res.send({ success: false, err: "Invalid ID or organisation" });
    });
};

const searchOrganisation = (req, res) => {
  let query = req.query.query;

  Organisation.orderBy(r.desc("createdAt"))
    .filter((organisation) =>
      organisation("name")
        .match(query)
        .or(organisation("description").match(query))
        .or(organisation("id").match(query))
    )
    .getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

module.exports = {
  newOrganisation,
  updateOrganisation,
  getOrganisations,
  getOrganisation,
  searchOrganisation,
};
