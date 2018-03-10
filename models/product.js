var mySql = require('../config/database');

class product{
    constructor(){

    }

    getSubCatProd(subCategoryId, callback){
        var query = "SELECT id, name, arabic_name, quantity, price_1, images \
                     FROM hiksaudi_js.gc_products \
                     WHERE secondary_category = " + subCategoryId;

        mySql.query(query, function(err, rows){
            callback(err, rows);
        });
    }

    getProductDetails(productId, callback) {
        var query = "SELECT a.id, a.name, a.arabic_name, a.description, a.arabic_description, \
	                        a.quantity, a.images, a.price_1, a.arabic_images, b.name as brand_name, \
                            b.arabic_name as brand_arabic_name \
                     FROM hiksaudi_js.gc_products a, hiksaudi_js.gc_brands b \
                     WHERE a.brand = b.id AND a.id = 1";
        
        mySql.query(query, function(err, rows){
            callback(err, rows);
        });

    }
}

module.exports = product;