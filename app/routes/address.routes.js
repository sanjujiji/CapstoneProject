//This is being built as part of the Capstone project
//address.Routes will contain the API endpoints related to the shipping address
//Date :- 10th Nov'22

module.exports = app => {
    var router = require("express").Router();

    //require the specific controller file
    var address = require("../controllers/address.controller");
    var authorizationUser = require("../middleware/authorizationUser");

    //1. Route for adding a new address
    // router.post("/address",authorizationUser,address.add);
    router.post("/addresses",authorizationUser,address.add);

    //2. Route for getting addresses of a specific user
    router.get("/address",authorizationUser,address.getAddress);

    //All APIs would start with '/'
    app.use('/', router);

}