var User = require('../models/user');
var Mail = require('../models/mail');
var crypto = require('crypto');
var moment = require('moment');
var customer = require("../models/customer");
exports.getRegisterController = function(req, res){
    res.render('signup', {});
}
 
exports.pushNotification = function (req, res){
    var customers = new customer();
    console.log("in pushNotification Controller");
    
    customers.getCustomerByEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in pushNotification: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){
                
                   var notify = await customers.pushNotify(result[0].mobile_id); 
                   res.json({
                    status: 200,
                    message: result
                });               
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}

exports.setMobileId = function (req, res){
    var customers = new customer();
    console.log("in addFriend Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getEmail(req,async function(result, err){
        console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in addFriend: "+err
            });
        } else{
           // console.log(result);
                if(result.length!=0){
                    var userObj =await customers.getCustomerByEmail(result);
                    var mobileId = await customers.addMobileId(req,userObj);
                    res.json({
                        status: 200,
                        message: "mobile_id added Successfully"
                    });          
            }else{
                res.json({
                    status: 301,
                    message: "No Customer found"
                });    
            }
        }
    });

}



exports.getUserAddressController = function(req, res){
    
    var user = new User();
    user.getUserAddresses(req.user.id, function(err, rows){
        console.log("Get address callback"); 
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else {
            res.json({
                status: 200,
                data: rows
            });
        }
    })
}

exports.addUserAddressController = function(req, res){
    var user = new User();
    
    var addressData = {
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        company:req.body.company,
        address_1:req.body.address_1,
        address_2:req.body.address_2,
        city:req.body.city,
        postal_code:req.body.postal_code,
        created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        user_id:req.user.id,
    }
    
    console.log("Printing req.user.id" + req.user.id);
    user.addUserAddress(req.user.id, addressData, function(err, result){
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else {
            res.json({
                status: 200,
                message: "Address added successfully"
            });
        }
    })
}


exports.forgotPassController = function(req, res){
    var user = new User();
    var userEmail = req.body.email;
    var mail = new Mail();
    var mailSubject = "";
    var mailText = "";

    //Fetch the user using email
    user.findByEmail(userEmail, function(err, userResult){
            if(err){
                res.json({
                    status: 500,
                    message: err
                });
                return;
            }
            //Generate Reset Password Token
            var resetPassToken = null;
            crypto.randomBytes(20, function(err, buff){
                resetPassToken = buff.toString('hex');
                var tokenExpirationTime = Date.now() + 3600000;

                user.setForgotPassTokenAndTime(userResult[0].id, resetPassToken, tokenExpirationTime, function(err, result){
                    if(err){
                        return console.log(err);
                    }
                    console.log("Sending mail")
                    mailSubject+= "Sadaliah Password Reset Request";
                    mailText += "You are recieving this email because you (or someone else) has requested the reset of the password for" + 
                                "your account. Please Use the following link, or paste it in your browser to set new password \n" +
                                "http://" + req.headers.host + "/reset/" + userResult[0].id + "/" + resetPassToken + "\n\n" +
                                "If you did'nt request this, please ignore this email and password";
                    
                    //Instantiating Mail object
                    var mail = new Mail();
                    //Initializing mail transporter
                    var transporter = mail.getTransporter("gmail", "sadaliahiksaudi@gmail.com", "SadaliaH789");
                    //Sending mail using the instantiated transporter
                    mail.sendMail(userResult[0].email, "sadaliahiksaudi@gmail.com", "Sadaliah Verification Code", mailText, transporter);
                    //Set the authentication to false since user has to verify it registration
                    console.log("Mail has been send");
                    res.json({
                        status: 200,
                        message: "Check you email " + userResult[0].email + " for password reset link"
                    })
                });

            });

                //Set token expiration time one hour after current timea
            
    });

}

