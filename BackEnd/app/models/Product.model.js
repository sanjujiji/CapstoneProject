//This is being built as part of the Capstone project
//Schema for the Product Collection
//Date :- 9th Nov'22

module.exports = mongoose => {
    const Product = mongoose.model("eshop_product",mongoose.Schema({

        name            : {type : String},
        category        : {type : String},
        manufacturer    : {type : String},
        available_items : {type : Number},
        price           : {type : Number},
        image_url       : {type : String},
        description     : {type : String},
        created         : {type : Date},
        updatedAt       : {type : Date},
        createdAt       : {type : Date}

    }));
    return Product;
}