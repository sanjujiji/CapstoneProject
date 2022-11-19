const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const { app } = require("../server");
const { mongoose } = require("../models/index");

describe("Testing the upgrad eshop application endpoints", function () {
    it("Testing 1st testcase, Trying to login to the application as a normal user", async () => {
      await request(app)
        .post("/auth")
        .send({ email: "sanjujoykutty@gmail.com", password: "password" })
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("OK");
        });
    });

    it("Testing 2nd testcase, Trying to login to the application with an invalid mail id ", async () => {
      await request(app)
        .post("/auth")
        .send({ email: "sanjujoykutty1@gmail.com", password: "password" })
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("Bad Request");
        });
    });
  
    it("Testing 3rd testcase, Trying to register to the application as a new user ", async () => {
      await request(app)
        .post("/users")
        .send({ 
          first_name: "Tom",
          last_name : "Wellington",
          password  : "password1",
          email     : "tom.wellington@gmail.com",
          contact_number : "9999999999"           })
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("OK");
          console.log("res",response.res.statusCode);
        });
    });

    it("Testing 4th testcase, Trying to login to the application as an admin", async () => {
      await request(app)
        .post("/auth")
        .send({ email: "admin@upgrad.com", password: "password" })
        .then((response) => {
          expect(response.res.statusMessage).to.be.equal("OK");
        });
    });
  });