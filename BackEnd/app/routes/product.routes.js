//This is being built as part of the Capstone project
//Product.Routes will contain the API endpoints related to products
//Date :- 11th Nov'22


module.exports = app => {
    var router = require("express").Router();
    const authentication = require('../middleware/authentication');
    const authorization = require('../middleware/authorization');

    //require the specific controller file
    var product = require("../controllers/product.controller");

    //1. Route for searching products
    router.get("/products",product.getProduct);

    //2. Route for getting product categories
    router.get("/products/categories",product.getCategories);

    //3.Route for getting product by product id
    router.get("/products/:id",product.getProductById);

    //4.Route for adding products
    router.post("/products",authorization,product.addProduct);

    //5.Route for updating product details
    router.put("/products/:id",authorization,product.update);

    //6.Route for deleting products
    router.delete("/products/:id",authorization, product.delete);

    //All APIs would start with '/'
    app.use('/', router);

}