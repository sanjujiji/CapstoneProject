const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const { app } = require("../server");
const { mongoose } = require("../models/index");

describe("Testing the upgrad eshop application endpoints for products", function () {
    it("Testing 1st testcase, Trying to get the complete list of products ", async () => {
      await request(app)
        .get("/products")
        // .send({ emailid: "sanjujoykutty@gmail.com"})
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("OK");
        });
    });

    it("Testing 2nd testcase,  Trying to get the list of product categories", async () => {
      await request(app)
        .get("/products/categories")
        // .send({ emailid: "sanju1joykutty@gmail.com"})
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("OK");
        });
    });
  
    
    it("Testing 3rd testcase, Trying to get product details for a given id ", async () => {
      await request(app)
        .get("/products")
        .send({
            "id"   : '1'
        })
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("OK");
        });
    });

    it("Testing 4th testcase, Trying to add a  new product by a normal user ", async () => {
        await request(app)
          .post("/products")
          .set({ "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwidGltZXN0YW1wIjoiMjAyMi0xMS0xOFQxMzoxMzoyNy40MTNaIiwiaWF0IjoxNjY4Nzc3MjA3LCJleHAiOjE2Njg4NjM2MDd9.RNCRi9JH99POwSPjjDuwxXmv9bzXmszAY_M1CZT-Y3M" })
          .send({
              "name"            : 'newProduct',
              "availableItems"  : "120",
              "price"           :  "1500",
              "category"        : "Electronics",
              "phoneNo"         : "9869681234",
              "imageURL"        : "image URL",
              "manufacturer"    : "Samsung",
              "description"     : "Samsung has been around for years in the field of communication. This is one of its best products"
  
          })
          .then((response) => {
            expect(response.res.statusMessage).to.be.equal("Unauthorized");
          });
      });

      it("Testing 5th testcase, Trying to add a  new product by admin user ", async () => {
        await request(app)
          .post("/products")
          .set({ "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwidGltZXN0YW1wIjoiMjAyMi0xMS0xOFQxMzoxMzoyNy40MTNaIiwiaWF0IjoxNjY4Nzc3MjA3LCJleHAiOjE2Njg4NjM2MDd9.RNCRi9JH99POwSPjjDuwxXmv9bzXmszAY_M1CZT-Y3M" })
          .send({
              "name"            : 'newProduct',
              "availableItems"  : "120",
              "price"           :  "1500",
              "category"        : "Electronics",
              "phoneNo"         : "9869681234",
              "imageURL"        : "image URL",
              "manufacturer"    : "Samsung",
              description       : "Samsung has been around for years in the field of communication. This is one of its best products"
  
          })
          .then((response) => {
            expect(response.res.statusMessage).to.be.equal("OK");
          });
      });

      it("Testing 6th testcase, Trying to update the product by admin user ", async () => {
        await request(app)
          .put("/products")
          .set({ "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwidGltZXN0YW1wIjoiMjAyMi0xMS0xOFQxMzoxMzoyNy40MTNaIiwiaWF0IjoxNjY4Nzc3MjA3LCJleHAiOjE2Njg4NjM2MDd9.RNCRi9JH99POwSPjjDuwxXmv9bzXmszAY_M1CZT-Y3M" })
          .send({
              "name"            : 'newProduct',
              "availableItems"  : "120",
              "price"           :  "1500",
              "category"        : "Electronics",
              "phoneNo"         : "9869681234",
              "imageURL"        : "image URL",
              "manufacturer"    : "Samsung",
              productId         : 6
  
          })
          .then((response) => {
            expect(response.res.statusMessage).to.be.equal("OK");
          });
      });

      it("Testing 7th testcase, Trying to delete the product by admin user ", async () => {
        await request(app)
          .delete("/products")
          .set({ "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwidGltZXN0YW1wIjoiMjAyMi0xMS0xOFQxMzoxMzoyNy40MTNaIiwiaWF0IjoxNjY4Nzc3MjA3LCJleHAiOjE2Njg4NjM2MDd9.RNCRi9JH99POwSPjjDuwxXmv9bzXmszAY_M1CZT-Y3M" })
          .send({
              "name"            : 'newProduct',
              "availableItems"  : "120",
              "price"           :  "1500",
              "category"        : "Electronics",
              "phoneNo"         : "9869681234",
              "imageURL"        : "image URL",
              "manufacturer"    : "Samsung",
              productId         : 6
  
          })
          .then((response) => {
            expect(response.res.statusMessage).to.be.equal("OK");
          });
      });
  });