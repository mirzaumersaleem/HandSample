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
    friendSearch(req, userObj){
        return new Promise(function(resolve){
        var cname = "%" + req.body.name + "%";
        
        var word = JSON.stringify(cname); 
        // var query = `select * from customers where customers.name like ${word}`
        var query = `select customers.* from customers where customers.name like ${word} && customers.id NOT IN (SELECT friends.friend_id from friends where friends.customer_id = ${userObj})`;
    
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
    
    
    getEmail(req,callback){
        callback(req.user.email);
    }

    getPinVerification(id){
        return new Promise(function(resolve){
            var query = `select secret_password as pin from customers where id = ${id}`;
            console.log("querryyyy", query);
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
    

    getReceiveValidity(req,callback){
        
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

            // var query = `select * from receives where receiver_id = ${userObj[0].id} && status = 0`;
            var query = `select receives.id as id, customers.name as sender_name, receives.balance as amount, receives.sender_id as sender_id from receives inner join customers ON receives.sender_id = customers.id && receives.receiver_id = ${userObj[0].id} && receives.status = 0`;
       
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
                    results[0].name = req.body.name;
                    //console.log(results);
                    callback(results);
                }
            });
        });

}


verifyPinAddMoney(req, id){
        return new Promise(function(resolve){
            var query = `select secret_password as pin from customers where id = ${id}`;
            
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
    

getCustomerBalance(req, userObj){
    return new Promise(function(resolve){
    
        var query = `select * from balances where customer_id = ${userObj}`;
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
    var customer_id = userObj;
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


AddupdateUBalance(req, userObj, balanceObj){
    return new Promise(function(resolve){
    var query = `insert update_balances set ?`
    let upBalance = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    var customer_id = userObj;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance = amount_new + amount_old;
        var new_balances = JSON.stringify(new_balance);
        upBalance = {
            amount: req.body.amount,
            customer_id: customer_id,
            previous_balance: balanceObj[0].balance,
            description: req.body.description,
            ip_address: req.body.ip_address,
            type: 1,
            status: 1,
            remaining_balance: new_balances,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        connection.query(query,upBalance, function(err, results){
            if(err){
                throw err;
            }
            else{
                //console.log("---------------------------------Upblance result OBJ -> ", results);
                connection.release();
                //console.log(results);
                resolve(results);
            }
        });
    });
});

}


updateBalanceReq(req, balanceUpObj,sta){
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
            status: sta,
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


updateAccounts(req, userObj, balanceObj){
    return new Promise(function(resolve){
    var query = `insert accounts set ?`
    let accountObj = {};
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance = amount_old - amount_new;
        var new_balances = JSON.stringify(new_balance);
        accountObj = {

            customer_id: userObj,
            balance: new_balances,
            status: 1,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        console.log("qxxxxx",accountObj);
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



updateAccount(req, userObj, balanceObj, stat){
    return new Promise(function(resolve){
    var query = `insert accounts set ?`
    let accountObj = {};
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance = amount_old - amount_new;
        var new_balances = JSON.stringify(new_balance);
        accountObj = {
            customer_id: userObj,
            balance: new_balances,
            status: stat,
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
    var query = `update balances set ? where customer_id = ${userObj}`
    let blnObj = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    // console.log("user OBJ -> ", userObj[0].id);
    var customer_id = userObj;
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

transUpdateBalanceSet(req, userObj, balanceObj){
    return new Promise(function(resolve){
    var query = `update balances set ? where customer_id = ${userObj}`
    let blnObj = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    // console.log("user OBJ -> ", userObj[0].id);
    var customer_id = userObj;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance =  amount_old - amount_new;
        var new_balances =  JSON.stringify(new_balance);
        blnObj = {
            account_no: balanceObj[0].account_no,
            customer_id: customer_id,
            balance: new_balances, //gonna call encryption here before addition method
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


getObjbyAccount(req) {
    return new Promise(function(resolve){
        var query = `select * from balances where account_no = ${req.body.account_number}`
        
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


getObjById(req, userObj) {
    return new Promise(function(resolve){
        var query = `select * from friends where friend_id = ${req.body.friend_id} && customer_id = ${userObj}`
        
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




updateReceiveSet(req, reveivedObj, r_status){
    return new Promise(function(resolve){
    var query = `update receives set ? where id = ${req.body.id} && status = 0`
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
        var new_balance = req.body.amount;
        rcvObj = {
            receiver_id: reveivedObj[0].receiver_id,
            sender_id: reveivedObj[0].sender_id,
            balance: new_balance, //gonna call encryption here before addition method
            status: r_status,
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


transReceiveSet(req, reveivedObj, userObj){
    return new Promise(function(resolve){
    var query = `insert receives set ?`
    //var query = `update receives set ? where id = ${req.body.id} && status = 0`
    let rcvObj = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    // console.log("user OBJ -> ", userObj[0].id);
    //var customer_id = userObj[0].id;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var new_balance = req.body.amount;
        rcvObj = {
            sender_id: userObj,
            receiver_id: reveivedObj,
            balance: new_balance, //gonna call encryption here before addition method
            status: 0,
            type: 3,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
                // console.log("my OBJ -----------",rcvObj);
        connection.query(query,rcvObj, function(err, results){
            if(err){
                throw err;
            }
            else{
                connection.release();
                // console.log("this is result==",results);
                resolve(results);
            }
        });
    });
});

}


sendMoneyRec(req, reveivedObj, userObj){
    return new Promise(function(resolve){
    var query = `insert receives set ?`
    //var query = `update receives set ? where id = ${req.body.id} && status = 0`
    let rcvObj = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    // console.log("user OBJ -> ", userObj[0].id);
    //var customer_id = userObj[0].id;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var new_balance = req.body.amount;
        rcvObj = {
            sender_id: userObj,
            receiver_id: reveivedObj,
            balance: new_balance, //gonna call encryption here before addition method
            status: 0,
            type: 1,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
                // console.log("my OBJ -----------",rcvObj);
        connection.query(query,rcvObj, function(err, results){
            if(err){
                throw err;
            }
            else{
                connection.release();
                // console.log("this is result==",results);
                resolve(results);
            }
        });
    });
});

}


giftMoneyRec(req, reveivedObj, userObj){
    return new Promise(function(resolve){
    var query = `insert receives set ?`
    //var query = `update receives set ? where id = ${req.body.id} && status = 0`
    let rcvObj = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    // console.log("user OBJ -> ", userObj[0].id);
    //var customer_id = userObj[0].id;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var new_balance = req.body.amount;
        rcvObj = {
            sender_id: userObj,
            receiver_id: reveivedObj,
            balance: new_balance, //gonna call encryption here before addition method
            status: 0,
            type: 2,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
                // console.log("my OBJ -----------",rcvObj);
        connection.query(query,rcvObj, function(err, results){
            if(err){
                throw err;
            }
            else{
                connection.release();
                // console.log("this is result==",results);
                resolve(results);
            }
        });
    });
});

}


addMoney(req, id){
    return new Promise(function(resolve){
    var query = `select balance as current_balance from balances where customer_id = ${id}`;
        
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



transUpdateUBalance(req, userObj, balanceObj){
    return new Promise(function(resolve){
    var query = `insert update_balances set ?`
    let upBalance = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    var customer_id = userObj;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance = amount_old - amount_new;
        var new_balances = JSON.stringify(new_balance);
        upBalance = {
            amount: req.body.amount,
            customer_id: customer_id,
            previous_balance: balanceObj[0].balance,
            description: req.body.description,
            ip_address: req.body.ip_address,
            type: 2,
            status: 0,
            remaining_balance: new_balances,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        connection.query(query,upBalance, function(err, results){
            if(err){
                throw err;
            }
            else{
                //console.log("---------------------------------Upblance result OBJ -> ", results);
                connection.release();
                //console.log(results);
                resolve(results);
            }
        });
    });
});

}



sendUpdateUBalance(req, userObj, balanceObj){
    return new Promise(function(resolve){
    var query = `insert update_balances set ?`
    let upBalance = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    var customer_id = userObj;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance = amount_old - amount_new;
        var new_balances = JSON.stringify(new_balance);
        upBalance = {
            amount: req.body.amount,
            customer_id: customer_id,
            previous_balance: balanceObj[0].balance,
            description: req.body.description,
            ip_address: req.body.ip_address,
            type: 5,
            status: 0,
            remaining_balance: new_balances,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        connection.query(query,upBalance, function(err, results){
            if(err){
                throw err;
            }
            else{
                //console.log("---------------------------------Upblance result OBJ -> ", results);
                connection.release();
                //console.log(results);
                resolve(results);
            }
        });
    });
});

}

giftUpdateUBalance(req, userObj, balanceObj){
    return new Promise(function(resolve){
    var query = `insert update_balances set ?`
    let upBalance = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    var customer_id = userObj;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance = amount_old - amount_new;
        var new_balances = JSON.stringify(new_balance);
        upBalance = {
            amount: req.body.amount,
            customer_id: customer_id,
            previous_balance: balanceObj[0].balance,
            description: req.body.description,
            ip_address: req.body.ip_address,
            type: 6,
            status: 0,
            remaining_balance: new_balances,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        connection.query(query,upBalance, function(err, results){
            if(err){
                throw err;
            }
            else{
                //console.log("---------------------------------Upblance result OBJ -> ", results);
                connection.release();
                //console.log(results);
                resolve(results);
            }
        });
    });
});

}


shareUpdateUBalance(req, userObj, balanceObj){
    return new Promise(function(resolve){
    var query = `insert update_balances set ?`
    let upBalance = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    var customer_id = userObj;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance = amount_old - amount_new;
        var new_balances = JSON.stringify(new_balance);
        upBalance = {
            amount: req.body.amount,
            customer_id: customer_id,
            previous_balance: balanceObj[0].balance,
            description: req.body.description,
            ip_address: req.body.ip_address,
            type: 4,
            status: 0,
            remaining_balance: new_balances,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        connection.query(query,upBalance, function(err, results){
            if(err){
                throw err;
            }
            else{
                //console.log("---------------------------------Upblance result OBJ -> ", results);
                connection.release();
                //console.log(results);
                resolve(results);
            }
        });
    });
});

}

withdrawUpdateUBalance(req, userObj, balanceObj){
    return new Promise(function(resolve){
    var query = `insert update_balances set ?`
    let upBalance = {};
    //var userObj = this.getCustomerByEmail(req.user.email);
    var customer_id = userObj;
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        var amount_new = parseInt(req.body.amount, 10);
        var amount_old = parseInt(balanceObj[0].balance, 10);
        var new_balance = amount_old - amount_new;
        var new_balances = JSON.stringify(new_balance);
        upBalance = {
            amount: req.body.amount,
            customer_id: customer_id,
            previous_balance: balanceObj[0].balance,
            description: req.body.description,
            ip_address: req.body.ip_address,
            type: 3,
            status: 0,
            remaining_balance: new_balances,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        connection.query(query,upBalance, function(err, results){
            if(err){
                throw err;
            }
            else{
                //console.log("---------------------------------Upblance result OBJ -> ", results);
                connection.release();
                //console.log(results);
                resolve(results);
            }
        });
    });
});

}


getFriendList(userObj){
    return new Promise(function(resolve){
    
        // var query = `select * from friends where customer_id = ${userObj}`;
        var query = `select customers.name as friend_name,customers.id as friend_id from customers inner join friends ON customers.id = friends.friend_id && friends.customer_id = ${userObj}`;
       
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
                    // console.log(results);

                    resolve(results);
                }
            });
        });
});

}


getFriendListDetailed(userObj){
    return new Promise(function(resolve){
    
        // var query = `select * from friends where customer_id = ${userObj}`;
        var query = `select customers.name as friend_name,customers.id as friend_id,customers.email as friend_email, customers.phone_number as friend_number from customers inner join friends ON customers.id = friends.friend_id && friends.customer_id = ${userObj}`;
       
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



encryptIt(userObj){
    return new Promise(function(resolve){
    

});

}

















}

module.exports = customer;