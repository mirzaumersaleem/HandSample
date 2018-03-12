var passport = require('passport');
var User = require('../models/user');

//import the local strategy
var localStrategy = require('passport-strategy').Strategy;

//Passport will serialize a unique session with the user id from which the request has been made
//Serialize the session by user id
//Done is a callback function
passport.serializeUser(function(user, done){
    done(null, user.id);
})

//Always define the opposite
passport.deserializeUser(function(id, done){
    
    user.findById(id, function(err, user){
        done(err, user);
    });
 
});


passport.use('local-register', new localStrategy({
    userNameField: 'email',
    passwordFiled: 'password',
    passReqToCallback: true
}, function(username, password, done){
    console.log("\n\n\n\nInside passport.js\n\n\n");
    
    //Server side validation of registration form
    req.checkBody("name", "Enter name").exists();
    req.checkBody("mobile", "Mobile number must be digits and cannot be null").isLength({min:1});
    req.checkBody("fax", "Number must be digits and cannot be null").notEmpty();
    req.checkBody("email", "Enter a valid email").isEmail();
    req.checkBody("password", "Password field cannot be empty").notEmpty();
    
    var errors = req.validationErrors();

    if(errors){

    }

    var user = new User(); 

    user.findByEmail(username, function(err, resultUser){
    
        if(err){
            return done(null, false);
        }

        if(resultUser){
            return done(null, false, {message: "Email id already in use"});
        }

        var newUser = {
                name: req.body.name,
                mobile: req.body.mobile,
                fax: req.body.fax,
                email: req.body.email,
                password: req.body.password,
                company: req.body.company,
                companyNumber: req.body.companyNumber
        }        

        //Creating new user
        user.setNewUser(newUser, function(err, result){
            if(err){
                return done(err);
            } else{
                //Callback function returned with the new user created
                return done(null, result);
            }

        })
    });
    
}));