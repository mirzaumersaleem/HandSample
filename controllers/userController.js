var User = require('../models/user');

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
            console.log(result);
            res.render('index', {})
        }
    })
}

exports.postRegisterController = function(req, res){
    
}

