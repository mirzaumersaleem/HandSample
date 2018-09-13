var express = require('express');
var router = express.Router();
var productsController = require('../controllers/productController');
var citiess = require('cities');
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder(options);
var options = {
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyD4i5pszwPN1qacKxjSqlKe-PBYXoVeqq0', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
router.post('/category', function (req, res) {
    //  req.assert("city_id", "City Id is required").notEmpty();
    req.assert("category_id", "Category Id is required").notEmpty();
    var error = req.validationErrors(true);
    var errorValues = Object.keys(error);
    console.log("error length " + errorValues.length);
    if (errorValues.length > 0) {
        console.log("inside if");
        return res.json({
            status: 422,
            message: "Validation errors",
            errors: error
        });
    } else {
        console.log("product controller executed");//api_key:AIzaSyD4i5pszwPN1qacKxjSqlKe-PBYXoVeqq0
        if (req.body.latLong) {
            req.body.latLong = JSON.parse(req.body.latLong);
            geocoder.reverse({ lat:req.body.latLong[0].Lat,lon:req.body.latLong[0].Long })
                .then(function (responce){
                    console.log(responce[0].city, (responce[0].city == "Jeddah"));
                    if (responce[0].city == "Jeddah") {
                        productsController.getAllCategoriesController(req, res, 4);
                    }
                    else if (responce[0].city == "Mecca") {
                        productsController.getAllCategoriesController(req, res, 5);
                    }
                    else if (responce[0].city == "Medina") {
                        productsController.getAllCategoriesController(req, res, 6);
                    }
                    else if ((responce[0].city != "Medina") && (responce[0].city != "Mecca") && (responce[0].city != "Jeddah")) {
                        productsController.getAllCategoriesController(req, res, 4);
                    }
                })
                .catch(function (err) {
                    productsController.getAllCategoriesController(req, res, 4);
                });
        } else {
            productsController.getAllCategoriesController(req, res);
        }
    }
});
router.get('/getAllProductInfo', function (req, res) {
    console.log("Inside product details route");
    productsController.getProductDetailsController(req, res);
});
router.get('/getActiveCategories', function (req, res) {
    productsController.getActiveCategoryController(req, res);
});
router.get('/offers', (req, res) => {
    console.log("Inside offers");
    productsController.getOffers(req, res);
}); 
router.get('/myOrder', function (req, res) {
    productsController.getMyOrderdetails(req,res);
}); 
router.get('/myOrderDetails', function (req, res) {
    productsController.getMyOrderdetailsproductwise(req,res);
});

module.exports = router;