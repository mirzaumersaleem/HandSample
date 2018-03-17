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

router.get('/test', function(req, res){
    var product = new Product();
    product.getProductDetails(2, function(err, result){
        console.log(result);
    });
    res.render('index', {});
});

router.post('/register', passport.authenticate('local-register',{
    successRedirect: '/users/test',
    failureRedirect: '/users/register',
    failureFlash: false
}));

router.get('/signin', function(req, res){
    res.render('signin', {});
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/users/test',
    failureRedirect: '/users/signin',
    failureFlash: false
}));


module.exports = router;
