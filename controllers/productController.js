var mySql = require("../config/database");

var category = require("../models/category");
var product = require("../models/product");

/*
    This is an asynchronous function that fetch subcategories
    for each parent category. THe fetching of sub categories is synchronous
*/
async function getMainAndSubCat(parentCategories){
    var mainCatImages = ["/sadaliaCats/Beauty&Care.png",
    "/sadaliaCats/Care.png",
    "/sadaliaCats/ElectricalDevices.png",
    "/sadaliaCats/Medicines&Treatment.png",
    "/sadaliaCats/Perfumes.png",
    "/sadaliaCats/Supplement.png"];

    //Return a promise when all subcategories are fetched for parent categories
    return new Promise(async function(resolve){
        var catMainAndSub = []; //Array to save parent and their sub categories
        let categories1 = new category();   //Category class object
        for(i = 0; i < parentCategories.length; i++){
                var subCategories = await categories1.getSubCatPromise(parentCategories[i].id); //The execution would wait until subcategories are fetched
                //Populating array with parent and subcategories
                //parentCategories[i].image = "http://hikvisionsaudi.com/9/uploads/images/full/" + mainCatImages[i];
                parentCategories[i].image = mainCatImages[i];
                catMainAndSub.push({
                                "parentCategory": parentCategories[i],
                                "childCategories": subCategories
                });
        }
        resolve(catMainAndSub); //Returning parent and subcategories when every thing executes correctly
    });

    
}

/*
    This controller returns all the parent categories
 */
exports.getCategoryController = function(req, res) {
    var mainCatImages = ["/sadaliaCats/Beauty&Care.png",
                         "/sadaliaCats/Care.png",
                         "/sadaliaCats/ElectricalDevices.png",
                         "/sadaliaCats/Medicines&Treatment.png",
                         "/sadaliaCats/Perfumes.png",
                         "/sadaliaCats/Supplement.png"];
    res.json({
        mainCatImages: mainCatImages
    });
}

/*
    This controller takes the parent category id and
    return all the ssub categories that are in the parent
    category
 */
exports.getAllCategoriesController = function(req, res){
    var categories = new category();

    categories.getCategories(async function(err, result){
        //Get parent categories
        var parentCategories = result;
        //Now this function will call another async function and await to get the result
        var catAndTheirSubCat = await getMainAndSubCat(parentCategories);   //execution awaiting until all parent and subcategories are fetched
        console.log("Outside loop");
        res.json({
            status:200,
            data: catAndTheirSubCat
        });
    });
    
}

/*
    This controller takes the sub category id of a category
    and return all the products that are in the sub category
 */
exports.getSubCatProductsController = function(req, res){
    var products = new product();
    products.getSubCatProd(req.query.subCategoryId, function(err, result){
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
    This controller takes a single product id
    and returns all the details of that product
 */
exports.getProductDetailsController = function(req, res){
    var products = new product();

    console.log("Product id entered " + req.query.productId);
    products.getProductDetails(req.query.productId, function(err, result){
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
