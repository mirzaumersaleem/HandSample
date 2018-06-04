var bank = require("../models/bank");
var user = require("../models/user");
var customer = require("../models/customer");

exports.friendSearch = function (req, res){
    var customers = new customer();
    console.log("in friendSearch Controller");
    customers.getEmail(req,async function(result, err){
        console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in friendSearch: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                //fetching balance instance from DB of user
                var friendsList = await customers.friendSearch(req,userObj[0].id);
                //updating "update_balances" table
                
                //    var prod = await  getproduct(result); 
                //    var offer = await getOffer(prod);  
                //    var branchInfo =await getbranchInfo(result[0].id);
                //    var review =await getbranchReview(result[0].id);
             // var customer = await banks.getCustomer(result[0].email);
                   res.json({
                    status: 200,
                    Friends: friendsList
                });               
            }else{
                res.json({
                    status: 301,
                    message: "No Customer found"
                });    
            }
        }
    });

}

exports.addFriend = function (req, res){
    var customers = new customer();
    console.log("in addFriend Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getEmail(req,async function(result, err){
        console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in addFriend: "+err
            });
        } else{
           // console.log(result);
                if(result.length!=0){
                    
                    //    var prod = await  getproduct(result); 
                    //    var offer = await getOffer(prod);  
                    //    var branchInfo =await getbranchInfo(result[0].id);
                    //    var review =await getbranchReview(result[0].id);
                    var userObj =await customers.getCustomerByEmail(result);
                    if(userObj[0].id == req.body.friend_id){
                        res.json({
                            status: 300,
                            message: "You can't send friend request to yourself"
                        });   
                    }else{
                    var friendStatus = await customers.addFriend(req,userObj);
                    res.json({
                        status: 200,
                        message: "Friend added Successfully"
                    });  
                }             
            }else{
                res.json({
                    status: 301,
                    message: "No Customer found"
                });    
            }
        }
    });

}


exports.acceptMoneyMenu = function (req, res){
    var customers = new customer();
    console.log("in acceptMoneyMenu Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in addFriend: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){
                
                //    var prod = await  getproduct(result); 
                //    var offer = await getOffer(prod);  
                //    var branchInfo =await getbranchInfo(result[0].id);
                //    var review =await getbranchReview(result[0].id);
                var userObj =await customers.getCustomerByEmail(result);
                var menu = await customers.acceptMoneyMenu(req,userObj);
                   res.json({
                    status: 200,
                    message: menu
                });               
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}

exports.acceptMoney = function (req, res){
    var customers = new customer();
    console.log("in acceptMoney Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getReceiveValidity(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in acceptMoney: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){
                var sta = 1;
                var r_status = 1;

                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                //fetching balance instance from DB of user
                var balanceObj = await customers.getCustomerBalance(req,userObj[0].id);
                //updating "update_balances" table
                var balanceUpObj = await customers.updateUBalance(req, userObj[0].id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj,sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj);
                //updating "balances" table
                var updatedObj = await customers.updateBalanceSet(req, userObj[0].id, balanceObj);
                //fetched money receive request instance from DB
                var reveivedObj = await customers.getReceivedObj(req);
                // updating the fetched receive request instance in DB
                var updateReceivedObj = await customers.updateReceiveSet(req, reveivedObj, r_status);


                   res.json({
                    status: 200,
                    message: "Balance added Successfully"
                });               
            }else{
                res.json({
                    status: 301,
                    message: "Balance Request Expired"
                });    
            }
        }
    });

}



