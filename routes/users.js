'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userController = require('../controllers/userController');
var User = require('../models/user');

var Product = require('../models/product');
// var nexmo = new Nexmo({
//     apiKey: '7509c640',
//     apiSecret: '1DfIoQeZRcWpopSI',
//   });
  

router.post('/pushNotification', function(req, res){
    req.checkBody("email").notEmpty();
    
    userController.pushNotification(req, res);
});
/* GET users listing. */
router.get('/register', function (req, res) {
    res.render('signup', {});
});

router.post('/register', function(req, res, next){
    console.log("Request Recieved");
    req.checkBody("name","Enter a valid user name").matches(/^[a-zA-Z\s]*$/).notEmpty();
    req.checkBody("password","Enter a valid password").notEmpty();
    req.checkBody("confirm_password","Enter a valid password").notEmpty();
    req.assert("email","Enter a valid email").isEmail().notEmpty();
    req.assert("phone_number","Enter a valid phone number").matches(/^[0-9]*$/);
    req.assert("identity_number","Enter a valid Identity Number").matches(/^[0-9]*$/);
    req.checkBody("city","Enter a valid City name").matches(/^[a-zA-Z\s]*$/).notEmpty();
    req.checkBody("address","Enter a valid Address").notEmpty();
    var error = req.validationErrors(true);
    var errorValues = Object.keys(error);
    console.log("error length " + errorValues.length);

    if(errorValues.length > 0){
        console.log("inside if");
        return res.json({
            status: 422,
            message: "Validation errors",
            errors: error
        });
    }
    else{
        passport.authenticate('local-register', function(err, user, info){
            console.log("Inside user-register post route");  
                if(err){
                    return res.json({
                        status:501,
                        message: err+"yhn error arha hai "
                    });
                }
                if (!user) { 
                    return res.json({
                        status:502,
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
                        message: "User successfully registered ",
                        user: user
                    })
                });
            })(req, res, next);
    }

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
router.post('/signin', function(req, res, next){
    req.assert("password", "Password field cannot be empty").notEmpty();
    req.assert("email", "Enter a valid email").isEmail().notEmpty();
    req.checkBody("mobile_id");
    var error = req.validationErrors(true);
    var errorValues = Object.keys(error);
    console.log("error length " + errorValues.length);
    if(errorValues.length > 0){
        console.log("inside if");
        return res.json({
            status: 422,
            message: "Validation errors",
            errors: error
        });
    }
    else{
        passport.authenticate('local-signin', function(err, user, info){
            console.log("Authentication");
            if (err) {
                console.log("Inside first if");
                return res.json({
                    status: 501,
                    message: err + "error hai yhn"
                });
            }
            if (!user) {
                console.log("Inside second if");
                return res.json({
                    status: 502,
                    message: info.message
                });
            }
            req.logIn(user, function(err1){
                if(err1){
                    console.log("Inside error");
                    return res.json({
                        status: 503,
                        message: err1
                    });
                }
                userController.setMobileId(req, res);
                return res.json({
                    status:200,
                    message: "Successful login",
                    user: req.user  
                })
            });
        })(req, res, next);
    }
});
router.get('/logout', function(req, res){
    req.logout();
    res.json({
        status:200,
        message: "User logged out successfully"
    });
});
router.get('/addresses', isLoggedIn, function(req, res){
    userController.getUserAddressController(req, res);    
});
router.post('/addresses', isLoggedIn, function(req, res){
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

router.post('/verify', (req, res) => {
    // Checking to see if the code matches
    let pin = req.body.pin;
    let requestId = req.body.requestId;
  
    nexmo.verify.check({request_id: requestId, code: pin}, (err, result) => {
      if(err) {
        res.json({message: 'Server Error'});
      } else {
        console.log(result);
        if(result && result.status == '0') {
          res.json({message: 'Account verified! 🎉'});
        } else {
          res.json({message: result.error_text, requestId: requestId});
        }
      }
    });
  });

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.json({
            status: 200,
            message: "User must be logged in"
        });
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
