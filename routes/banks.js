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

//a page containing data related to unique acceptMoney Request that is to be fetched from acceptMoneyMenu
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

//when user clicks on accept money in accept money page
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


//when user choses to reject the money...
router.post('/rejectMoney', (req, res) => {
    req.checkBody('id').notEmpty();
    req.checkBody('amount').notEmpty();
    req.checkBody('ip_address').notEmpty();
    req.checkBody('description').notEmpty();

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
        customerController.rejectMoney(req, res);
    }


});


router.post('/addMoney', (req, res) => {
    req.checkBody('amount');


    
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
        console.log("addMoney controller executed");
        customerController.addMoney(req, res);
    }

});


router.post('/addMoneyVerified', (req, res) => {
    req.checkBody('amount');
    req.checkBody('ip_address');
    req.body.description = "Payment transfered to the account VIA PayTab";
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
        console.log("addMoneyVerified controller executed");
        customerController.addMoneyVerified(req, res);
    }

});


router.post('/verifyPinAddMoney', (req, res) => {
    req.checkBody('pin');
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
        console.log("verifyPinAddMoney controller executed");
        customerController.verifyPinAddMoney(req, res);
    }

});


router.post('/payTransaction', (req, res) => {
    req.checkBody('amount');
    req.checkBody('ip_address');
    req.checkBody('account_number');
    req.checkBody('description');
    req.checkBody('pin');
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
        console.log("payTransaction controller executed");
        customerController.payTransaction(req, res);
    }

});


router.post('/sendMoney', (req, res) => {
    req.checkBody('amount');
    req.checkBody('friend_id');
    req.checkBody('description');
    req.checkBody('ip_address');
    req.checkBody('pin');
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
        console.log("sendMoney controller executed");
        customerController.sendMoney(req, res);
    }

});


router.post('/sendMoneyPage', (req, res) => {

        console.log("sendMoneyPage controller executed");
        customerController.sendMoneyPage(req, res);
    

});




router.post('/sendGift', (req, res) => {
    req.checkBody('amount');
    req.checkBody('friend_id');
    req.checkBody('description');
    req.checkBody('ip_address');
    req.checkBody('pin');
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
        console.log("sendGift controller executed");
        customerController.sendGift(req, res);
    }

});


router.post('/sendGiftPage', (req, res) => {

        console.log("sendGiftPage controller executed");
        customerController.sendMoneyPage(req, res);
    

});


router.post('/shareMoney', (req, res) => {
    req.checkBody('amount');
    req.checkBody('friend_id');
    req.checkBody('ip_address');
    req.checkBody('pin');
    req.body.description = "";
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
        console.log("shareMoney controller executed");
        customerController.shareMoney(req, res);
    }

});


router.post('/shareMoneyPage', (req, res) => {

        console.log("sendGiftPage controller executed");
        customerController.shareMoneyPage(req, res);
        
});












module.exports = router;