var mySql = require('../config/database');

class product {
    constructor() {
    }
    findProductById(id, callback) {
        var query = "SELECT id, name, arabic_name, price\
                     FROM myraal_raal.products\
                     WHERE id =  " + id;
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows, fields) {
                connection.release()
                console.log(rows);
                callback(err, rows[0]); //Passing results to callback function
            });
        });
    }
    findOffertById(id, callback) {
        var query = "SELECT id, name, arabic_name,discount as price\
                     FROM myraal_raal.offers\
                     WHERE id =  " + id;
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows, fields) {
                connection.release()
                console.log(rows);
                callback(err, rows[0]); //Passing results to callback function
            });
        });
    }
    findById(id, callback) {
        var query = "SELECT id, name, arabic_name, product_id,discount\
        FROM myraal_raal.offers\
        WHERE id = 2 " ;
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows, fields) {
                connection.release()
                console.log(rows);
                callback(err, rows[0]); //Passing results to callback function
            });
        });
    }
    getSubCatProd(subCategoryId, callback) {
        var query = "SELECT id, name, model, arabic_name, quantity, price_1, images \
                     FROM hiksaudi_js.gc_products \
                     WHERE secondary_category = " + subCategoryId;
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows, fields) {
                connection.release()
                //console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });
    }
    getProductDetails(req, callback) {
        console.log("req.query.city_id", req.query.city_id, "req.query.subcategory_id", req.query.subcategory_id);
        var query = `select id from myraal_raal.branches where city_id=${req.query.city_id} and subcategory_id=${req.query.subcategory_id} `
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err; 
            }
            connection.query(query, function (err, rows, fields) {
                connection.release()
                console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });
    }
    getOfferData(product_id) {
        return new Promise(function (resolve) {
            console.log("id ", product_id)
            var query = `select s.*,p.price, COALESCE(p.price - ((p.price/100) * s.discount)) AS discounted_price, p._token as logo from myraal_raal.offers s inner join myraal_raal.products p on p.id = ${product_id}
             where product_id =${product_id}`

            mySql.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.release();
                        console.log("Promise going to be resolved");
                        resolve(rows[0]);
                    }
                });
            });
        });
    }
    getSpecificProduct(result) {
        return new Promise(function (resolve) {
            var branch_id = result[0].id
            var query = `select * from myraal_raal.products where branch_id =${branch_id}`
            mySql.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.release();
                        console.log("Promise going to be resolved");
                        resolve(rows);
                    }
                });
            });
        });
    }
    getBranchInfo(id) {
        return new Promise(function (resolve) {
            var ID = id
            var query = `select * from myraal_raal.branches where id =${ID}`
            mySql.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.release();
                        console.log("Promise going to be resolved");

                        resolve(rows);
                    }
                });
            });
        });
    }
    getBranchReview(id) {
        return new Promise(function (resolve) {
            var ID = id
            //SELECT rating, comment, Count(*) FROM `comments` , (select count(rating) as count FROM `comments`  ) as x ORDER BY rating
            var query = `select rating,comment,count(*) as indivisual_rating,status as overall_rating from myraal_raal.comments where branch_id =${ID} group by rating`
            mySql.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.release();
                        console.log("Promise going to be resolved");
                        resolve(rows);
                    }
                });
            });
        });

    }

    getOfferImagePromise(offerId) {
        return new Promise(function (resolve) {
            var query = "SELECT products.images\
                     FROM hiksaudi_js.gc_promotions as promotions\
                     INNER JOIN hiksaudi_js.gc_promotions_products as promo_prods ON  promotions.id = promo_prods.on_offer_product_id \
                     INNER JOIN hiksaudi_js.gc_products as products ON promo_prods.product_id = products.id  \
                     WHERE promotions.id = " + offerId;
            mySql.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.release();
                        console.log("Promise going to be resolved");
                        for (var i = 0; i < rows.length; ++i) {
                            var productImageObj = rows[i];
                            //console.log("This is product image obj" + productImageObj);
                            //var productImageObj = JSON.parse(productImageObj);
                            //console.log(productImageObj);
                            //console.log(Object.keys(productImageObj)[0]);
                            var imageFirstProp = productImageObj[Object.keys(productImageObj)[0]];
                            imageFirstProp = JSON.parse(imageFirstProp);
                            imageFirstProp = imageFirstProp[Object.keys(imageFirstProp)[0]];
                            //Extract image filename from image first property object
                            var imageLink = imageFirstProp.filename;
                            rows[i] = "http://hikvisionsaudi.com/9/uploads/images/full/" + imageLink
                        }
                        resolve(rows);
                    }
                });
            });
        });

    }

    getOffers(callback) {
        var query = "SELECT promotions.id, timestampdiff(HOUR, promotions.start_date, promotions.end_date) as time_remaining, promotions.offer_name\
                     FROM hiksaudi_js.gc_promotions as promotions";

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, results) {
                if (err) {
                    throw err;
                }
                else {
                    connection.release();
                    console.log(results);
                    callback(err, results);
                }
            });
        });
    }

    getCategory(callback) {
        var query = "SELECT id,name,arabic_name \
                     FROM myraal_raal.categories where status=1 ";
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, results) {
                if (err) {
                    throw err;
                }
                else {
                    connection.release();
                    console.log(results);
                    callback(err, results);
                }
            });
        });
    }
    getOrderHistory(req,callback) {
        //console.log("req.user[0].id ",req.user.id )
        var query = 'select id,status,sub_total,total,created_at' +
            ' from myraal_raal.orders ' +
            ' where user_id = "' + req.user.id+ '" ';
       // console.log("query", req.user.id);
        mySql.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                throw err;
            }
            connection.query(query, function (err, results){
                if (err) {
                    console.log(err);
                    throw err;
                }
                else {
                    connection.release();
                   // console.log(results);
                    callback(err, results);
                }
            });
        });
    }
    getOrderDetailHistory(Id, callback) {
        var query =  `SELECT o.id as order_id,o.created_at as order_date,
        o.product_id,o.offer_id ,p.name as product_name,
        p.arabic_name as product_arabic_name,o.unit_price as product_prc,
        o.qty as product_qty,f.name as offer_name,f.image as offer_image,p.image as product_image,
        f.arabic_name as offer_arabic_name,f.qty as offer_qty 
        FROM order_items o left join products p on p.id=o.product_id 
        left join offers f on f.id=o.offer_id 
        where o.order_id=${Id}`
         mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, results) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                else {
                    connection.release();
                    console.log(results);
                    callback(err, results);
                }
            });
        });
    }
}
module.exports = product;
