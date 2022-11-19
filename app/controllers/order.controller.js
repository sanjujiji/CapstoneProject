//This is being built as part of the Capstone project
//order.controller will contain the backend functionalities for the API endpoints related to Order
//Date :- 12th Nov'22
const status = require("http-status-codes");
const db = require('../models');
const orders = db.Orders;
const products = db.Product;
const address = db.Address;
const user = db.User;
const jwt = require('jsonwebtoken');

//add Orders
//Check 1 : Basic validation
exports.addOrders = (req,res) => {
    /*Below are the list of mandatory parameters that should come from the user :
        1. Product Id - Integer
        2. Address Id - Integer
        3. Access Token - String (as part of request header)
        4. Quantity - Number
    */
    var productId = req.body.productId;
    var addressId = req.body.addressId;
    var orderQuantity = req.body.quantity;

    var message = "Please enter ProductId, AddressId and OrderQuantity to continue..."
    if (!productId || !addressId || !orderQuantity){
        res.status(status.StatusCodes.BAD_REQUEST).json({message : message});
        return;
    }

    //Check 2 : If the product id is not valid send out a valid response
    //Check 3 : If the product quantity is not available send out a valid response
    var productObj;
    var addressObj;
    var userObj;
    var promise = new Promise((resolve,reject) => {
        var filter = {productId : productId};
        products.find(filter,(err,results) => {
            if (results.length > 0){
                productObj = results[0];
                //Check if the product is available
                if ( productObj.availableItems < orderQuantity ){
                    message = "Product with ID - <"+productId+"> is currently out of stock!"
                    reject();
                }
                else {
                    resolve();
                }
            }
            else {
                message = "No Product found for ID - <"+productId+">!";
                reject();
            }
        })
    });

    promise
        .then (() => {
            var promiseAdd = new Promise((resolve,reject) => {
                //Check 4: If the address id is not valid then send a valid response
                filter = {addressId : addressId};
                address.find(filter,(err,results) => {
                    if (results.length > 0){
                        addressObj = results[0];
                        resolve();
                    }
                    else {
                        message = "No Address found for ID - <"+addressId+">!";
                        reject();
                    }
                })
            });

            promiseAdd.
                then(() => {
                    var promiseUser = new Promise ((resolve,reject) => {
                        //Check 5 : Get the user from the access token
                        var authToken = req.headers["x-auth-token"];
                        var decodedUserName;
                        const secretKey = "eshopUpgrad";

                        jwt.verify(authToken,secretKey,(err,decoded) => {
                        if (decoded){
                            decodedUserName = decoded.username;
                        }
                        });

                        
                        filter = {user_name : decodedUserName};
                        
                        user.find(filter,(err,results) => {
                            if (results.length > 0){
                                userObj = results[0];
                                resolve();
                            }
                            else {
                                message = "Invalid User Name!";
                                reject();
                            }
                        })
                    });

                    promiseUser
                        .then(() => {
                            //store the order object in the database
                            //get maxOrderid to increment it by 1
                            var maxOrderId = 0;
                            var orderObj = {};
                            var orderDate = new Date();
                            var promiseOrder = new Promise((resolve,reject) => {
                                orders.find({},{orderId : 1, _id:0},(err,results)=>{
                                    if (results.length > 0){
                                        maxOrderId = results[0].orderId;
                                        maxOrderId += 1;
                                        resolve();
                                    }
                                    else if (results.length === 0){
                                        maxOrderId = 1;
                                        resolve();
                                    }
                                    else {
                                        reject();
                                    }
                                }).sort({orderId : -1}).limit(1)
                            });
                            promiseOrder.then(() => {
                                orderObj = new orders({
                                    orderId     : maxOrderId,
                                    address     : addressObj._id,
                                    product     : productObj._id,
                                    quantity    : orderQuantity,
                                    user        : userObj._id,
                                    order_date  : orderDate,
                                    amount      : productObj.price * orderQuantity
                                });
                          
                                orderObj.
                                    save (orderObj)
                                    .then((results) => {
                                        var responseObj = {
                                            "id"                :   results.orderId,
                                            "user"              :   userObj,
                                            "product"           :   productObj,
                                            "shippingAddress"   :   addressObj,
                                            "amount"            :   productObj.price * orderQuantity,
                                            "orderDate"         :   orderDate
                                        }
                                        res.status(status.StatusCodes.OK).json(responseObj);
                                        return;
                                    })
                                    .catch((err) => {
                                        message = "Unable to save Order. Internal server error!";
                                        res.status(status.StatusCodes.INTERNAL_SERVER_ERROR).json({message : message});
                                        return;
                                    })
                                .catch((err) => {
                                    message = "Internal Server Error!";
                                    res.status(status.StatusCodes.INTERNAL_SERVER_ERROR).json({message : message});
                                    return;
                                })
                            })
                        })
                        .catch(() => {
                            //This will throw an error if the username is not valid
                            res.status(status.StatusCodes.BAD_REQUEST).json({message : message});
                            return;
                        })
                })
                .catch(() => {
                    //This will throw an error if the address id was invalid
                    res.status(status.StatusCodes.BAD_REQUEST).json({message : message});
                    return;
                });
        })
        .catch(() => {
            //This would throw an error if no product Id was found or if the stock was below the required quantity
            res.status(status.StatusCodes.BAD_REQUEST).json({message : message});
            return;
        })
}