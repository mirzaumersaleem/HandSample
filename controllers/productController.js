var mySql = require("../config/database");

var category = require("../models/category");
var product = require("../models/product");

/*
    This is an asynchronous function that fetch subcategories
    for each parent category. THe fetching of sub categories is synchronous
*/
async function getMainAndSubCat(parentCategories) {
    var mainCatImages = ["/sadaliaCats/Medicines&Treatments.png",
        "/sadaliaCats/Beauty&Care.png",
        "/sadaliaCats/Care.png",
        "/sadaliaCats/Supplement.png",
        "/sadaliaCats/Perfumes.png",
        "/sadaliaCats/ElectricalDevices.png",
    ];

    //Return a promise when all subcategories are fetched for parent categories
    return new Promise(async function (resolve) {
        var catMainAndSub = []; //Array to save parent and their sub categories
        let categories1 = new category();   //Category class object
        for (i = 0; i < parentCategories.length; i++) {
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
function getOffersWithImages(offers) {
    return new Promise(async function (resolve) {
        var products = new product();
        for (var i = 0; i < offers.length; ++i) {
            //Convert time remaining into minuites and hours
            var timeRemaining = offers[i].time_remaining;
            var hours = Math.floor(timeRemaining / 60);
            var mins = timeRemaining % 60;
            delete offers[i].time_remaining;
            offers[i].hours = hours;
            offers[i].minuites = mins;
            console.log("This offer id " + offers[i].id)
            var imagesArray = await products.getOfferImagePromise(offers[i].id);
            console.log("This is images Array" + imagesArray);
            offers[i].images = imagesArray;
            //console.log(offers[i]);
        }
        resolve(offers);
    });
}
/*
    This controller returns all the parent categories
*/
exports.getCategoryController = function (req, res) {
    var categories = new category();

    categories.getMainCategories(req, async function (err, result) {
        res.json({
            status: 200,
            data: result
        });
    });
}
/*
    This controller takes the parent category id and
    return all the ssub categories that are in the parent
    category
 */
exports.getAllCategoriesController = function (req, res,city_id) {
    var categories = new category();
    console.log("In Controller",city_id);
    categories.getCategories(req,city_id, async function (err, result) {
        if (result != 0) {
            for (var i = 0; i < result.length; i++) {
                var temp = JSON.parse(result[i].branch_logo);
                result[i].branch_logo = temp.small;
            }
            res.json({
                status: 200,
                data: result
            });
        } else {
            res.json({
                status: 200,
                Message: "No Branch Avaliable near you"
            });
        }

    });

}
/*
    This controller takes the sub category id of a category
    and return all the products that are in the sub category
 */
exports.getSubCatProductsController = function (req, res) {
    var products = new product();
    products.getSubCatProd(req.query.subCategoryId, function (err, result) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            //console.log(result);
            for (var i = 0; i < result.length; ++i) {
                //Data object contains the list of products
                //Replace [0] with the iterating variable through which you are listing all products
                var productImageObj = result[i].images;
                //Parse the productImageObj
                var productImageObj = JSON.parse(productImageObj);
                //Get the value of first property from image object
                var imageFirstProp = productImageObj[Object.keys(productImageObj)[0]]
                //Extract image filename from image first property object
                var imageLink = imageFirstProp.filename;
                //Concatenate image name with remote repository url
                result[i].images = "http://hikvisionsaudi.com/9/uploads/images/full/" + imageLink;
            }
            res.json({
                status: 200,
                data: result
            });
        }
    });
}

async function getproduct(result) {
    //Return a promise when all subcategories are fetched for parent categories
    return new Promise(async function (resolve) {
        var products = new product();
        var productdata = [];
        var data = await products.getSpecificProduct(result);
        resolve(data); //Returning All offers
    });
}
async function getOffer(data) {
    //Return a promise when all subcategories are fetched for parent categories
    return new Promise(async function (resolve) {
        var products = new product();
        var productdata = [];
        //  productdata[0]=data;
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].id);
            productdata[i] = await products.getOfferData(data[i].id);
        }
        resolve(productdata); //Returning All offers
    });
}
async function getbranchInfo(result) {
    //Return a promise when all subcategories are fetched for parent categories
    return new Promise(async function (resolve) {
        var products = new product();
        var productdata = [];
        var data = await products.getBranchInfo(result);
        resolve(data); //Returning All offers
    });
}
async function getbranchReview(result) {
    //Return a promise when all subcategories are fetched for parent categories
    return new Promise(async function (resolve) {
        var products = new product();
        var productdata = [];
        var data = await products.getBranchReview(result);
        let grand_total=0;
        //overall_rating
        for(let i=0 ;i<data.length;i++){
            grand_total+=data[i].indivisual_rating;
        }
        var average_rating=Math.round(grand_total/25)
        for(let j=0 ;j<data.length;j++){
            data[j].overall_rating=average_rating
        }
        resolve(data); //Returning All offers
    });
}
/*
    This controller takes a single product id
    and returns all the details of that product
 */
