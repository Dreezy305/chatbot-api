"use strict";

const { User, r } = require("../model");
const logger = require("../util/log");

const totalCount = async () => {
  let val = await User.orderBy("createdAt")
    .then((data) => data.length)
    .catch((err) => logger(err));
  return val;
};

const newUser = (req, res) => {
  User.filter({ email: req.body.email })
    .then((val) => {
      if (val.length === 0) {
        let user = new User(req.body);
        user
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
    })
    .catch((err) => {
      logger(err);
      res.send({ success: false, err: "Unable to create user" });
    });
};

const updateUser = (req, res) => {
  User.get(req.body.id)
    .update(req.body)
    .then(() => {
      res.send({
        success: true,
        message: "User updated",
      });
    })
    .catch((err) => logger(err));
};

const getUsers = (req, res) => {
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
      User.orderBy(r.desc("createdAt"))
        .getJoin()
        .slice(off, limit)
        .then((data) => {
          res.send({ success: true, data, count });
        });
    })
    .catch((err) => logger(err));
};

const getUser = (req, res) => {
  const id = req.params.id;
  User.get(id)
    .getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => {
      logger(err);
      res.send({ success: false, err: "Invalid ID or user" });
    });
};

const searchUser = (req, res) => {
  let query = req.query.query;

  User.orderBy(r.desc("createdAt"))
    .filter((user) =>
      user("name")
        .match(query)
        .or(user("email").match(query))
        .or(user("role").match(query))
        .or(user("id").match(query))
    )
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const getUserByEmail = (req, res) => {
  const email = req.body.email;

  User.filter({ email })
    .then((data) => {
      res.send({ success: true, data: data ? data[0] : {} });
    })
    .catch((err) => {
      logger(err);
      res.send({ success: false, err: "Invalid email" });
    });
};
const userLogin = (req, res) => {};

module.exports = {
  newUser,
  updateUser,
  getUsers,
  getUser,
  getUserByEmail,
  searchUser,
  userLogin,
};
