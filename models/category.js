var mySql = require("../config/database");

class category{
    constructor() {

    }

    getSubCatPromise(parentCategory){
        return new Promise(function(resolve){
            var query = "SELECT id, name, arabic_name\
                     FROM hiksaudi_js.gc_categories \
                     WHERE parent_id = " + parentCategory;
            
            mySql.getConnection(function(err, connection){
                if(err){
                    throw err;
                }
                connection.query(query, function(err, rows, fields){
                    connection.release();
                    resolve(rows); //Passing results to callback function
                });
            })
        });
    }
    getMainCategories(req,callback) {
        console.log(req.body.city_id,"category_id",req.body.category_id)
        var query = `select id, name , arabic_name from myraal_raal.categories
        where active_status=1`;
        console.log("query",query);
        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows, fields){
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        })
    }
    /*
        This Function will return categories
        that does'nt have any parent id
    */
    getCategories(req,city_id,callback) {
       // console.log(req.body.city_id,"category_id",req.body.category_id)
        var query = ` select s.id as subcategory_id,
        s.name as subcategory_name_english,b.city_id,
        s.arabic_name as subcategory_name_arabic,c.name as city_name,
        b.lat,b.lng,b.logo as branch_logo,t.name as Description,t.arabic_name as arabic_discription
        from myraal_raal.subcategories s right join 
        myraal_raal.branches b on (b.subcategory_id=s.id)
        right join myraal_raal.cities c on (b.city_id=c.id)
        right join myraal_raal.tags t on (s.tag_id=t.id)
        where b.city_id= ${(req.body.city_id>0)?req.body.city_id:city_id} and s.category_id=${req.body.category_id}`
        console.log("query",query);
        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows, fields){
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        })
    }
    /*
        This function will retrieve categories having a 
        parent id. These categories are known as sub categories
    */
    getSubCategories(parentCategory, callback) {
        var query = "SELECT id, name, arabic_name\
                     FROM hiksaudi_js.gc_categories \
                     WHERE parent_id = " + parentCategory;
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
module.exports = category;
