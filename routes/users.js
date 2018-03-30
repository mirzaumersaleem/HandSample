'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userController = require('../controllers/userController');

var Product = require('../models/product');


/* GET users listing. */
router.get('/register', function (req, res) {
    res.render('signup', {});
});

router.post('/register', passport.authenticate('local-register',{
    successRedirect: '/',
    failureRedirect: '/users/register',
    failureFlash: false
}));

router.get('/signin', function(req, res){
    res.render('signin', {});
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: false
}));

router.get('/addresses', function(req, res){
    userController.getUserAddressController(req, res);    
});

router.post('/addresses', function(req, res){
    userController.addUserAddressController(req, res);
});


router.get('/forget-password', function(req, res){
    res.render('forgetPasswordMain', {});
});

router.post('/forget-password', function(req, res){
    userController.forgetPassMailController(req, res);
});

module.exports = router;
