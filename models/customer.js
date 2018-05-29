var mySql = require('../config/bank_db');
var moment = require('moment');

class customer{
    constructor(){
        //defining constructor for customer model
    }
    //get a unique customer
    getCustomerByEmail(email) {
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

    //get all customers 
    getAllCustomers(req,callback){
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

    //searching a list of friends by name to send friend request
    friendSearch(req,callback){
        var cname = "%" + req.body.name + "%";
        
        var word = JSON.stringify(cname); 
        var query = `select * from customers where customers.name like ${word}`

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
    
    
    getEmail(req,callback){
        callback(req.user.email);
    }


    //searching a list of friends by name to send friend request
    addFriend(req, userObj){
        return new Promise(function(resolve){
        var query = `insert friends set ?`
        let favData = {};
        //var userObj = this.getCustomerByEmail(req.user.email);
        console.log("user OBJ -> ", userObj[0].id);
        var customer_id = userObj[0].id;
        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            
            favData = {
                friend_id: req.body.friend_id,
                customer_id: customer_id,
                status: 1,
                //customer_id: '1',
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                created_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            connection.query(query,favData, function(err, results){
                if(err){
                    throw err;
                }
                else{
                    connection.release();
                    //console.log(results);
                    resolve(results);
                }
            });
        });
    });

    }

    acceptMoneyMenu(req, userObj){
        return new Promise(function(resolve){

            var query = `select * from receives where receiver_id = ${userObj[0].id} && status = 0`;
        
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
                        resolve(results);
                    }
                });
            });
    });

    }

    acceptMoneyPage(req, callback){

        var query = `select * from receives where id = ${req.body.id} && status = 0`;
    
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


getCustomerBalance(req, userObj){
    return new Promise(function(resolve){
    
        var query = `select * from balances where customer_id = ${userObj[0].id}`;
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

                    resolve(results);
                }
            });
        });
});

}

updateUBalance(req, userObj, balanceObj){
    return new Promise(function(resolve){
    var query = `insert update_balances set ?`
    let upBalance = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    // console.log("---------------------------------blance OBJ -> ", balanceObj);
    var customer_id = userObj[0].id;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance = amount_new + amount_old;
        upBalance = {
            amount: req.body.amount,
            customer_id: customer_id,
            previous_balance: balanceObj[0].balance,
            description: req.body.description,
            ip_address: req.body.ip_address,
            type: 1,
            status: 0,
            remaining_balance: new_balance,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        connection.query(query,upBalance, function(err, results){
            if(err){
                throw err;
            }
            else{
                connection.release();
                //console.log(results);
                resolve(results);
            }
        });
    });
});

}


updateBalanceReq(req, balanceUpObj){
    return new Promise(function(resolve){
    var query = `insert update_balance_requests set ?`
    let balanceObj = {};
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        console.log("this is this --> ", balanceUpObj.insertId, "->", req.body.ip_address);
        balanceObj = {
            update_balance_id: balanceUpObj.insertId,
            ip_address: req.body.ip_address,
            status: 1,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        connection.query(query,balanceObj, function(err, results){
            if(err){
                throw err;
            }
            else{
                connection.release();
                //console.log(results); 
                resolve(results);
            }
        });
    });
});

}


updateAccount(req, userObj){
    return new Promise(function(resolve){
    var query = `insert accounts set ?`
    let accountObj = {};
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        accountObj = {

            customer_id: userObj[0].id,
            balance: req.body.amount,
            status: 1,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        connection.query(query,accountObj, function(err, results){
            if(err){
                throw err;
            }
            else{
                connection.release();
                //console.log(results);
                resolve(results);
            }
        });
    });
});

}



updateBalanceSet(req, userObj, balanceObj){
    return new Promise(function(resolve){
    var query = `update balances set ? where customer_id = ${userObj[0].id}`
    let blnObj = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    // console.log("user OBJ -> ", userObj[0].id);
    var customer_id = userObj[0].id;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance = amount_new + amount_old;
        blnObj = {
            account_no: balanceObj[0].account_no,
            customer_id: customer_id,
            balance: new_balance, //gonna call encryption here before addition method
            status: 1,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: balanceObj[0].created_at
        }
        
        connection.query(query,blnObj, function(err, results){
            if(err){
                throw err;
            }
            else{
                connection.release();
                //console.log(results);
                resolve(results);
            }
        });
    });
});

}

getReceivedObj(req) {
    return new Promise(function(resolve){
        var query = `select * from receives where id = ${req.body.id}`
        
        // console.log(query);
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




updateReceiveSet(req, reveivedObj){
    return new Promise(function(resolve){
    var query = `update receives set ? where id = ${req.body.id}`
    let rcvObj = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    // console.log("user OBJ -> ", userObj[0].id);
    //var customer_id = userObj[0].id;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(reveivedObj[0].balance, 10);
        var new_balance = amount_new + amount_old;
        rcvObj = {
            receiver_id: reveivedObj[0].receiver_id,
            sender_id: reveivedObj[0].sender_id,
            balance: new_balance, //gonna call encryption here before addition method
            status: 1,
            type: reveivedObj[0].type,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: reveivedObj[0].created_at
        }
        
        connection.query(query,rcvObj, function(err, results){
            if(err){
                throw err;
            }
            else{
                connection.release();
                //console.log(results);
                resolve(results);
            }
        });
    });
});

}















}

module.exports = customer;