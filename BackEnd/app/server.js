//This is being built as part of the Capstone project
//Server.js --> starting point for the backend application
//Date :- 9th Nov'22

const express = require('express');
const cors = require('cors');

//express object
const app = express();
app.use(express.json());




//get the model objects
const db = require('../app/models/index');
db.mongoose
    .connect(db.url,{
                useNewUrlParser : true,
                useUnifiedTopology : true 
    })
    .then(() => {
        console.log("Connected to the upGradEshop database successfully!");
    })
    .catch((err) => {
        console.log("Cannot connect to the database",err);
        process.exit();
    });