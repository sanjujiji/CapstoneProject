//This is being built as part of the Capstone project
//Order.Routes will contain the API endpoints related to orders
//Date :- 12th Nov'22


module.exports = app => {
    var router = require("express").Router();
    const authorizationUser = require('../middleware/authorizationUser');

    //require the specific controller file
    var order = require("../controllers/order.controller");

    //1. Route for adding new orders
    router.post("/orders",authorizationUser,order.addOrders);

    //All APIs would start with '/'
    app.use('/', router);

}