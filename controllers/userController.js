var User = require('../models/user');
var Mail = require('../models/mail');



exports.getRegisterController = function(req, res){
    res.render('signup', {});
}

exports.testController = function(req, res){
    var user = new User();

    user.findById(11, function(err, result){
        if(err){
            console.log(err);
            throw (err);
        } else{
            var array = [];
            for(var id in result){
                array.p
            }
            console.log(result);
            res.render('index', {})
        }
    })
}

exports.getUserAddressController = function(req, res){
    var user = new User();
    user.getUserAddresses(50, function(err, rows){
        console.log(rows[0].AddressID);
        res.render('index', {});
    })
}

exports.addLocation = function(req, res){

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

