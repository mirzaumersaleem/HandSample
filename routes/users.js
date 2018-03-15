'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userController = require('../controllers/userController');

/* GET users listing. */
router.get('/register', function (req, res) {
    res.render('signup', {});
});

router.get('/test', function(req, res){
    res.render('signin', {});
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
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: false
}));


module.exports = router;
