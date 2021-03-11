"use strict";
const fetch = require("node-fetch");
const { Hashtag, r } = require("../model");
const logger = require("../util/log");
const { slug } = require("../util");

const totalCount = async () => {
  let val = await Hashtag.orderBy("createdAt")
    .then((data) => data.length)
    .catch((err) => logger(err));
  return val;
};

const newHashtag = (req, res) => {
  Hashtag.filter({ email: req.body.email }).then((val) => {
    if (val.length === 0) {
      req.body.slug = slug();
      let hashtag = new Hashtag(req.body);
      hashtag
        .save()
        .then((data) => {
          res.send({ success: true, data });
        })
        .catch((err) => logger(err));
    } else {
      res.send({
        success: false,
        err: "Duplicate entry. Email already exists!",
      });
    }
  });
};

const updateHashtag = (req, res) => {
  Hashtag.get(req.body.id)
    .update(req.body)
    .then(() => {
      res.send({
        success: true,
        message: "Hashtag updated",
      });
    })
    .catch((err) => logger(err));
};

const getHashtags = (req, res) => {
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
      Hashtag.orderBy(r.desc("createdAt"))
        .getJoin()
        .slice(off, limit)
        .then((data) => {
          res.send({ success: true, data, count });
        });
    })
    .catch((err) => logger(err));
};

const getHashtag = (req, res) => {
  const id = req.params.id;
  Hashtag.get(id)
    .then((data) => {
      data = data.filter((item) => item.role !== "Admin");
      res.send({ success: true, data });
    })
    .catch((err) => {
      logger(err);
      res.send({ success: false, err: "Invalid ID or hashtag" });
    });
};

const searchHashtag = (req, res) => {
  let query = req.query.query;

  Hashtag.orderBy(r.desc("dateRequested"))
    .filter((hashtag) =>
      hashtag("name")
        .match(query)
        .or(hashtag("email").match(query))
        .or(hashtag("department").match(query))
        .or(hashtag("role").match(query))
    )
    .getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

module.exports = {
  newHashtag,
  updateHashtag,
  getHashtags,
  getHashtag,
  searchHashtag,
};
