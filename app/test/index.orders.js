const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const { app } = require("../server");
const { mongoose } = require("../models/index");

describe("Testing the upgrad eshop application endpoints for orders", function () {
    
    it("Testing 1st testcase, Trying to add a  new order ", async () => {
      await request(app)
        .post("/orders")
        .set({ "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNBbmp1SmlqaSIsInJvbGUiOiJ1c2VyIiwidGltZXN0YW1wIjoiMjAyMi0xMS0xOFQxMTo0MDoyMy4wMDFaIiwiaWF0IjoxNjY4NzcxNjIzLCJleHAiOjE2Njg4NTgwMjN9.1TkLZyk1DMuUwselFwITaCmvAE6Qn-EIimbDV0IqUdE" })
        .send({
            "productId"   : '60bd4f9785222041687c803e',
            "addressId"   : "60bde6ae2e73e63128ec60d7",
            "quantity"    :  "4"
        })
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("OK");
        });
    });
  
  });