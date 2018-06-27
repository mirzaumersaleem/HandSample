var mySql = require("../config/database");
var mySql2 = require("../config/bank_db");
var bcrypt = require('bcryptjs');

class user {
    constructor() {

    }
    findById(id, callback) {
        var query = "SELECT * FROM myraal_raal.users WHERE id = " + id;
        
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows) {
                connection.release()
                //console.log("findByID's 'resp -> ",rows)
                callback(err, rows); //Passing results to callback function
            });
        });
    }
    findIdOnUserTable(id) {
        //   console.log("obj bank wala: " , bankDetail);
           return new Promise(function(resolve){
            var query = "SELECT email FROM myraal_raal.users WHERE id = " + req.user.id;
            console.log("yahn findByID men masla hy id -> ",id, "\n query ", query);    
               mySql2.getConnection(function(err, connection){
                   if(err){
                       throw err;
                   }
                   connection.query(query, bankDetail, function(err, rows){
                       connection.release();
                       if(err){
                           throw err;
                       }
                       else {
                     
                           resolve(rows);
                       
                       }
                   });
               });
           }).catch(err => {
               throw err;
           });
       }

    updateVerificationStatus(userId, status, callback) {
        var query = "UPDATE hiksaudi_js.gc_customers SET verification_status = " + status + " WHERE id = " + userId; //+ userId;

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows) {
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    findByEmail(email, callback) {
        console.log("findByEmail mie agaya")
        var query = ' select * from myraal_raal.users ' +
            ' where email = "' + email + '" ';
        console.log("query", query);
        mySql.getConnection(function (err, connection) {
            if (err) {
                console.log(" error agaya findByEmail <-")
                throw err;
            }
            connection.query(query, function (err, rows) {
               // console.log("rows <-", rows);
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }
    findByEmails(email, callback) {
        console.log("findByEmail bank walay me agaya")
        var query = ' select * from myraal_bank.customers ' +
            ' where email = "' + email + '" ';
        console.log("query", query);
        mySql2.getConnection(function (err, connection) {
            if (err) {
                console.log(" error agaya findByEmail bank <-")
                throw err;
            }
            connection.query(query, function (err, rows) {
                console.log("rows <-", rows);
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }
    getPrintName() {
        console.log("Hello");
    }        
    setBankUser(bankDetail) {
     //   console.log("obj bank wala: " , bankDetail);
        return new Promise(function(resolve){
            console.log("obj bank wala: " , bankDetail);
        //   var query = "INSERT into myraal_bank.customers" +
        //   "(country, postal_code, updated_at, created_at, remember_token, status, customer_type, name, phone_number, email, password, address,city ,identity_number)" +
        //   "VALUES" + "(" + "\"" + bankDetail.country + "\"" + "," + "\"" + bankDetail.postal_code + "\"" + "," + "\"" + bankDetail.updated_at + "\"" + "," + "\"" + bankDetail.created_at + "\"" + "," + "\"" + bankDetail.remember_token + "\"" + "," + "\"" + bankDetail.status + "\"" + "," + "\"" + bankDetail.customer_type + "\"" + "," + "\"" + bankDetail.name + "\"" + "," + "\"" + bankDetail.phone_number + "\"" + "," + "\"" + bankDetail.email + "\"" + "," + "\"" + bankDetail.password + "\"" + "," + "\"" + bankDetail.address + "\"" + "," + "\"" + bankDetail.city + "\"" + "," + bankDetail.identity_number + ")";
      
        //var query = "INSERT INTO myraal_bank.customers set ?";
            //  var findbyemail = this.findByEmails;
           var query = `insert customers set ?`
          
            mySql2.getConnection(function(err, connection){
                if(err){
                    throw err;
                }
                connection.query(query, bankDetail, function(err, rows){
                    connection.release();
                    if(err){
                        throw err;
                    }
                    else {
                  
                        resolve(rows);
                    
                    }
                });
            });
        }).catch(err => {
            throw err;
        });
    }

           
    setAccountTable(accountTable) {
        //   console.log("obj bank wala: " , bankDetail);
           return new Promise(function(resolve){
               console.log("obj acount wala: " , accountTable);
            //  var query = "INSERT into myraal_bank.customers" +
            //  "(country, postal_code, updated_at, created_at, remember_token, status, customer_type, name, phone_number, email, password, address,city ,identity_number)" +
            //  "VALUES" + "(" + "\"" + bankDetail.country + "\"" + "," + "\"" + bankDetail.postal_code + "\"" + "," + "\"" + bankDetail.updated_at + "\"" + "," + "\"" + bankDetail.created_at + "\"" + "," + "\"" + bankDetail.remember_token + "\"" + "," + "\"" + bankDetail.status + "\"" + "," + "\"" + bankDetail.customer_type + "\"" + "," + "\"" + bankDetail.name + "\"" + "," + "\"" + bankDetail.phone_number + "\"" + "," + "\"" + bankDetail.email + "\"" + "," + "\"" + bankDetail.password + "\"" + "," + "\"" + bankDetail.address + "\"" + "," + "\"" + bankDetail.city + "\"" + "," + bankDetail.identity_number + ")";
         
           //var query = "INSERT INTO myraal_bank.customers set ?";
           var query = `insert balances set ?`
               //  var findbyemail = this.findByEmails;
             
               mySql2.getConnection(function(err, connection){
                   if(err){
                       throw err;
                   }
                   connection.query(query, accountTable, function(err, rows){
                       connection.release();
                       if(err){
                           throw err;
                       }
                       else {
                     
                           resolve(rows);
                       
                       }
                   });
               });
           }).catch(err => {
               throw err;
           });
       }

    setNewUser(userData, callback){
        console.log("inside set new user in modal");
        console.log(userData);
        // WORKING CODE 
        var query = "INSERT into myraal_raal.users" +
            "(name,phone_number, email, password,address,city,identity_number)" +
            "VALUES" + "(" + "\"" + userData.name + "\"" + "," + "\"" + userData.phone_number + "\"" + "," + "\"" + userData.email + "\"" + "," + "\"" + userData.password + "\"" + ","+ "\"" + userData.address + "\"" + "," + "\"" + userData.city + "\"" + "," + userData.identity_number + ")";
        var findbyemail = this.findByEmail;
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows) {
                connection.release()
                if (err) {
                    callback(err, rows);
                }
                else {
                    findbyemail(userData.email, function (err, result) {
                        callback(err, result);
                    });
                }

            });
        })

    }

    getUserAddresses(userId, callback) {
        var query = "SELECT address.AdressID, address.latitude, address.longitude, address.address\
                     FROM hiksaudi_js.gc_address AS address\
                     INNER JOIN hiksaudi_js.gc_customers AS customers\
                     ON customers.id = address.CustomerId\
                     WHERE address.CustomerId =  " + userId;

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows) {
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    addUserAddress(userId, addressData, callback) {
        var query = "INSERT INTO hiksaudi_js.gc_address\
                     (CustomerId, latitude, longitude, address)\
                     VALUES (" + userId + "," + addressData.latitude + "," + addressData.longitude
            + "," + "\"" + addressData.addressDesc + "\"" + ")";

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows) {
                connection.release()
                console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    getUserAddressById(addressId, callback) {
        console.log("Inside get user address model123");
        var query = "SELECT address FROM hiksaudi_js.gc_address\
                     WHERE AdressID = " + addressId;
        console.log("Above query executed");

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows) {
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    setForgotPassTokenAndTime(userId, token, time, callback) {
        console.log(typeof token);
        console.log(typeof time);
        console.log(typeof userId);

        var query = "UPDATE  hiksaudi_js.gc_customers SET resetPasswordToken = " + "\"" + token + "\"" + "," + "resetPasswordDate = " + time + " WHERE id = " + userId;

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows) {
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    setUserPassword(id, password, callback) {
        var query = "UPDATE  hiksaudi_js.gc_customers SET password = " + "\"" + password + "\"" + " WHERE id = " + userId;

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows) {
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    generatePasswordHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    validPassword(password, localPassword) {
        return bcrypt.compareSync(password, localPassword);
    }

}

module.exports = user;
