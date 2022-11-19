//This is being built as part of the Capstone project
//Authorization will authorize the user for access to various endpoints
//Date :- 12th Nov'22

const status = require("http-status-codes");
const jwt = require('jsonwebtoken');

    module.exports = (req,res,next) => {
        var authToken = req.headers["x-auth-token"] ||  req.headers["authorization"];
        var decodedRole;
        var message = "Please Login first to access this endpoint";
        if (!authToken){
            res.status(status.StatusCodes.UNAUTHORIZED).json({message : message});
            return;
        }
        else {
            //check if it is a valid auth token
            const secretKey = "eshopUpgrad";
            message = "You are not authorized to access this endpoint!";
            jwt.verify(authToken,secretKey,(err,decoded) => {
                if (decoded){
                    decodedUserName = decoded.username;
                    decodedRole = decoded.role;
                    if (decodedRole.toUpperCase() != 'USER'){
                        res.status(status.StatusCodes.UNAUTHORIZED).json({message : message});
                        return;
                    }
                    else {
                        next();
                    }
                }
                else {
                        res.status(status.StatusCodes.UNAUTHORIZED).json({message : message});
                        return;
                }
            });
        }
    }