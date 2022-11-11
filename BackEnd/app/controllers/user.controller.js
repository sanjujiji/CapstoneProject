//This is being built as part of the Capstone project
//User.controller will contain the backend functionalities for the API endpoints related to the User
//Date :- 9th Nov'22
const status = require("http-status-codes");
const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//1. User registration
exports.signup = (req,res) => {
    //Below listed parameters will be required for user signup
    /*  1. First Name
        2. Last Name
        3. Password
        4. Email
        5. Contact Number
    */
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var passwordNew = req.body.password;
    var email = req.body.email;
    var contactNo = (req.body.contact_number);

    /*Check 1 : Basic validation to check if all the above mandatory parameters have been provided*/
    if (!firstName || !lastName || !passwordNew || !email || !contactNo){
        res.status(status.StatusCodes.BAD_REQUEST).json({message : "Please provide the First Name, Last Name, Password, Email and Contact No. to continue .."});
        return;
    }

    /*Check 2 : Check the email format : 
        1. Email format should be <part1>@<part2>.<part3>. If the format is not correct send the error message as "Invalid email-id format!"
        2. Email format :
            a. part1 & part2 should have atleast 1 character
               part3 should have atleast 2 characters and atmost 6 characters
            b. part1 and part2 can contain the following characters a-z, A-Z, 0-9, .(dot), _, -.
            c. part3 can contain the characters (a-z)

    */
        //Checking for the correct mail format
        var messageString = "Invalid email-id format!";
        if ((email.indexOf('@') === -1 ) || (email.indexOf('.') === -1)){
            res.status(status.StatusCodes.BAD_REQUEST).json({message : messageString});
            return;
        }
        else {
        //Checking for the no. of characters in part1, part2 and part3
            let emailPart1 = email.substring(0,email.indexOf('@'));
            let emailPart2 = email.substring(email.indexOf('@')+1,email.lastIndexOf('.'));
            let emailPart3 = email.substring(email.lastIndexOf('.')+1);
            let regExp = /^[a-zA-z0-9._-]+$/
            let regExp1 = /^[a-z]+$/
            
            if(emailPart1.length < 1 || emailPart2.length < 1 || emailPart3.length < 2 || emailPart3.length > 6) {
                res.status(status.StatusCodes.BAD_REQUEST).json({message : messageString});
                return; 
            }
            else if (( emailPart1.search(regExp) === -1) || (emailPart2.search(regExp) === -1)){
                res.status(status.StatusCodes.BAD_REQUEST).json({message : messageString});
                return; 
            }
            else if ((emailPart3.search(regExp1) === -1)){
                res.status(status.StatusCodes.BAD_REQUEST).json({message : messageString});
                return; 
            }
           
        }

        /*Check 3 : Check if the phone numbers contains only numbers and it should have exactly 10digits
        */
        let regExp2 = /^[0-9]+$/;
        if ((contactNo.search(regExp2) === -1) || (contactNo.length != 10)){
            var messageString = "Invalid contact number!";
            res.status(status.StatusCodes.BAD_REQUEST).json({message : messageString});
            return;
        }
        // res.status(status.StatusCodes.OK);
        // res.end();

        /*Check 4 : check if the email is already registered
        */
        var messageString = "Try any other email, this email is already registered!";
        const filter = {email : email}
        User.find(filter,(err,document) => {
            if(document.length > 0){
                res.status(status.StatusCodes.BAD_REQUEST).json({message : messageString});
                return;
            }
            else {
                //Store the user object in the database
                const rounds = 10;
                var hashPassword="";
                const name = firstName+" "+lastName;
                const username = firstName+lastName;
                //encrypt the password before storing in the database
                bcrypt.hash(passwordNew,rounds)
                    .then((hash) => {
                        hashPassword = hash;
                        console.log(hashPassword);
                        const userObj = new User({
                            isAdmin         : false,
                            created         : new Date(),
                            email           : email,
                            name            : name,
                            first_name      : firstName,
                            last_name       : lastName,
                            password        : hashPassword,
                            phone_number    : contactNo,
                            role            : 'user',
                            updated         : new Date(),
                            user_name       : username
                        });
                        userObj
                            .save(userObj)
                            .then(data => {
                                res.status(status.StatusCodes.OK).json(data);
                                return;
                            })
                            .catch(err => {
                                res.status(status.StatusCodes.INTERNAL_SERVER_ERROR).send("Unable to save the user!");
                                return;   
                            })
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
    }

    //2. User Login
    exports.login = (req,res) => {
        //Below listed parameters will be required for user login
        /*  1. Email
            2. Password
        */
        var passwordNew = req.body.password;
        var email = req.body.email;

        var messageString = "This email has not been registered!";
        const filter = {email : email}
        User.find(filter,(err,document) => {
            if(document.length === 0){
                res.status(status.StatusCodes.BAD_REQUEST).json({message : messageString});
                return;
            }
            else {
                var storedPassword = document[0].password;
                messageString = "Invalid Credentials!"; 
                             
                            bcrypt.compare(passwordNew,storedPassword)
                                .then((result) => {
                                    if (!result){
                                        res.status(status.StatusCodes.BAD_REQUEST).json({message : messageString});
                                        return;     
                                    }
                                    else {
                                        var userData  = {
                                            username : document[0].user_name,
                                            role : document[0].role,
                                            timestamp : new Date()
                                        };
                                        const secretKey = "eshopUpgrad";
                                        const algo = {algorithm : 'HS256'};
                                        const token = jwt.sign(userData,secretKey,algo );
                                        console.log(token);
                                        res.header('x-auth-token',token);
                                        const successResponse = {
                                            email : email,
                                            name : document[0].name,
                                            isAuthenticated : true
                                        }
                                        res.status(status.StatusCodes.OK).send(successResponse);
                                        return;
                                    }
                                })  
                }
        })
    }