var mySql = require("../config/database");
var bcrypt = require('bcryptjs');

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
        
        var findbyemail = this.findByEmail;

        mySql.query(query, function(err, result){
            if(err){
                callback(err, result);
            }
            else{
                findbyemail(userData.email, function(err, result){
                    callback(err, result);
                });
            }
        });
    }

    getUserAddresses(userId, callback){
        var query = "SELECT address.AddressID, address.latitude, address.longitude, address.address\
                     FROM hiksaudi_js.gc_address AS address\
                     INNER JOIN hiksaudi_js.gc_customers AS customers\
                     ON customers.id = address.CustomerId\
                     WHERE address.CustomerId =  " + userId;
        mySql.query(query, function(err, rows){
            callback(err, rows);
        });
    }

    addUserAddress(userId, callback){
        var query = "INSERT INTO hiksaudi_ja.gc_address"
    }

    generatePasswordHash(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    validPassword(password, localPassword){
        return bcrypt.compareSync(password, localPassword); 
    }

}

module.exports = user;