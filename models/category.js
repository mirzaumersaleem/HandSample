var mySql = require("../config/database");

class category{
    constructor() {

    }

    /*
        This Function will return categories
        that does'nt have any parent id
    */
    getCategories(callback) {
        var query = "SELECT id, name, arabic_name\
                     FROM hiksaudi_js.gc_categories\
                     WHERE parent_id = 0";

        mySql.query(query, function(err, rows, fields){
            callback(err, rows); //Passing results to callback function
        });

    }

    /*
        This function will retrieve categories having a 
        parent id. These categories are known as sub categories
    */
    getSubCategories(parentCategory, callback) {
        var query = "SELECT id, name, arabic_name\
                     FROM hiksaudi_js.gc_categories \
                     WHERE parent_id = " + parentCategory;

        mySql.query(query, function(err, rows, fiels){
            callback(err, rows); //Passing results to callback function
        });
    }
}

module.exports = category;