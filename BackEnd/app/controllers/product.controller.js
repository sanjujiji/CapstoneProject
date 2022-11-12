//This is being built as part of the Capstone project
//product.controller will contain the backend functionalities for the API endpoints related to products
//Date :- 11th Nov'22
const status = require("http-status-codes");
const db = require('../models');
const products = db.Product;


//Get the list of product
exports.getProduct = (req,res) => {
    /*Check 1 : Below are the list of parameters that should be provided by the user
        1. Category - String
        2. Direction - String (Only ASC or DESC)
        3. name - String
        4. Sort By - String
    */    

    var productCategory = req.query.category ? req.query.category : "";
    var direction = req.query.direction ? req.query.direction : "DESC";
    var name = req.query.name ? req.query.name : "";
    var sortBy = req.query.sort ? req.query.sort : "productId" ;
    
    //Get the list of products based on the requested parameters

    var filter = {};
    var message;
    if (productCategory || name){
        filter['$and']=[];

        if (productCategory){
            filter['$and'].push({category : productCategory});
        };
        if (name){
            filter['$and'].push({name : name});
        };
    }
    let sortOrder;              
    if (direction === "ASC")
        sortOrder = 1;
    else
        sortOrder = -1;

    var productObj = "" ;   

    var promise = new Promise((resolve,reject) => {
        products.find(filter,(err,document) => {
            if (document.length > 0){
                productObj = document;
                resolve();
            }
            else {
                reject();
            }
        }).sort({[sortBy] : sortOrder})
    });
    promise.
        then(() => {
            //create the response object
            var responseObject = {content : productObj};
            res.status(status.StatusCodes.OK).json(responseObject);
            return;
        }).
        catch(() => {
            message = "No product fulfilled the search criteria!";
            res.status(status.StatusCodes.BAD_REQUEST).send({message : message});
            return;
        })
}

//Get the product categories
exports.getCategories = (req,res) => {
    var filter ={};
    var productObj;
    var promise = new Promise((resolve,reject) => {
        products.find(filter,{category : 1,_id : 0},(err,document) => {
            if (document.length > 0){
                productObj = document;
                resolve();
            }
            else {
                reject();
            }
        })
    });
    promise.
        then(() => {
            //create the response object
            var responseObject = productObj.map((el) => (el.category));
            res.status(status.StatusCodes.OK).json(responseObject);
            return;
        }).
        catch(() => {
            message = "No product categories found!"
            res.status(status.StatusCodes.BAD_REQUEST).send({message : message});
            return;
        })
}

//Get the product by product id
exports.getProductById = (req,res) =>{
    //Check if the mandatory parameter is available
    var productId = req.params.id;
    var message = "Please enter product Id to continue...";
    if (!productId) {
        res.status(status.StatusCodes.BAD_REQUEST).send({message : message});
        return;
    }
    else {
            var filter = {productId : productId};
            message = "No Product found for ID - <" + productId +">";
            products.find((filter),(err,document) => {
                if (document.length > 0 ){
                    res.status(status.StatusCodes.OK).json(document[0]);
                    return;
                }
                else {
                    res.status(status.StatusCodes.BAD_REQUEST).send({message:message});
                    return;
                }
            })
    }
}




//Add a new product
exports.addProduct = (req,res) => {
    //Get the below list of parameters from the user
    /*
    1. Name - String
    2. Available Items - Number
    3. Price - Number
    4. Category - String
    5. Description - String
    6. Image URL - String
    7. Manufacturer - String
    8. Access Token - String(as part of request header)
    */

    //Basic validation to check if all the required parameters have been provided
    var name = req.body.name;
    var availItems = req.body.availableItems;
    var price = req.body.price;
    var category = req.body.category;
    var description = req.body.description;
    var imageURL = req.body.imageURL;
    var manufacturer = req.body.manufacturer;
    
    var message = "Please provide the Product Name, Available Items, Price, Category, Description, Image URL and the manufacturer details to continue...";
    if (!name || !availItems || !price ||!category ||!description ||!imageURL ||!manufacturer){
        res.status(status.StatusCodes.BAD_REQUEST).send({message : message});
        return;
    }

     //get the maximum value of product id and increment it by 1 for generating the next product id
     var maxProductId = 0;
     var promise = new Promise((resolve,reject) => {
        products.find({},{productId:1,_id:0},(err,result) => {
            if (result.length > 0){
                maxProductId = result[0].productId;
                maxProductId += 1;
                resolve();
            }
            else {
                reject();
            }
        }).sort({productId : -1}).limit(1);
     });
     
     promise.
        then(() => {
            //create the product object
            var productObj = new products({
                "productId"     :   maxProductId,
                "name"          :   name,
                "category"      :   category,
                "manufacturer"  :   manufacturer,
                "availableItems":   availItems,
                "price"         :   price,
                "imageURL"      :   imageURL,
                "description"   :   description,
                "updatedAt"     :   new Date(),
                "createdAt"     :   new Date()
            });
            
            productObj
                .save(productObj)
                .then((results) => {
                    var responseObject = {
                        "productId"         :   results.productId,
                        "name"              :   results.name,
                        "category"          :   results.category,
                        "price"             :   results.price,
                        "description"       :   results.description,
                        "manufacturer"      :   results.manufacturer,
                        "availableItems"    :   results.availableItems,
                        "imageURL"          :   results.imageURL,
                        "createdAt"         :   results.createdAt,
                        "updatedAt"         :   results.updatedAt
                    };
                    res.status(status.StatusCodes.OK).json(responseObject);
                    return;
                })
                 .catch((err) => {
                    message = "Unable to save the product!";
                    res.status(status.StatusCodes.INTERNAL_SERVER_ERROR).send({message : message});
                    return; 
                }) ;
                })
                .catch((err) => {
                    message = "Unable to retrieve the product Id from the product collections!"
                    res.status(status.StatusCodes.INTERNAL_SERVER_ERROR).send({message : message});
                    return; 
                })
        };


