var mySql = require('../config/bank_db');

class bank{
    
    constructor(){

    }
    //get a unique customer
    getCustomer(email) {
        return new Promise(function(resolve){
            var c_email = JSON.stringify(email);
            var query = `select * from myraal_bank.customers where email =${c_email}`
            console.log(query);
            mySql.getConnection(function(err, connection){
                if(err){
                    throw err;
                }
                connection.query(query, function(err, rows){
                    if(err){
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
    //get all customers 
    // getCustomers(req) {
    //     return new Promise(function(resolve){
            
    //         var query = `select * from myraal_bank.customers`
    //         mySql.getConnection(function(err, connection){
    //             if(err){
    //                 throw err;
    //             }
    //             connection.query(query, function(err, rows){
    //                 if(err){
    //                     throw err;
    //                 }
    //                 else {
    //                     connection.release();
    //                     console.log("Promise going to be resolved");
    //                     resolve(rows);
    //                 }
    //             });
    //         });
    //     });

    // }

    //////////////////
    getCustomers(req,callback){
        var query = `select * from myraal_bank.customers`

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, results){
                if(err){
                    throw err;
                }
                else{
                    connection.release();
                    //console.log(results);
                    callback(results);
                }
            });
        });
    }























}

module.exports = bank;