exports.getProductDetailsController = function (req, res) {
    var products = new product();
    console.log("req.query.city_id", req.query.city_id, "req.query.subcategory_id", req.query.subcategory_id);

    products.getProductDetails(req, async function (err, result) {
        console.log(err);
        if (err) {
            console.log(err);
            res.json({
                status: 500,
                message: "Error " + err
            });
        } else {
            if (result.length != 0) {
                var prod = await getproduct(result);
                for (var i = 0; i < prod.length; i++) {
                    var temp1 = JSON.parse(prod[i].image)
                    prod[i].logo = temp1.small;
                }
                var offer = await getOffer(prod);
                if (offer) {
                    for (var i = 0; i < offer.length; i++) {
                        var temp = JSON.parse(offer[i].image);
                        offer[i].logo = temp1.small;
                    }
                }
                var branchInfo = [];
                var arr = [];
                var review = "";
                // for (let j = 0; j < result.length; j++) {
                branchInfo = await getbranchInfo(result[0].id);
                // console.log(branchInfo[j],"<-");
                for (var i = 0; i < branchInfo.length; i++) {
                    console.log("In for", branchInfo[i].sliders)
                    branchInfo[i].sliders = JSON.parse(branchInfo[i].sliders);
                    console.log("branchInfo[i].sliders.length", branchInfo[i].sliders.length);
                }
                //  }
                console.log("outside", branchInfo);
                for (k = 0; k < result.length; k++) {
                    review = await getbranchReview(result[k].id);
                }
                res.json({
                    status: 200,
                    BranchDetails: branchInfo,
                    products: prod,
                    offers: offer,
                    Review: review
                });
            } else {
                res.json({
                    status: 301,
                    message: "This Branch Has No Products To Offer"
                });
            }
        }
    });
}

exports.getOffers = function (req, res) {
    var products = new product();

    console.log("inside offers controller");
    products.getOffers(async function (err, result) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        }
        else {
            //Fetch images for offers
            console.log("Inside else");
            var offerWithImagesProm = await getOffersWithImages(result);
            res.json({
                status: 200,
                message: offerWithImagesProm
            });
        }
    })
}
exports.getActiveCategoryController = function (req, res) {
    var products = new product();
    console.log("inside offers controller");
    products.getCategory(async function (err, result) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        }
        else {
            res.json({
                status: 200,
                data: result,
            });
        }
    })
}
exports.getMyOrderdetails = function (req, res) {
    console.log("inside controller", );
    //console.log("query", req.user.id);
    var products = new product();
    products.getOrderHistory(req,function (err, result) {
        if (err) {
            res.json({
                status: 500,
                message: "Err", err,
            });
        } else {
            console.log("after", result);
            if (result != 0) {
                // for(var i=0 ;i<result.length;i++){
                //     result[i].order_status="Pending";
                // }
                res.json({
                    status: 200,
                    data: result,
                })
            }
            else {
                res.json({
                    status: 200,
                    message: "No previous orders",
                })
            }
        }
    })
}

exports.getMyOrderdetailsproductwise = function (req, res) {
    console.log("inside controller");
    var products = new product();
    let productData=[];
    let OfferData =[];
    var id = Number(req.query.id);
    products.getOrderDetailHistory(id, function (err, result) {
        if (err) {
            res.json({
                status: 500,
                message: err,
            });
        } else {
            console.log("after", result);
            if (result != 0) {
                for(var i=0 ;i<result.length;i++){
                    if(result[i].product_id!=0){
                        productData.push(result[i])
                    }else{
                        OfferData.push(result[i])
                    }
                }
                res.json({
                    status: 200,
                    Products: productData , Offers:OfferData,
                })
            }
            else {
                res.json({
                    status: 200,
                    message: "No previous orders",
                })
            }

        }
    })

}