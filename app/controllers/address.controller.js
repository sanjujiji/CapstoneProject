//This is being built as part of the Capstone project
//address.controller will contain the backend functionalities for the API endpoints related to the shipping addresses
//Date :- 10th Nov'22
const status = require("http-status-codes");
const db = require('../models');
const address = db.Address;
const user = db.User;
const jwt = require('jsonwebtoken');


exports.add = (req,res) => {
//Access to this endpoint requires authentication
/*Check 1 : Following parameters are requested from the user :
    a. Access token (String --> as part of request header)
    b. Zip Code - String
    c. State - String
    d. Street - String
    e. Landmark (Optional) - String
    f. City - String
    g. Phone No. - String
    h. Name - String
*/
    var authToken = req.headers["x-auth-token"] ||  req.headers["authorization"];
    var zipCode = req.body.zipCode;
    var state = req.body.state;
    var street = req.body.street;
    var landmark = req.body.landmark ? req.body.landmark : "";
    var city = req.body.city;
    var contactNo = req.body.phoneNo;
    var name = req.body.name;
    
        var message;
        const secretKey = "eshopUpgrad";
        var promiseUserCheck = new Promise((resolve,reject) => {
            jwt.verify(authToken,secretKey,(err,decoded) => {
                if (decoded){
                    decodedUserName = decoded.username;
                    resolve();
                }
                else {
                    reject();
                    
                }
            });
        });

        promiseUserCheck
            .then(() => {
                //Mandatory input parameters check
                message = "Please provide the Zipcode, State, Street, City, Phone Number and Name to continue...";
                if (!zipCode || !state || !street || !city || !contactNo || !name){
                    res.status(status.StatusCodes.BAD_REQUEST).send({message : message});
                    return;
                }

                //Check if the zipcode is in the correct format i.e. number of digits should be 6 and should contain only digits
                var regExp = /^[0-9]+$/;
                message = "Invalid zip code!";
                if ((zipCode.search(regExp) === -1) || (zipCode.length != 6)){
                    res.status(status.StatusCodes.BAD_REQUEST).json({message : message});
                    return;
                }

            //Check if the phone number is in the correct format i.e. number of digits should be 10 and should contain only digits
                if ((contactNo.search(regExp) === -1) || (contactNo.length != 10)){
                    var messageString = "Invalid contact number!";
                    res.status(status.StatusCodes.BAD_REQUEST).json({message : messageString});
                    return;
                }

            //Add the object to the address collection if all the conditions are passing
            var userObject;
            var promise = new Promise((resolve,reject) => {
                var filter = {user_name : decodedUserName};
                user.find(filter,(err,document) => {
                    if (document.length > 0){
                        userObject = document[0];
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            });

            promise.
                then(() => {
                //get maxOrderid to increment it by 1
                var maxAddressId = 0;
                var promiseAdd = new Promise((resolve,reject) => {
                    address.find({},{addressId : 1, _id:0},(err,results)=>{
                        if (results.length > 0){
                            maxAddressId = results[0].addressId;
                            maxAddressId += 1;
                            resolve();
                        }
                        else if (results.length === 0) {
                            maxAddressId = 1;
                            resolve();
                        }
                        else {
                            reject();
                        }
                    }).sort({addressId : -1}).limit(1)
                });

                promiseAdd
                .then(()=>{
                    var addressObj = new address({
                        addressId       : maxAddressId,
                        city            : city,
                        landmark        : landmark,
                        name            : name,
                        contactNumber   : contactNo,
                        state           : state,
                        street          : street,
                        zipCode         : zipCode,
                        user            : userObject._id,
                        created         : new Date(),
                        updated         : new Date()
                    });

                    addressObj
                        .save(addressObj)
                            .then(data => {
                                //build the response object
                                var messageObj = {
                                    "_id"           :   data._id,
                                    "name"          :   data.name,
                                    "contactNumber" :   data.contactNumber,
                                    "street"        :   data.street,
                                    "landmark"      :   data.landmark,
                                    "city"          :   data.city,
                                    "state"         :   data.state,
                                    "zipcode"       :   data.zipCode,
                                    "createdAt"     :   data.created,
                                    "updatedAt"     :   data.updated,
                                    "user"          : {
                                        "_id"           :   userObject._id,
                                        "password"      :   userObject.password,
                                        "firstName"     :   userObject.first_name,
                                        "lastName"      :   userObject.last_name,
                                        "email"         :   userObject.email,
                                        "contactNumber" :   userObject.phone_number,
                                        "role"          :   userObject.role,
                                        "createdAt"     :   userObject.created,
                                        "updatedAt"     :   userObject.updated

                                    }
                                }
                                res.status(status.StatusCodes.OK).json(messageObj);
                                return;
                            })
                    .catch(err => {
                        message = "Unable to save the address!";
                        res.status(status.StatusCodes.INTERNAL_SERVER_ERROR).json({message : message});
                        return;   
                    })
                })
                .catch(() => {
                    message = "Internal Server Error";
                    res.status(status.StatusCodes.INTERNAL_SERVER_ERROR).json({message : message});
                    return;    
                })
            })
            .catch(() => {
                message = "Internal Server Error";
                res.status(status.StatusCodes.INTERNAL_SERVER_ERROR).json({message : message});
                return; 
            });
            })
            .catch(() => {
                message = "Invalid User!";
                res.status(status.StatusCodes.UNAUTHORIZED).json({message : message});
                return;
            })
}

//Get the list of product
exports.getAddress = (req,res) => {
    /*Check 1 : Below are the list of parameters that should be provided by the user
        1. emailId - String
      
    */    
    var emailId = req.query.emailid ;
    //Get the list of addresses based on the requested parameters

    var filter = {email : {'$regex':email,'$options':'i'}};
    var userObj = "" ;   

    var promise = new Promise((resolve,reject) => {
        user.find(filter,(err,document) => {
            if (document.length > 0){
                userObj = document;
                resolve();
            }
            else {
                reject();
            }
        })
    });
    promise.
        then(() => {
            //get the list of addresses based on the object id
            filter = {"user" : userObj[0]._id}
            var addrObj=[{}];
            var promiseAddr = new Promise((resolve,reject) => {
                address.find(filter,(err,document) => {
                    if (document.length > 0){
                        addrObj = document;
                        resolve();
                    }
                    else {
                        reject();
                    }
                })
            });

            promiseAddr.then(() => {
                var responseObject = {content : addrObj};
                res.status(status.StatusCodes.OK).json(responseObject);
                return;
            })
            .catch(()=> {
                res.status(status.StatusCodes.OK).send({});
                return;
            })
        }).
        catch(() => {
            res.status(status.StatusCodes.OK).send({});
            return;
        })
}
