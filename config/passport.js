var passport = require('passport');
var User = require('../models/user');
var moment = require('moment');
var encrypt = require("../models/encryption");

//import mail class to send verification code using mail
var Mail = require('../models/mail');
//import the local strategy
var localStrategy = require('passport-local').Strategy;

//Passport will serialize a unique session with the user id from which the request has been made
//Serialize the session by user id
//Done is a callback function
passport.serializeUser(function (user, done) {
    done(null, user.id);
})

//Always define the opposite
passport.deserializeUser(function (id, done) {
    var user = new User();
    user.findById(id, function (err, user) {
        done(err, user[0]);
    });
});

passport.use('local-register', new localStrategy({
    usernameField: 'email',
    passwordFiled: 'password',
    passReqToCallback: true
}, function (req, username, password, done) {
    console.log("inside errors1");
    req.checkBody("name", "Enter a valid user name").matches(/^[a-zA-Z\s]*$/).notEmpty();
    req.checkBody("password", "Enter a valid password").notEmpty();
    req.checkBody("confirm_password", "Enter a valid password").notEmpty();
    req.assert("email", "Enter a valid email").isEmail().notEmpty();
    req.assert("phone_number", "Enter a valid phone number").matches(/^[0-9]*$/);
    req.assert("identity_number", "Enter a valid Identity Number ").matches(/^[0-9]*$/);
    req.assert("pin_code", "Enter a valid pin code (digits only) ").matches(/^[0-9]*$/);
    req.assert("postal_code", "Enter a valid postal code ").matches(/^[0-9]*$/);
    req.checkBody("city", "Enter a valid City name").matches(/^[a-zA-Z\s]*$/).notEmpty();
    req.checkBody("country", "Enter a valid Country name").matches(/^[a-zA-Z\s]*$/).notEmpty();
    req.checkBody("address", "Enter a valid Address").notEmpty();
    // req.assert("companyNumber","Enter a valid company number").matches(/^[0-9]*$/);
    // req.assert("company","Enter a valid company name").matches(/^[a-zA-Z\s]*$/).notEmpty();    console.log("Inside errors2");
    var error = req.validationErrors(true);
    var errorValues = Object.keys(error);
    console.log("error length " + errorValues.length);
    if (errorValues.length > 0) {
        console.log("inside if");
        done(null, false, { message: [422, error] });
    }
    else {
        console.log("In else passport ")
        var user = new User();
        user.findByEmail(req.body.email, function (err, resultUser) {
            if (err) {
                console.log("error agaya", err);
                return done(err);
            }
            if (resultUser.length === 1) {
                return done(null, false, { message: "Email id already in use" });
            }
            //Generate a random number between 1 and 10000 and assign it as a verification
            // var verificationCode = Math.floor((Math.random() * 10000) + 1); 
            //Data of the new user
            var newUser = {
                name: req.body.name,
                mobile: req.body.mobile,
                phone_number: req.body.phone_number,
                email: req.body.email,
                password: user.generatePasswordHash(req.body.password),
                address: req.body.address,
                city: req.body.city,
                identity_number: req.body.identity_number,
            }
            var bankUser = {
                name: req.body.name,//
                phone_number: req.body.phone_number,//
                email: req.body.email,//
                password: user.generatePasswordHash(req.body.password),//
                postal_code: req.body.postal_code,//
                address: req.body.address,//
                country: req.body.country,//
                city: req.body.city,//
                customer_type: 1,//
                status: 1,//
                secret_password: req.body.pin_code,//
                remember_token: null,//
                identity_number: req.body.identity_number,//
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),//
                created_at: moment().format('YYYY-MM-DD HH:mm:ss')//
            }
            //Creating new user
            user.setNewUser(newUser, async function (err, newAddedUser) {
                if (err) {
                    console.log("There is an error ");
                    console.log(err);
                    done(err);
                } else {
                    //Callback function returned with the new user created
                    console.log(newAddedUser);
                    console.log("Inside else block");
                    var bankUsers = await user.setBankUser(bankUser);

                    //Creating account table at the time of registration 
                    var accountTable = {
                        customer_id: bankUsers.insertId,
                        balance: encrypt.encrypt(0),
                        account_no: bankUsers.insertId * 543123,
                        status: 1,
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                        created_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }


                    var accountTables = await user.setAccountTable(accountTable);
                    //Send verification code in email after the user is created
                    //var mail = new Mail();
                    //var emailContent = "Welcome to Sadaliah. Please user the following verification code = " + verificationCode +
                    //          " on your next login. Thanks";
                    //Instantiating mail transporter that will send mail to customers
                    //var transporter = mail.getTransporter("gmail", "sadaliahiksaudi@gmail.com", "SadaliaH789");
                    //Sending mail using the instantiated transporter
                    //mail.sendMail(newUser.email, "sadaliahiksaudi@gmail.com", "Sadaliah Verification Code", emailContent, transporter);
                    //Set the authentication to false since user has to verify it registration
                    //done(null, false);
                    /*      res.json({
                                status: 200,
                                message: "User registered successfully.\nA verification code has been sent to email " + newUser.email
                            })*/
                    // return done(null, false);
                    done(null, newAddedUser[0]);
                }

            })
        });
    }
}));
passport.use('local-signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, username, password, done) {
        console.log("Inside passport Strategy");

        var user = new User();
        user.findByEmail(username, function (err, result) {

            if (err) {
                console.log(err);
                return done(err);
            }
            console.log("executed tille here");
            if (result.length == 0) {
                console.log("No user found");
                return done(null, false, { message: "No user found" });
            }
            if (!user.validPassword(password, result[0].password)) {
                console.log("password", password, "checking Password", result[0].password)
                console.log("Incorrect password entered");
                return done(null, false, { message: "Incorrect password" });
            }
            console.log("Every thing is correct in signin");
            done(null, result[0]);
        });
    }));
