//This is being built as part of the Capstone project
//index.js --> This file is for setting up the database object
//Date :- 9th Nov'22
const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/upGradEshop";

//setting up the database object
const db = {};
db.mongoose = mongoose;
db.url = url;

//Address database object --> passing mongoose as a parameter
db.Address = require('./Address.model')(mongoose);

//Order database object --> passing mongoose as a parameter
db.Orders = require('./Order.model')(mongoose);

//Product database object --> passing mongoose as a parameter
db.Product = require('./Product.model')(mongoose);

//User database object --> passing mongoose as a parameter
db.User = require('./User.model')(mongoose);

module.exports = db;