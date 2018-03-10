var mySql = require("../config/database");

class user{
    constructor() {
        
    }

    findById(id, callback){
        var query = "INSERT into hiksaudi_js.gc_customers" +   
                    "(firstname, lastname, email, phone, country, city, company, address, password)" +
                    "VALUES" + "()";

        mySql.query(query, function(err, result){
            callback(err, result);
        });
    }

    findByEmail(email, callback){
        var query = "SELECT";

        mySql.query(query, function(err, result){
            callback(err, result);
        });
    }

    setNewUser(userData, callback){
        var query = "INSERT into hiksaudi_js.gc_customers" +   
                    "(firstname, lastname, email, phone, country, city, company, address, password)" +
                    "VALUES" + "()";
    }
}