exports.rejectMoney = function (req, res){
    var customers = new customer();
    console.log("in rejectMoney Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getReceiveValidity(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in rejectMoney: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){


                //fetched money receive request instance from DB
                var userObj = await customers.getReceivedObj(req);

                // var userObj = {
                //     user: {
                //         id: userObjRec[0].sender_id
                //     }
                // }
                
                console.log("checking id ----> ",userObj[0].sender_id);
                //fetching logged in user's instance by email
                //var userObj =await customers.getCustomerByEmail(result);
                var sta = 2;
                var r_status = 2;
                //fetching balance instance from DB of user
                var balanceObj = await customers.getCustomerBalance(req,userObj[0].sender_id);
                //updating "update_balances" table
                var balanceUpObj = await customers.updateUBalance(req, userObj[0].sender_id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj,sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccount(req, userObj[0].sender_id, balanceObj);
                //updating "balances" table
                var updatedObj = await customers.updateBalanceSet(req, userObj[0].sender_id, balanceObj);
                //fetched money receive request instance from DB
                var reveivedObj = await customers.getReceivedObj(req);
                // updating the fetched receive request instance in DB
                var updateReceivedObj = await customers.updateReceiveSet(req, reveivedObj, r_status);
               
                   res.json({
                    status: 200,
                    message: "Amount returned Successfully"
                });               
            }else{
                res.json({
                    status: 301,
                    message: "Request has been expired"
                });    
            }
        }
    });

}


exports.acceptMoneyPage = function (req, res){
    var customers = new customer();
    console.log("in acceptMoney Controller");
    
    customers.acceptMoneyPage(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in acceptMoneyPage: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){
                
                //    var prod = await  getproduct(result); 
                //    var offer = await getOffer(prod);  
                //    var branchInfo =await getbranchInfo(result[0].id);
                //    var review =await getbranchReview(result[0].id);
                //var userObj =await customers.getCustomerByEmail(result);
                //var menu = await customers.acceptMoneyMenu(req,userObj);
                   res.json({
                    status: 200,
                    message: result
                });               
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}


exports.addMoney = function(req, res){
    var customers = new customer();
    console.log("in acceptMoney Controller");
    
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in acceptMoneyPage: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){
                
                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                //fetching balance instance from DB of user
                var addMoneyObj = await customers.addMoney(req,userObj[0].id);
                   res.json({
                    status: 200,
                    message: addMoneyObj
                });               
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}


exports.addMoneyVerified = function (req, res){
    var customers = new customer();
    console.log("in acceptMoney Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in acceptMoney: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){
                var sta = 1;
                var r_status = 1;

                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                //fetching balance instance from DB of user
                var balanceObj = await customers.getCustomerBalance(req,userObj[0].id);
                //updating "update_balances" table
                var balanceUpObj = await customers.AddupdateUBalance(req, userObj[0].id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj,sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccounts(req, userObj[0].id, balanceObj);
                //updating "balances" table
                var updatedObj = await customers.updateBalanceSet(req, userObj[0].id, balanceObj);

                   res.json({
                    status: 200,
                    message: "Money added to account Successfully"
                });               
            }else{
                res.json({
                    status: 301,
                    message: "Error occured"
                });    
            }
        }
    });

}


exports.verifyPinAddMoney = function (req, res){
    var customers = new customer();
    console.log("in verifyPinAddMoney Controller");
    
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in verifyPinAddMoney: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){
                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                var pinObj = await customers.verifyPinAddMoney(req,userObj[0].id);
                if(pinObj[0].pin == req.body.pin){
                    res.json({ status: 200, message: 'Verified' });
                }
                else{
                    res.json({ status: 500, message: 'Incorrect Pin '});
                }  
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}


