'use strict';
var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

/* GET users listing. */
router.get('/register', function (req, res) {
    res.render('signup', {});
});

router.post("/register", function(req, res){
    userController.registerController(req, res);
});

module.exports = router;
