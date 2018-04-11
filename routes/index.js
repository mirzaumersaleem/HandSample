'use strict';
var express = require('express');
var router = express.Router();
var Mail = require('../models/mail');

var productsController = require('../controllers/productController');



router.get('/categories/:parentCategoryId', function(req, res){
    productsController.getSubCategoriesController(req, res);    
});

module.exports = router;
