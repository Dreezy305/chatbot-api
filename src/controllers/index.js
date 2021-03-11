"use strict";

const {
  newUser,
  updateUser,
  getUsers,
  getUser,
  getUserByEmail,
  searchUser,
  userLogin,
} = require("./user");

const {
  newOrganisation,
  updateOrganisation,
  getOrganisations,
  getOrganisation,
  searchOrganisation,
} = require("./organisation");

const {
  newCampaign,
  updateCampaign,
  getCampaigns,
  getCampaign,
  searchCampaign,
} = require("./campaign");

const {
  newTweet,
  updateTweet,
  getTweets,
  getTweet,
  searchTweet,
} = require("./tweet");

const {
  newHashtag,
  updateHashtag,
  getHashtags,
  getHashtag,
  searchHashtag,
} = require("./hashtag");

module.exports = {
  newUser,
  updateUser,
  getUsers,
  getUser,
  getUserByEmail,
  searchUser,
  userLogin,
  newOrganisation,
  updateOrganisation,
  getOrganisations,
  getOrganisation,
  searchOrganisation,
  newCampaign,
  updateCampaign,
  getCampaigns,
  getCampaign,
  searchCampaign,
  newTweet,
  updateTweet,
  getTweets,
  getTweet,
  searchTweet,
  newHashtag,
  updateHashtag,
  getHashtags,
  getHashtag,
  searchHashtag,
};
