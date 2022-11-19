//This is being built as part of the Capstone project
//Server.js --> starting point for the backend application
//Date :- 9th Nov'22

const express = require('express');
const cors = require('cors');
const bodyparser = require("body-parser");
//express object
const app = express();
app.use(express.json());
var corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET,POST,DELETE,PUT", // would allow only GET and PUT request
    allowedHeaders : "*", 
    allowCredentials : "true"
   }
   app.use(cors(corsOptions));
   
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNBbmp1SmlqaSIsInJvbGUiOiJ1c2VyIiwidGltZXN0YW1wIjoiMjAyMi0xMS0xMVQxMjo1MjoxNC45MzRaIiwiaWF0IjoxNjY4MTcxMTM0fQ.ffNNnSbiK36NzHqWqZ53hxDY5cr4t5YkzS4vwjcswEg

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNBbmp1SmlqaSIsInJvbGUiOiJhZG1pbiIsInRpbWVzdGFtcCI6IjIwMjItMTEtMTFUMTM6Mjc6NTAuNjQ5WiIsImlhdCI6MTY2ODE3MzI3MH0.cKbpYPlTejtixJWP1NbHNJYuORrm0iFA5L2E-cP84tA

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

//load the routes for product
    require('./routes/product.routes')(app);    

//load the routes for orders
    require('./routes/order.routes')(app);  
    
// set up a default route for / 
    app.get("/", (req, res) => {
        res.json({ message: "Upgrad Eshop application" });
    });

// set port for the web server and listen for requests
    const PORT = process.env.PORT || 8085;
        app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });

    module.exports = {app}