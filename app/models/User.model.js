//This is being built as part of the Capstone project
//Schema for the User Collection
//Date :- 9th Nov'22


module.exports = mongoose => {

    const User = mongoose.model("eshop_user",mongoose.Schema({
        isAdmin         : {type : Boolean},
        created         : {type : Date},
        email           : {type : String},
        name            : {type : String},
        first_name      : {type : String},
        last_name       : {type : String},
        password        : {type : String},
        phone_number    : {type : String},
        role            : {type : String},
        updated         : {type : Date},
        user_name       : {type : String}
    }));
    return User;
}