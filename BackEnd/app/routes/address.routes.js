//This is being built as part of the Capstone project
//address.Routes will contain the API endpoints related to the shipping address
//Date :- 10th Nov'22

module.exports = app => {
    var router = require("express").Router();

    //require the specific controller file
    var address = require("../controllers/address.controller");

    //1. Route for adding a new address
    router.post("/address",address.add);

    //All APIs would start with '/'
    app.use('/', router);

}