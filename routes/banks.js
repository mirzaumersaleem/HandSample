/**
 * Created by Atayyab Owais on 01/03/2018.
 */
var express = require('express');
var router = express.Router();
var bankController = require('../controllers/bankController'); 
var customerController = require('../controllers/customerController'); 

var encry = require("../models/encryption");


router.post('/test', (req, res) => {

    req.checkBody('text').notEmpty();
        console.log("test controller executed");
        //customerController.testController(req, res);
        // var ac = encry.encrypt(req.body.text);
        var ac = encry.encrypt("Hello World");
        console.log("test email ", ac);
        // console.log("test email ", ac);
        var dc = encry.decrypt(ac);
        console.log("test email2 ", dc);
        // res.json({message : "yo"});
// var iid = req.session.passport.user;

});

router.post('/getAccountDetails', isLoggedIn, (req, res) => {
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
        console.log("getAccountDetails controller executed");
        customerController.accountDetails(req, res);
    }

});
//Searching friend from List of users on the basis of name
router.post('/addFriendSearch', isLoggedIn, (req, res) => {
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
router.post('/addFriend', isLoggedIn, (req, res) => {
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
router.post('/acceptMoneyMenu', isLoggedIn, (req, res) => {
    customerController.acceptMoneyMenu(req, res);
});

//a page containing data related to unique acceptMoney Request that is to be fetched from acceptMoneyMenu
router.post('/acceptMoneyPage', (req, res) => {
    req.checkBody('id').notEmpty(); // from acceptMoneyMenu
    req.checkBody('name').notEmpty(); // from acceptMoneyMenu
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
router.post('/acceptMoney', isLoggedIn, (req, res) => {
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
router.post('/rejectMoney', isLoggedIn, (req, res) => {
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


router.post('/addMoney', isLoggedIn, (req, res) => {


    // if(errorValues.length > 0){
    //     console.log("inside if"); 
    //     return res.json({
    //         status: 422,
    //         message: "Validation errors",
    //         errors: error
    //     });
    // }else{
        console.log("addMoney controller executed");
        customerController.addMoney(req, res);
    // }

});


router.post('/addMoneyVerified', isLoggedIn, (req, res) => {
    req.checkBody('amount').notEmpty();
    req.checkBody('ip_address').notEmpty();
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


router.post('/verifyPinAddMoney', isLoggedIn, (req, res) => {
    req.checkBody('pin').notEmpty();
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


router.post('/payTransaction', isLoggedIn, (req, res) => {
    req.checkBody('amount').notEmpty();
    req.checkBody('ip_address').notEmpty();
    req.checkBody('account_number').notEmpty();
    req.checkBody('description').notEmpty();
    req.checkBody('pin').notEmpty();
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


router.post('/sendMoney', isLoggedIn, (req, res) => {
    req.checkBody('amount').notEmpty();
    req.checkBody('friend_id').notEmpty();
    req.checkBody('description').notEmpty();
    req.checkBody('ip_address').notEmpty();
    req.checkBody('pin').notEmpty();
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


router.post('/sendMoneyPage', isLoggedIn, (req, res) => {

        console.log("sendMoneyPage controller executed");
        customerController.sendMoneyPage(req, res);
    

});




router.post('/sendGift', isLoggedIn, (req, res) => {
    req.checkBody('amount').notEmpty();
    req.checkBody('friend_id').notEmpty();
    req.checkBody('description').notEmpty();
    req.checkBody('ip_address').notEmpty();
    req.checkBody('pin').notEmpty();
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


router.post('/sendGiftPage', isLoggedIn, (req, res) => {

        console.log("sendGiftPage controller executed");
        customerController.sendMoneyPage(req, res);
    

});


router.post('/shareMoney', isLoggedIn, (req, res) => {
    req.checkBody('amount').notEmpty();
    req.checkBody('friend_id').notEmpty();
    req.checkBody('ip_address').notEmpty();
    req.checkBody('pin').notEmpty();
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


router.post('/shareMoneyPage', isLoggedIn, (req, res) => {

        console.log("sendGiftPage controller executed");
        customerController.shareMoneyPage(req, res);
        
});


router.post('/withdrawMoney', isLoggedIn, (req, res) => {
    req.checkBody('amount').notEmpty();
    req.checkBody('description').notEmpty();
    req.checkBody('ip_address').notEmpty();
    req.checkBody('pin').notEmpty();
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
        console.log("withdrawMoney controller executed");
        customerController.withDrawMoney(req, res);
    }

});


router.post('/loginCheck', isLoggedInCheck, (req, res) => {
    
});



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.json({
            status: 360,
            message: "User must be logged in"
        });
    }
}

function isLoggedInCheck(req, res, next){
    if(req.isAuthenticated()){
        res.json({
            status: 200,
            message: "User logged in"
        });
    }
    else{
        res.json({
            status: 360,
            message: "User must be logged in"
        });
    }
}









module.exports = router;