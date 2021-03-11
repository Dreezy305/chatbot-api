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

module.exports = route;
