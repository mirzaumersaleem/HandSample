exports.getRegisterController = function(req, res){
    res.render('signup', {});
}

exports.postRegisterController = function(req, res){

    /*
        Vallidating customer registration credentials
     */
    req.checkBody("name", "Enter name").exists();
    req.checkBody("mobile", "Mobile number must be digits and cannot be null").notEmpty().isMobilePhone();
    req.checkBody("fax", "Number must be digits and cannot be null").notEmpty().isMobilePhone();
    req.checkBody("password", "Password field cannot be empty").notEmpty();
    req.checkBody("company");
    req.checkBody("company-number");

    var errors = req.validationErrors();

    if(errors){
        console.log(errors);
        res.send(json({
            errors: errors
        }));
        return;
    } else {
        //Processing after validation
    }

    var newUser = {
        name: req.body.name,
        mobile: req.body.mobile,
        fax: req.body.fax,
    }
}