var mySql = require("../config/database");

var category = require("../models/category");
var product = require("../models/product");

/*
    This controller returns all the parent categories
 */
exports.getCategoryController = function(req, res) {
    var categories = new category();
    categories.getCategories(function(err, result){
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else{
            res.json({
                status: 200,
                data: result
            });
        }
        console.log("Inside category controller");
        res.render('index', {title: 'Express'});
    });
}

/*
    This controller takes the parent category id and
    return all the ssub categories that are in the parent
    category
 */
exports.getSubCategoriesController = function(req, res){
    var categories = new category();
    categories.getSubCategories(req.params.parentCategoryId, function(err, result){

        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else{
            res.json({
                status: 200,
                data: result
            });
        }

    });
}

/*
    This controller takes the sub category id of a category
    and return all the products that are in the sub category
 */
exports.getSubCatProductsController = function(req, res){
    var products = new product();
    products.getSubCatProd(req.params.subCategoryId, function(err, result){
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else{
            res.json({
                status: 200,
                data: result
            });
        }
        console.log(result);
        res.render('index', {title: "Express"});
    });
}

/*
    This controller takes a single product id
    and returns all the details of that product
 */
exports.getProductDetailsController = function(req, res){
    var products = product();

    products.getProductDetails(req.params.productId, function(err, result){
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else{
            res.json({
                status: 200,
                data: result
            });
        }
    });
}