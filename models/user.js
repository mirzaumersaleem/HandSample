var mySql = require("../config/database");

class user{
    constructor() {
        
    }

    findById(id, callback){

        var query = "SELECT id, firstname, lastname, email, phone, password \
                     FROM hiksaudi_js.gc_customers\
                     WHERE id = " + "\"" + id + "\"";

        mySql.query(query, function(err, result){
            callback(err, result);
        });
    }

    findByEmail(email, callback){

        var query = "SELECT id, firstname, lastname, email, phone, password \
                     FROM hiksaudi_js.gc_customers\
                     WHERE email = " + "\"" + email + "\"";

        mySql.query(query, function(err, result){
            callback(err, result);
        });
    }

    getPrintName() {
        console.log("Hello");
    }

    setNewUser(userData, callback){
        console.log("inside set new user");
        console.log(userData);
        var query = "INSERT into hiksaudi_js.gc_customers" +   
                    "(firstname,  email, phone, password)" +
                    "VALUES" + "(" + "\"" + userData.name + "\"" + "," + "\"" + userData.email + "\"" + "," + "\"" + userData.mobile + "\"" + "," + "\"" + userData.password + "\"" + ")";

        mySql.query(query, function(err, result){
            callback(err, result);
        });
    }
}

module.exports = user;