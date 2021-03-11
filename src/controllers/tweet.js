"use strict";
const fetch = require("node-fetch");
const { Tweet, r } = require("../model");
const logger = require("../util/log");

const totalCount = async () => {
  let val = await Tweet.orderBy("createdAt")
    .then((data) => data.length)
    .catch((err) => logger(err));
  return val;
};

const newTweet = (req, res) => {
  Tweet.filter({ link: req.body.link }).then((val) => {
    if (val.length === 0) {
      let tweet = new Tweet(req.body);
      tweet
        .save()
        .then((data) => {
          res.send({ success: true, data });
        })
        .catch((err) => logger(err));
    } else {
      res.send({
        success: false,
        err: "Duplicate entry. Tweet already exists!",
      });
    }
  });
};

const updateTweet = (req, res) => {
  Tweet.get(req.body.id)
    .update(req.body)
    .then(() => {
      res.send({
        success: true,
        message: "Tweet updated",
      });
    })
    .catch((err) => logger(err));
};

const getTweets = (req, res) => {
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
      Tweet.orderBy(r.desc("createdAt"))
        .getJoin()
        .slice(off, limit)
        .then((data) => {
          res.send({ success: true, data, count });
        });
    })
    .catch((err) => logger(err));
};

const getTweet = (req, res) => {
  const id = req.params.id;
  Tweet.get(id)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => {
      logger(err);
      res.send({ success: false, err: "Invalid ID or tweet" });
    });
};

const searchTweet = (req, res) => {
  let query = req.query.query;

  Tweet.orderBy(r.desc("createdAt"))
    .filter((tweet) =>
      tweet("id")
        .match(query)
        .or(tweet("link").match(query))
        .or(tweet("content").match(query))
    )
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

module.exports = {
  newTweet,
  updateTweet,
  getTweets,
  getTweet,
  searchTweet,
};
