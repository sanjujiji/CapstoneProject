//This is being built as part of the Capstone project
//Schema for the Address Collection
//Date :- 9th Nov'22


const { ObjectID } = require("bson");
const { CREATED } = require("http-status-codes");

module.exports = mongoose => {
    const Address = mongoose.model("eshop_shipping_address",mongoose.Schema({

        addressId       : {type : Number},
        city            : {type : String},
        landmark        : {type : String},
        name            : {type : String},
        contactNumber   : {type : String},
        state           : {type : String},
        street          : {type : String},
        zipCode         : {type : Number},
        user            : {type : ObjectID},
        created         : {type : Date},
        updated         : {type : Date}

    }));
    return Address;
}