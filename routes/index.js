'use strict';
var express = require('express');
var router = express.Router();

var productsController = require('../controllers/productController');

router.get('/', function(req, res){
    //res.render('productUpdate', {});
    productsController.getCategoryController(req, res);
});

router.get('/categories/:parentCategoryId', function(req, res){
    productsController.getSubCategoriesController(req, res);    
});

router.get('/updateProduct', function(req, res){
    
})
module.exports = router;
