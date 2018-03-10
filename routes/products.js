var express = require('express');
var router = express.Router();

var productsController = require('../controllers/productController');

router.get('/category/:subCategoryId', function(req, res){
    console.log("product controller executed");
    productsController.getSubCatProducts(req, res);
});

module.exports = router;