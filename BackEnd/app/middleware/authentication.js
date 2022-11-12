//This is being built as part of the Capstone project
//Authentication will authenticate the user for access to various endpoints
//Date :- 11th Nov'22

const status = require("http-status-codes");
const jwt = require('jsonwebtoken');

    module.exports = (req,res,next) => {
        var authToken = req.headers["x-auth-token"];
        var message = "Please Login first to access this endpoint";
        if (!authToken){
            res.status(status.StatusCodes.UNAUTHORIZED).send({message : message});
            return;
        }
        else {
            //check if it is a valid auth token
                const secretKey = "eshopUpgrad";
                message = "You are not authorized to access this endpoint!";
                try{
                    jwt.verify(authToken,secretKey);
                    next();
                }
                catch(err)    
                {
                    res.status(status.StatusCodes.UNAUTHORIZED).send({message : message});
                    return;
                }
            }
        }