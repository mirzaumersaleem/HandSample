'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');

var userController = require('../controllers/userController');

/* GET users listing. */
router.get('/register', function (req, res) {
    res.render('signup', {});
});

router.post('/register', passport.authenticate({
    successRedirect: '/',
    failureRedirect: '/users/register',
    failureFlash: true
}));

module.exports = router;
