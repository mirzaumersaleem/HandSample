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

    updateVerificationStatus(userId, status, callback){
        var query = "UPDATE hiksaudi_js.gc_customers SET verification_status = " + status + " WHERE id = " + userId; //+ userId;

        mySql.query(query, function(err, result){
            callback(err, result);
        });
    }

    findByEmail(email, callback){

        var query = "SELECT id, firstname, lastname, email, phone, password, verification_code, verification_status \
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
                    "(firstname,  email, phone, password, verification_status, verification_code)" +
                    "VALUES" + "(" + "\"" + userData.name + "\"" + "," + "\"" + userData.email + "\"" + "," + "\"" + userData.mobile + "\"" + "," + "\"" + userData.password + "\"" + "," + "\"" + userData.verificationStatus + "\"" + ","+ userData.verificationCode +")";
        
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

    addUserAddress(userId, addressData, callback){
        var query = "INSERT INTO hiksaudi_js.gc_address\
                     (CustomerId, latitude, longitude, address)\
                     VALUES (" + userId + "," + addressData.latitude + "," + addressData.longitude 
                     + "," + "\"" + addressData.addressDesc + "\"" + ")";
        
        mySql.query(query, function(err, result){
            callback(err, result);
        });   
    }

    getUserAddressById(addressId, callback){
        console.log("Inside get user address model123");
        var query = "SELECT address FROM hiksaudi_js.gc_address\
                     WHERE AddressId = " + addressId;
        console.log("Above query executed");

        mySql.query(query, function(err, result){
            //mySql.end();
            console.log(err);
            console.log(result);
            callback(err, result);
        });
    }

    setForgotPassTokenAndTime(userId, token, time, callback){
        console.log(typeof token);
        console.log(typeof time);
        console.log(typeof userId);

        var query = "UPDATE  hiksaudi_js.gc_customers SET resetPasswordToken = " + "\"" + token + "\"" + "," + "resetPasswordDate = " + time + " WHERE id = " + userId;

        mySql.query(query, function(err, result){
            callback(err, result);
        });
    }

    setUserPassword(id, password, callback){
        var query = "UPDATE  hiksaudi_js.gc_customers SET password = " + "\"" + password + "\"" + " WHERE id = " + userId;

        mySql.query(query, function(err, result){
            callback(err, result);
        });
    }

    generatePasswordHash(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    validPassword(password, localPassword){
        return bcrypt.compareSync(password, localPassword); 
    }

}

module.exports = user;