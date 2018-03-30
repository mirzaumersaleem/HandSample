var User = require('../models/user');
var Mail = require('../models/mail');

exports.getRegisterController = function(req, res){
    res.render('signup', {});
}

exports.getUserAddressController = function(req, res){
    
    var user = new User();
    
    user.getUserAddresses(req.user.id, function(err, rows){
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
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        addressDesc: req.body.addressDesc
    }

    user.addUserAddress(50, addressData, function(err, result){
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else {
            res.json({
                status: 200,
                message: result
            });
        }
    })
}


exports.forgetPassMailController = function(req, res){
    var user = new User();
    var userEmail = req.body.email;
    var mail = new Mail();
    var mailSubject = "";
    var mailText = "";

    //Fetch the user using email
    user.findByEmail(userEmail, function(err, reesult){
            if(err){
                res.json({
                    status: 500,
                    message: err
                });
                return;
            }
            
            mailSubject+= "Sadaliah Verification Code";
            mailText += "Use the following verification code to set new password " + Math.floor((Math.random() * 10000) + 1 );            
            var transporter = mail.getTransporter("gmail", "hassamshoaib96@gmail.com", "MyNamEIsHassaM789");
            mail.sendMail("Hassam Shoaib <hassamshoaib96@gmail.com>", //From
                            userEmail, //To
                            mailSubject, //Subject
                            mailText,
                            transporter); //Text
            res.render('index', {});
    });

}

