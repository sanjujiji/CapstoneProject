//This is being built as part of the Capstone project
//Schema for the Product Collection
//Date :- 9th Nov'22

module.exports = mongoose => {
    const Product = mongoose.model("eshop_product",mongoose.Schema({

        productId       :   {type : Number},
        name            :   {type : String},
        category        :   {type : String},
        manufacturer    :   {type : String},
        availableItems  :   {type : Number},
        price           :   {type : Number},
        imageURL        :   {type : String},
        description     :   {type : String},
        created         :   {type : Date},
        updatedAt       :   {type : Date},
        createdAt       :   {type : Date}

    }));
    return Product;
}