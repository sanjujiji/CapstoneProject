//This is being built as part of the Capstone project
//Schema for the Address Collection
//Date :- 9th Nov'22

const { ObjectID } = require("bson");

module.exports = mongoose => {
    const Address = mongoose.model("eshop_shipping_address",mongoose.Schema({

        city            : {type : String},
        landmark        : {type : String},
        name            : {type : String},
        contactNumber   : {type : String},
        state           : {type : String},
        street          : {type : String},
        zipCode         : {type : Number},
        user            : {type : ObjectID} 

    }));
    return Address;
}