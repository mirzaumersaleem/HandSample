var passport = require('passport');
var User = require('../models/user');

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
    req.assert("mobile", "Enter a valid mobile no").matches(/^[0-9]*$/);
    req.assert("identity_number", "Enter a valid Identity Number ").matches(/^[0-9]*$/);
    req.checkBody("district", "Enter a valid District name").matches(/^[a-zA-Z\s]*$/).notEmpty();
    req.checkBody("city", "Enter a valid City name").matches(/^[a-zA-Z\s]*$/).notEmpty();
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
                console.log("error agaya",err);
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
                district: req.body.district,
                address: req.body.address,
                city: req.body.city,
                note: req.body.note,
                identity_number: req.body.identity_number,
            }
            //Creating new user
            user.setNewUser(newUser, function (err, newAddedUser) {
                if (err) {
                    console.log("There is an error ");
                    console.log(err);
                    done(err);
                } else {
                    //Callback function returned with the new user created
                    console.log(newAddedUser);
                    console.log("Inside else block");
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
        console.log("Inside passport Strategy",username);
       var user = new User();
        if (errorValues.length > 0) {
            console.log("inside if");
            return done(null, false, { message: [422, error] });
        }
        user.findByEmail(username, function (err, result) {
            if (err) {
                console.log("error aya findbyEmail sy"+err);
                return done(err);
            }
            if (result[0].id === null) {
                console.log("No user found");
                return done(null, false, { message: "No user found" });
            }
            if (!user.validPassword(req.body.password, result[0].password)) {
                console.log("Incorrect password entered");
                return done(null, false, { message: "Incorrect Password" });
            }
            console.log("Every thing is correct in signin");
            return done(null, result[0]);
        });
       
    }));
