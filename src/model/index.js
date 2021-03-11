require("dotenv").config();
const config = require("../config");

const thinky = require("thinky")(config.api);
const r = thinky.r;
const type = thinky.type;

const User = thinky.createModel("users", {
  id: type.string(),
  name: type.string().min(2),
  phone: type.string(),
  email: type.string().email().required(),
  password: type.string(),
  role: type.string(),
  banned: type.boolean().default(false),
  verified: type.boolean().default(false),
  status: type.date(),
  createdAt: type.date().default(r.now),
  updatedAt: type.date().default(r.now),
});

const Organisation = thinky.createModel("organisations", {
  id: type.string(),
  name: type.string(),
  description: type.string(),
  slug: type.string(),
  userId: type.string(),
  createdAt: type.date().default(r.now),
  updatedAt: type.date().default(r.now),
});

const Campaign = thinky.createModel("campaigns", {
  id: type.string(),
  name: type.string(),
  description: type.string(),
  organisationId: type.string(),
  createdAt: type.date().default(r.now),
  updatedAt: type.date().default(r.now),
});

const Tweet = thinky.createModel("tweets", {
  id: type.string(),
  link: type.string(),
  content: type.string(),
  campaignId: type.string(),
  createdAt: type.date().default(r.now),
  updatedAt: type.date().default(r.now),
});

const Hashtag = thinky.createModel("hashtags", {
  id: type.string(),
  link: type.string(),
  content: type.string(),
  campaignId: type.string(),
  createdAt: type.date().default(r.now),
  updatedAt: type.date().default(r.now),
});

// Associations
User.hasMany(Organisation, "companies", "id", "userId");
Organisation.hasMany(Campaign, "campaigns", "id", "organisationId");
Campaign.hasMany(Tweet, "tweets", "id", "campaignId");
Campaign.hasMany(Hashtag, "hashtags", "id", "campaignId");

// User indices
User.ensureIndex("id");
User.ensureIndex("name");
User.ensureIndex("email");
User.ensureIndex("phone");
User.ensureIndex("password");
User.ensureIndex("banned");
User.ensureIndex("verified");
User.ensureIndex("createdAt");
User.ensureIndex("updatedAt");

//Organisation indices
Organisation.ensureIndex("id");
Organisation.ensureIndex("name");
Organisation.ensureIndex("slug");
Organisation.ensureIndex("userId");
Organisation.ensureIndex("createdAt");
Organisation.ensureIndex("updatedAt");

//Campaign indices
Campaign.ensureIndex("id");
Campaign.ensureIndex("name");
Campaign.ensureIndex("slug");
Campaign.ensureIndex("organisationId");
Campaign.ensureIndex("createdAt");
Campaign.ensureIndex("updatedAt");

//Tweet indices
Tweet.ensureIndex("id");
Tweet.ensureIndex("link");
Tweet.ensureIndex("campaignId");
Tweet.ensureIndex("createdAt");
Tweet.ensureIndex("updatedAt");

//Hashtag indices
Hashtag.ensureIndex("id");
Hashtag.ensureIndex("link");
Hashtag.ensureIndex("campaignId");
Hashtag.ensureIndex("createdAt");
Hashtag.ensureIndex("updatedAt");

module.exports = {
  r,
  User,
  Organisation,
  Campaign,
  Tweet,
  Hashtag,
};
