const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const { app } = require("../server");
const { mongoose } = require("../models/index");

describe("Testing the upgrad eshop application endpoints for shipping addresses", function () {
    it("Testing 1st testcase, Trying to get the address for a specific user ", async () => {
      await request(app)
        .get("/address")
        .send({ emailid: "sanjujoykutty@gmail.com"})
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("OK");
        });
    });

    it("Testing 2nd testcase,  Trying to get the address for a non registered user", async () => {
      await request(app)
        .get("/address")
        .send({ emailid: "sanju1joykutty@gmail.com"})
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("OK");
        });
    });
  
    
    
    it("Testing 3rd testcase, Trying to add a  new address ", async () => {
      await request(app)
        .post("/addresses")
        .set({ "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNBbmp1SmlqaSIsInJvbGUiOiJ1c2VyIiwidGltZXN0YW1wIjoiMjAyMi0xMS0xOFQxMDowMTo0My41ODJaIiwiaWF0IjoxNjY4NzY1NzAzLCJleHAiOjE2Njg4NTIxMDN9.s3JHryWllAaQpX-RsL874vlFbB22W6ncN3psG5lGJco" })
        .send({
            "zipCode"   : '000000',
            "state"     : "Maharashtra",
            "street"    :  "Kandivali",
            "city"      : "Mumbai",
            "phoneNo"   : "9869681234",
            "name"      : "Maha home"

        })
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("OK");
        });
    });
  });