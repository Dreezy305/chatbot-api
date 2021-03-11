"use strict";
require("dotenv").config();

const crypto = require("crypto");

const slug = () => {
  return (
    Math.random().toString(36).substring(2, 7) +
    Math.random().toString(36).substring(2, 7)
  );
};

const code = () => {
  let code = Math.random() * (1000000000 - 10000) + 10000;
  code = Math.round(code);
  return code;
};

const guid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const percentage = (current, total) => {
  let val = current / total;
  val = val.toFixed(1);
  val = val * 100;
  return val;
};

const encrypt = (val) => {
  const cipher = crypto.createCipher("aes192", process.env.APP_SECRET, 24);
  let encrypted = cipher.update(val, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (val) => {
  const decipher = crypto.createDecipher("aes192", process.env.APP_SECRET, 24);
  const encrypted = val;
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

module.exports = {
  slug,
  code,
  guid,
  percentage,
  encrypt,
  decrypt,
  asyncForEach,
};
