//This is being built as part of the Capstone project
//Server.js --> starting point for the backend application
//Date :- 9th Nov'22

const express = require('express');
const cors = require('cors');
const bodyparser = require("body-parser");
//express object
const app = express();
app.use(express.json());


app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

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

//load the app routes for user
    require('./routes/user.routes')(app);

//load the routes for address
    require('./routes/address.routes')(app);

// set up a default route for / 
    app.get("/", (req, res) => {
        res.json({ message: "Upgrad Eshop application" });
    });

// set port for the web server and listen for requests
    const PORT = process.env.PORT || 8085;
        app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });