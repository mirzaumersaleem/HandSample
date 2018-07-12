var express = require('express');
var router = express.Router();
var productsController = require('../controllers/productController'); 
router.post('/category', function(req, res){
    req.assert("city_id", "City Id is required").notEmpty();
    req.assert("category_id", "Category Id is required").notEmpty();
    var error = req.validationErrors(true);
    var errorValues = Object.keys(error);
    console.log("error length " + errorValues.length);
    if(errorValues.length > 0){
        console.log("inside if"); 
        return res.json({
            status: 422,
            message: "Validation errors",
            errors: error
        });
    }else{
        console.log("product controller executed");
        productsController.getAllCategoriesController(req, res);
    }
});

router.get('/getAllProductInfo', function(req, res){
    console.log("Inside product details route");
    productsController.getProductDetailsController(req, res);
}); 

router.get('/getActiveCategories', function(req, res){
    productsController.getActiveCategoryController(req, res);
}); 

router.get('/offers', (req, res) => {
    console.log("Inside offers");
    productsController.getOffers(req, res);
});

module.exports = router;