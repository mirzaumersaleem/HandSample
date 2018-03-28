var passport = require('passport');
var User = require('../models/user');

//import the local strategy
var localStrategy = require('passport-local').Strategy;


//Passport will serialize a unique session with the user id from which the request has been made
//Serialize the session by user id
//Done is a callback function
passport.serializeUser(function(user, done){
    done(null, user.id);
})

//Always define the opposite
passport.deserializeUser(function(id, done){
    var user = new User();
    user.findById(id, function(err, user){
        done(err, user[0]);
    });
});

passport.use('local-register', new localStrategy({
    usernameField: 'email',
    passwordFiled: 'password',
    passReqToCallback: true
}, function(req, username, password, done){
    
    var user = new User(); 

    user.findByEmail(username, function(err, resultUser){
    
        if(err){
            console.log(err);
            return done(err);
        }
        if(resultUser.length === 1){
            return done(null, false, {message: "Email id already in use"});
        }

        var newUser = {
                name: req.body.name,
                mobile: req.body.mobile,
                fax: req.body.fax,
                email: req.body.email,
                password: user.generatePasswordHash(req.body.password),
                company: req.body.company,
                companyNumber: req.body.companyNumber
        }        

        //Creating new user
        user.setNewUser(newUser, function(err, newAddedUser){
            if(err){
                console.log("err");
                return done(err);
            } else{
                //Callback function returned with the new user created
                console.log(newAddedUser);
                return done(null, newAddedUser[0]);
            }

        })
    });
    
}));

passport.use('local-signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, 
function(req, username, password, done){

    var user = new User();

    user.findByEmail(username, function(err, result){
        
        if(err){
            console.log(err);
            return done(err);
        } 
        if(result[0].id === null){
            return done(null, false, {message: "No user found"});
        }
        if(!user.validPassword(password, result[0].password)){
            return done(null, false, {message: "Incorrect Password"});
        }
        return done(null, result[0]);
    });

    }));