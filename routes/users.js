'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userController = require('../controllers/userController');
var User = require('../models/user');

var Product = require('../models/product');


/* GET users listing. */
router.get('/register', function (req, res) {
    res.render('signup', {});
});

router.post('/register', function(req, res, next){
    console.log("Inside user-register post route");
    passport.authenticate('local-register', function(err, user, info){
        if(err){
            res.json({
                status:500,
                message: err
            });
            return;
        }
        if (!user) { 
            return res.json({
                status:500,
                message: "Registration Failed. User with this email is already registered"
            });
        }

        return res.json({
            status:200,
            message: "Registered successfully. A confirmation code has been sent to your email"
        });
    })(req, res, next);
});

/*
router.post('/register', passport.authenticate('local-register',{
    successRedirect: '/users/verification',
    failureRedirect: '/users/verification',
    failureFlash: false
}));
*/
router.get('/signin', function(req, res){
    res.render('signin', {});
});

router.post('/signin', isVerified, function(req, res, next){
    passport.authenticate('local-signin', function(err, user, info){
        if (err) {
            return res.json({
                status: 500,
                message: err
            });
        }
        if (!user) {
            return res.json({
                status: 500,
                message: info.message
            });
        }

        req.logIn(user, function(err){
            if(err){
                return res.json({
                    status: 500,
                    message: err
                });
            }
            return res.json({
                status:200,
                message: "User successfully logged in"
            })
        });
    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logout();
    res.json({
        status:200,
        message: "User logged out successfully"
    });
});

router.get('/addresses', function(req, res){
    userController.getUserAddressController(req, res);    
});

router.post('/addresses', function(req, res){
    userController.addUserAddressController(req, res);
});


router.get('/forgot', function(req, res){
    res.render('forgetPasswordMain', {});
});

router.post('/forgot', function(req, res){
    userController.forgotPassController(req, res);
});

router.get('/reset/:id/:token', function(req, res){
    var user = new User();
    user.findById(id, function(err, resultUser){
        if(err)
            throw err;
        if(resultUser[0].resetPasswordToken != req.params.token) {
            res.json({
                status: 500,
                message: "Incorrect Token Entered"
            });
        }
        else if (resultUser[0].resetPasswordDate < Date.now()){
            res.json({
                status: 500,
                message: "Token has been expired"
            })
        } 
        else {
            res.redirect("/users/reset-password/" + resultUser[0].id + "/" + resultUser[0].resetPasswordToken);
        }
    });
});

router.get('/reset-password/:id/:token', function(req, res){
    var user = new User();
    user.findById(id, function(err, resultUser){
        if(err)
            throw err;
        if(resultUser[0].resetPasswordToken != req.params.token) {
            res.json({
                status: 500,
                message: "Incorrect Token Entered"
            });
        }
        else if (resultUser[0].resetPasswordDate < Date.now()){
            res.json({
                status: 500,
                message: "Token has been expired"
            })
        } 
        else {
            res.redirect("/users/reset-password/" + resultUser[0].id + "/" + resultUser[0].resetPasswordToken);
        }
    });
});

router.post('/reset-password/:id/:token', function(req, res){
    var user = new User();
    if((req.body.password == null) || (req.body.confirmPassword == null)){
        res.json({
            status: 500,
            message: "Password fields cannot be empty"
        })
    } 

    user.findById(id, function(err, userResult){
        if(err)
            throw err;
        var passwordHash = user.generatePasswordHash(req.body.password);
        user.setUserPassword(userResult[0].id, passwordHash, function(err, result){
            if(err)
                throw err;
            res.redirect("/users/sign")
        })        
    });
});

router.get('/verification', function(req, res){
    res.render('verification', {});
});

router.post('/verification', verificationMiddleWare, function(req, res, next){
    console.log("Inside verification post");
    passport.authenticate('local-signin', function(err, user, info){
        console.log("Inside passport authenticate callback");
        if (err) {
            return res.json({
                status: 500,
                message: err
            });
        }
        if (!user) {
            return res.json({
                status: 500,
                message: info.message
            });
        }

        req.logIn(user, function(err){
            if(err){
                return res.json({
                    status: 500,
                    message: err
                });
            }
            return res.json({
                status:200,
                message: "User successfully logged in"
            })
        });
    })(req, res, next);
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.redirect('/users/signin');
    }
}

function verificationMiddleWare(req, res, next){
    var email = req.body.email;
    var password = req.body.password;
    var verificationCode = req.body.code;

    var user = new User();
    user.findByEmail(email, function(err, userResult){
        console.log("The email entered " + email);
        if(err){
            res.json({
                status: 500,
                message: "Incorrect User Email"
            });
        }
        if(user.validPassword(req.body.password, userResult[0].password)){
            console.log("The user feteched " + userResult[0].id);
            console.log("Verification Code " + verificationCode);
            console.log("User database code " + userResult[0].verification_code);
            if(userResult[0].verification_code == verificationCode){
                console.log("Verification code is correct");
                console.log("Verification Status" + userResult[0].verification_status);
                user.updateVerificationStatus(userResult[0].id, true, function(err, result){
                    //After the verification status is set true
                    //Use the signin strategy for user login
                    if(err)
                        throw err;
                    console.log("Verification status updated");
                    next();
                });
                          
            }    
        } else {
            res.json({
                status: 500,
                message: "Incorrect Password"
            });
        }
        
    });
}

function isVerified(req, res, next){
    var user = new User();
    user.findByEmail(req.body.email, function(err, user){
        console.log("user retrieved in middleware");
        if(user[0].verification_status == true){
            next();
        }
        else{
            res.json({
                status:500,
                message: "User Not Verified"
            });
        }
    });
}

module.exports = router;
