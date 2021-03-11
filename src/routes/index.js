const { Router } = require("express");
const controllers = require("../controllers");

const route = Router();

//User routes
route.post("/api/user/create", controllers.newUser);
route.post("/api/user/update", controllers.updateUser);
route.get("/api/users", controllers.getUsers);
route.get("/api/user/search", controllers.searchUser);
route.get("/api/user/:id", controllers.getUser);

//Organisation routes
route.post("/api/organisation/create", controllers.newOrganisation);
route.post("/api/organisation/update", controllers.updateOrganisation);
route.get("/api/organisations", controllers.getOrganisations);
route.get("/api/organisation/search", controllers.searchOrganisation);
route.get("/api/organisation/:id", controllers.getOrganisation);

//Campaign routes
route.post("/api/campaign/create", controllers.newCampaign);
route.post("/api/campaign/update", controllers.updateCampaign);
route.get("/api/campaigns", controllers.getCampaigns);
route.get("/api/campaign/search", controllers.searchCampaign);
route.get("/api/campaign/:id", controllers.getCampaign);

//Tweet routes
route.post("/api/tweet/create", controllers.newTweet);
route.post("/api/tweet/update", controllers.updateTweet);
route.get("/api/tweets", controllers.getTweets);
route.get("/api/tweet/search", controllers.searchTweet);
route.get("/api/tweet/:id", controllers.getTweet);

//Hashtag routes
route.post("/api/hashtag/create", controllers.newHashtag);
route.post("/api/hashtag/update", controllers.updateHashtag);
route.get("/api/hashtags", controllers.getHashtags);
route.get("/api/hashtag/search", controllers.searchHashtag);
route.get("/api/hashtag/:id", controllers.getHashtag);

module.exports = route;
