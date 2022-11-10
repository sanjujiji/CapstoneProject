//This is being built as part of the Capstone project
//User.Routes will contain the API endpoints related to the User
//Date :- 9th Nov'22

module.exports = app => {
    var router = require("express").Router();

    //require the specific controller file
    var users = require("../controllers/user.controller");

    //1. Route for a new user signup
    router.post("/users",users.signup);

    //2. Route for user login
    router.post("/auth",users.login);

    //All APIs would start with '/'
    app.use('/', router);

}