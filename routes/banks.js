/**
 * Created by Atayyab Owais on 01/03/2018.
 */
var express = require('express');
var router = express.Router();
var bankController = require('../controllers/bankController'); 
var customerController = require('../controllers/customerController'); 

router.post('/test', (req, res) => {

        console.log("test controller executed");
        bankController.getAllCustomers(req, res);
        
        //console.log("test email ",req.user.email);

// var iid = req.session.passport.user;

});

//Searching friend from List of users on the basis of name
router.post('/addFriendSearch', (req, res) => {
    req.assert("name", "Enter a name to search").notEmpty();
    //checking validation errors  
    var error = req.validationErrors(true);
    var errorValues = Object.keys(error);

    if(errorValues.length > 0){
        console.log("inside if"); 
        return res.json({
            status: 422,
            message: "Validation errors",
            errors: error
        });
    }else{
        console.log("friend search controller executed");
        customerController.friendSearch(req, res);
    }

});

//adding friends from the list received from searching friend  
router.post('/addFriend', (req, res) => {
    req.checkBody('friend_id').notEmpty();
   //checking validation errors  
    var error = req.validationErrors(true);
    var errorValues = Object.keys(error);

    if(errorValues.length > 0){
        console.log("inside if"); 
        return res.json({
            status: 422,
            message: "Validation errors",
            errors: error
        });
    }else{
        console.log("Add Friend controller executed");
        customerController.addFriend(req, res);
    }

});

//not appeared in provided screens but this should be added
//a menu having all the accept money requests
router.post('/acceptMoneyMenu', (req, res) => {
    customerController.acceptMoneyMenu(req, res);
});


router.post('/acceptMoneyPage', (req, res) => {
    req.checkBody('id').notEmpty(); // from acceptMoneyMenu
    //checking validation errors  
     var error = req.validationErrors(true);
     var errorValues = Object.keys(error);

     if(errorValues.length > 0){
        console.log("inside if"); 
        return res.json({
            status: 422,
            message: "Validation errors",
            errors: error
        });
    }else{
        console.log("Accept Money Page Controller Executed");
        customerController.acceptMoneyPage(req, res);
    }
    
});


router.post('/acceptMoney', (req, res) => {
    req.checkBody('id').notEmpty();
    req.checkBody('amount').notEmpty();
    req.checkBody('ip_address').notEmpty();
    req.checkBody('description').notEmpty();

    console.log("outside if"); 
    var error = req.validationErrors(true);
    var errorValues = Object.keys(error);
    if(errorValues.length > 0){
        console.log("inside if"); 
        return res.json({
            status: 422,
            message: "Validation errors",
            errors: error
        });
    }else{
        console.log("AcceptMoney controller executed");
        customerController.acceptMoney(req, res);
    }


});






module.exports = router;