exports.payTransaction = function (req, res){
    var customers = new customer();
    console.log("in payTransaction Controller");
    
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in payTransaction: "+err
            });
        } else{
            var sta = 1;
           // console.log(result);
            if(result.length!=0){
                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                var pinObj =await customers.getPinVerification(userObj[0].id);
                if(pinObj[0].pin == req.body.pin){
                //fetching balance instance from DB of user
                // console.log("pinObj ====" , pinObj[0].pin);
                var balanceObj = await customers.getCustomerBalance(req,userObj[0].id);
                if(balanceObj[0].balance - req.body.amount < 0){
                    
                    res.json({ status: 200, message: 'Transaction Failed, insufficient balance' });
                }else{
                //updating "update_balances" table
                var balanceUpObj = await customers.transUpdateUBalance(req, userObj[0].id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj,sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj, 2);
                //updating "balances" table
                var updatedObj = await customers.transUpdateBalanceSet(req, userObj[0].id, balanceObj);
                //fetched money receive request instance from DB
                var reveivedObj = await customers.getObjbyAccount(req);
                // updating the fetched receive request instance in DB
                
                //  console.log("Check Obj ====" , reveivedObj[0].customer_id);
                var updateReceivedObj = await customers.transReceiveSet(req, reveivedObj[0].customer_id, userObj[0].id);

                
                    res.json({ status: 200, message: 'Transaction Successfull' });
                }
            }
                else{
                    res.json({ status: 500, message: 'Please enter valid pin..!'});
                }  
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}


exports.sendMoneyPage = function(req, res){
    var customers = new customer();
    console.log("in sendMoneyPage Controller");
  
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in sendMoneyPage: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){
                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                console.log("this is obj -> ",userObj[0]);
                var friendsObj = await customers.getFriendList(userObj[0].id);

                if(friendsObj.length != 0){
                    res.json({ status: 200, message: friendsObj });
                }
                else{
                    res.json({ status: 500, message: 'No Friend Found'});
                }  
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}

exports.shareMoneyPage = function(req, res){
    var customers = new customer();
    console.log("in shareMoneyPage Controller");
  
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in shareMoneyPage: "+err
            });
        } else{
           // console.log(result);
            if(result.length!=0){
                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                var friendsObj = await customers.getFriendListDetailed(userObj[0].id);
                if(friendsObj.length != 0){
                    res.json({ status: 200, message: friendsObj });
                }
                else{
                    res.json({ status: 500, message: 'No Friend Found'});
                }  
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}



exports.sendMoney = function (req, res){
    var customers = new customer();
    console.log("in sendMoney Controller");
    
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in sendMoney: "+err
            });
        } else{
            var sta = 1;
           // console.log(result);
            if(result.length!=0){
                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                var pinObj =await customers.getPinVerification(userObj[0].id);
                if(pinObj[0].pin == req.body.pin){
                //fetching balance instance from DB of user
                var balanceObj = await customers.getCustomerBalance(req,userObj[0].id);
                if(balanceObj[0].balance - req.body.amount < 0){
                    
                    res.json({ status: 200, message: 'Transaction Failed, insufficient balance' });
                }else{
                //updating "update_balances" table
                var balanceUpObj = await customers.sendUpdateUBalance(req, userObj[0].id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj,sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj, 5);
                //updating "balances" table
                var updatedObj = await customers.transUpdateBalanceSet(req, userObj[0].id, balanceObj);
                //fetched money receive request instance from DB
                //var reveivedObj = await customers.getObjById(req, userObj[0].id);
                
                //  console.log("Check Obj ====" , reveivedObj[0].customer_id);
                var updateReceivedObj = await customers.sendMoneyRec(req, req.body.friend_id, userObj[0].id);

                
                    res.json({ status: 200, message: 'Money Send Successfully' });
                }
            }
                else{
                    res.json({ status: 500, message: 'Please enter valid pin..!'});
                }  
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}


exports.sendGift = function (req, res){
    var customers = new customer();
    console.log("in sendGift Controller");
    
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in sendGift: "+err
            });
        } else{
            var sta = 1;
           // console.log(result);
            if(result.length!=0){
                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                var pinObj =await customers.getPinVerification(userObj[0].id);
                if(pinObj[0].pin == req.body.pin){
                //fetching balance instance from DB of user
                var balanceObj = await customers.getCustomerBalance(req,userObj[0].id);
                if(balanceObj[0].balance - req.body.amount < 0){
                    
                    res.json({ status: 200, message: 'Transaction Failed, insufficient balance' });
                }else{
                //updating "update_balances" table
                var balanceUpObj = await customers.giftUpdateUBalance(req, userObj[0].id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj,sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj, 6);
                //updating "balances" table
                var updatedObj = await customers.transUpdateBalanceSet(req, userObj[0].id, balanceObj);
                //fetched money receive request instance from DB
                //var reveivedObj = await customers.getObjById(req, userObj[0].id);
                
                //  console.log("Check Obj ====" , reveivedObj[0].customer_id);
                var updateReceivedObj = await customers.giftMoneyRec(req, req.body.friend_id, userObj[0].id);

                
                    res.json({ status: 200, message: 'Money Send Successfully' });
                }
            }
                else{
                    res.json({ status: 500, message: 'Please enter valid pin..!'});
                }  
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}


exports.shareMoney = function (req, res){
    var customers = new customer();
    console.log("in shareMoney Controller");
    
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in shareMoney: "+err
            });
        } else{
            var sta = 1;
           // console.log(result);
            if(result.length!=0){
                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                var pinObj =await customers.getPinVerification(userObj[0].id);
                if(pinObj[0].pin == req.body.pin){
                //fetching balance instance from DB of user
                var balanceObj = await customers.getCustomerBalance(req,userObj[0].id);
                if(balanceObj[0].balance - req.body.amount < 0){
                    
                    res.json({ status: 200, message: 'Transaction Failed, insufficient balance' });
                }else{
                //updating "update_balances" table
                var balanceUpObj = await customers.shareUpdateUBalance(req, userObj[0].id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj,sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj, 4);
                //updating "balances" table
                var updatedObj = await customers.transUpdateBalanceSet(req, userObj[0].id, balanceObj);
                //fetched money receive request instance from DB
                //var reveivedObj = await customers.getObjById(req, userObj[0].id);
                
                //  console.log("Check Obj ====" , reveivedObj[0].customer_id);
                var updateReceivedObj = await customers.sendMoneyRec(req, req.body.friend_id, userObj[0].id);

                
                    res.json({ status: 200, message: 'Money Shared Successfully' });
                }
            }
                else{
                    res.json({ status: 500, message: 'Please enter valid pin..!'});
                }  
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}


exports.withDrawMoney = function (req, res){
    var customers = new customer();
    console.log("in withDrawMoney Controller");
    
    customers.getEmail(req,async function(result, err){
        //console.log("type",typeof(err))
       // console.log(err);
        if(err){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in withDrawMoney: "+err
            });
        } else{
            var sta = 0;
           // console.log(result);
            if(result.length!=0){
                
                //fetching logged in user's instance by email
                var userObj =await customers.getCustomerByEmail(req.user.email);
                var pinObj =await customers.getPinVerification(userObj[0].id);
                if(pinObj[0].pin == req.body.pin){
                //fetching balance instance from DB of user
                var balanceObj = await customers.getCustomerBalance(req,userObj[0].id);
                if(balanceObj[0].balance - req.body.amount < 0 || !balanceObj[0].balance){
                    
                    res.json({ status: 200, message: 'Withdrawal Request Failed, insufficient balance' });
                }else{
                //updating "update_balances" table
                var balanceUpObj = await customers.withdrawUpdateUBalance(req, userObj[0].id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj,sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj, 3);
                //updating "balances" table
                var updatedObj = await customers.transUpdateBalanceSet(req, userObj[0].id, balanceObj);
                //fetched money receive request instance from DB
                //var reveivedObj = await customers.getObjById(req, userObj[0].id);
                
                    res.json({ status: 200, message: 'Withdrawal request send Successfully, you will be contacted shortly for withdrawal' });
                }
            }
                else{
                    res.json({ status: 500, message: 'Please enter valid pin..!'});
                }  
            }else{
                res.json({
                    status: 301,
                    message: "No request found"
                });    
            }
        }
    });

}
