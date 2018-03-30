'use strict';
var express = require('express');
var router = express.Router();
var Mail = require('../models/mail');

var productsController = require('../controllers/productController');

router.get('/', function(req, res){
    res.render('address', {});
    //productsController.getCategoryController(req, res);
});

router.get('/test', function(req, res){
    console.log(req.user.id);
});

router.get('/categories/:parentCategoryId', function(req, res){
    productsController.getSubCategoriesController(req, res);    
});

router.get('/updateProduct', function(req, res){
    
})
module.exports = router;
