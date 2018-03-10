var passport = require('passport');
var user = require('../models/user');

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
    passwordFiled: 'password'
}, function(username, password, done){
    console.log("\n\n\n\nInside passport.js\n\n\n");
    User.findOne({'emailAddress':username}, function(err, user){
        if(err){
            return done(null, false);
        }
        if(user){
            return done(null, false, {message:"Email is already in use"});
        }

        var newUser = new User();
        newUser.emailAddress = username;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });

    });
    
}));