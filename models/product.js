var mySql = require('../config/database');

class product{
    
    constructor(){

    }

    findById(id, callback){
        var query = "SELECT id, name, arabic_name, price_1\
                     FROM hiksaudi_js.gc_products\
                     WHERE id =  " + id;
        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows, fields){
                connection.release()
                console.log(rows);
                callback(err, rows[0]); //Passing results to callback function
            });
        });
    }

    getSubCatProd(subCategoryId, callback){
        
        var query = "SELECT id, name, arabic_name, quantity, price_1, images \
                     FROM hiksaudi_js.gc_products \
                     WHERE secondary_category = " + subCategoryId;

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows, fields){
                connection.release()
                console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    getProductDetails(productId, callback) {

        var query = "SELECT a.id, a.name, a.arabic_name, a.description, a.arabic_description, \
	                        a.quantity, a.images, a.price_1, a.arabic_images, b.name as brand_name, \
                            b.arabic_name as brand_arabic_name \
                     FROM hiksaudi_js.gc_products a, hiksaudi_js.gc_brands b \
                     WHERE a.brand = b.id AND a.id = " + productId;
        
        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows, fields){
                connection.release()
                console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });

    }
}

module.exports = product;
