var express = require('express');
var router = express.Router();

var productsController = require('../controllers/productController');

router.get('/category/:subCategoryId', function(req, res){
    console.log("product controller executed");
    productsController.getSubCatProductsController(req, res);
});

router.get('/product-details/:productId', function(req, res){
    console.log("Inside product details route");
    productsController.getProductDetailsController(req, res);
});
module.exports = router;
