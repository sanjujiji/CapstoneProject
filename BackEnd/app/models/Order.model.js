//This is being built as part of the Capstone project
//Schema for the Orders Collection
//Date :- 9th Nov'22

const { ObjectID } = require("bson");

module.exports = mongoose => {
    const Orders = mongoose.model("eshop_order",mongoose.Schema({

        orderId             : {type : Number},
        address             : {type : ObjectID},
        product             : {type : ObjectID},
        quantity            : {type : Number},
        user                : {type : ObjectID},   
        order_date          : {type : Date},
        amount              : {type : Number}

    }));
    return Orders;
}