//Update an existing product
exports.update = (req,res) => {
    //Get the below list of parameters from the user
    /*
    1. Name - String
    2. Available Items - Number
    3. Price - Number
    4. Category - String
    5. Description - String
    6. Image URL - String
    7. Manufacturer - String
    8. Access Token - String(as part of request header)
    9. Product id - (as part of URL)
    */
    // var authToken = req.headers["x-auth-token"];
    // var decodedRole;
    // var message = "Please Login first to access this endpoint";
    // if (!authToken){
    //     res.status(status.StatusCodes.UNAUTHORIZED).send({message : message});
    //     return;
    // }
    // else {
    //     //check if it is a valid auth token
    //     const secretKey = "eshopUpgrad";
    //     message = "You are not authorized to access this endpoint!";
    //     jwt.verify(authToken,secretKey,(err,decoded) => {
    //         if (decoded){
    //             decodedUserName = decoded.username;
    //             decodedRole = decoded.role;
    //             console.log(decodedRole);
    //             if (decodedRole.toUpperCase() != 'ADMIN'){
    //                 res.status(status.StatusCodes.UNAUTHORIZED).send({message : message});
    //                 return;
    //             }
    //         }
    //         else {
    //             res.status(status.StatusCodes.UNAUTHORIZED).send({message : message});
    //             return;
    //         }
    //     });
    // }

    //Basic validation to check if all the required parameters have been provided
    var name = req.body.name;
    var availItems = req.body.availableItems;
    var price = req.body.price;
    var category = req.body.category;
    var description = req.body.description;
    var imageURL = req.body.imageURL;
    var manufacturer = req.body.manufacturer;
    var productId = req.params.id;

    var message = "Please provide the Product Name, Available Items, Price, Category, Description, Image URL and the manufacturer details to continue...";
    if (!name || !availItems || !price ||!category ||!description ||!imageURL ||!manufacturer || !productId){
        res.status(status.StatusCodes.BAD_REQUEST).send({message : message});
        return;
    }

    //Check if the product id exists in the database
    var filter = {productId : productId};
    var promise = new Promise((resolve,reject) => {
        products.find(filter,(err,result) => {
            if (result.length > 0){
                resolve();
            }
            else {
                reject();
            }
        });
     });
     
     promise.
        then(() => {
            //update the product object
           
            var productObj = {
                
                "name"          :   name,
                "category"      :   category,
                "manufacturer"  :   manufacturer,
                "availableItems":   availItems,
                "price"         :   price,
                "imageURL"      :   imageURL,
                "description"   :   description,
                "updatedAt"     :   new Date()
            };
            //update the product
            products.findOneAndUpdate(filter,productObj,{new : true},(error,document) => {
                console.log("document",document);
                if (document){
                    res.status(status.StatusCodes.OK).json(document);
                    return;
                }
                else {
                    message = "Unable to update the product data!"
                    res.status(status.StatusCodes.BAD_REQUEST).send({message : message});
                    return;
                }
            })
                })
                .catch((error) => {
                    message = "No Product found for ID - <"+productId+">";
                    res.status(status.StatusCodes.BAD_REQUEST).send({message : message});
                    return;
            })
        };


        //Delete and existing product

    exports.delete = (req,res) => {
    //Get the below list of parameters from the user
    /*
    1. Access Token - String(as part of request header)
    2. Product id - (as part of URL)
    */
    // var authToken = req.headers["x-auth-token"];
    // var decodedRole;
    // var message = "Please Login first to access this endpoint";
    // if (!authToken){
    //     res.status(status.StatusCodes.UNAUTHORIZED).send({message : message});
    //     return;
    // }
    // else {
    //     //check if it is a valid auth token
    //     const secretKey = "eshopUpgrad";
    //     message = "You are not authorized to access this endpoint!";
    //     jwt.verify(authToken,secretKey,(err,decoded) => {
    //         if (decoded){
    //             decodedUserName = decoded.username;
    //             decodedRole = decoded.role;
    //             console.log(decodedRole);
    //             if (decodedRole.toUpperCase() != 'ADMIN'){
    //                 res.status(status.StatusCodes.UNAUTHORIZED).send({message : message});
    //                 return;
    //             }
    //         }
    //         else {
    //             res.status(status.StatusCodes.UNAUTHORIZED).send({message : message});
    //             return;
    //         }
    //     });
    // }

    //Basic validation to check if all the required parameters have been provided
    var productId = req.params.id;

    //Check if the product id exists in the database
    var filter = {productId : productId};
    var promise = new Promise((resolve,reject) => {
        products.find(filter,(err,result) => {
            if (result.length > 0){
                resolve();
            }
            else {
                reject();
            }
        });
     });
     
     promise.
        then(() => {
            //delete the product
            products.findOneAndDelete(filter,(error,document) => {
                if (document){
                    res.status(status.StatusCodes.OK).json(document);
                    return;
                }
                else {
                    message = "Unable to delete the product data!"
                    res.status(status.StatusCodes.BAD_REQUEST).send({message : message});
                    return;
                }
            })
                })
        .catch((error) => {
            message = "No Product found for ID - <"+productId+">";
            res.status(status.StatusCodes.BAD_REQUEST).send({message : message});
            return;
            })
        };