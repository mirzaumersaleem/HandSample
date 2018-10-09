var bank = require("../models/bank");
var User = require("../models/user");
var customer = require("../models/customer");
var encrypt = require("../models/encryption");

exports.friendSearch = function (req, res) {
    var customers = new customer();
    console.log("in friendSearch Controller");
    customers.getEmail(req, async function (result, err) {
        console.log("type", typeof (err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in friendSearch: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {
                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                //fetching balance instance from DB of user
                var friendsList = await customers.friendSearch(req, userObj[0].id);

                res.json({
                    status: 200,
                    Friends: friendsList
                });
            } else {
                res.json({
                    status: 301,
                    message: "No Customer found"
                });
            }
        }
    });

}

exports.addFriend = function (req, res) {
    var customers = new customer();
    console.log("in addFriend Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getEmail(req, async function (result, err) {
        console.log("type", typeof (err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in addFriend: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {
                var userObj = await customers.getCustomerByEmail(result);
                if (userObj[0].id == req.body.friend_id) {
                    res.json({
                        status: 300,
                        message: "You can't send friend request to yourself"
                    });
                } else {
                    var friendStatus = await customers.addFriend(req, userObj);
                    res.json({
                        status: 200,
                        message: "Friend added Successfully"
                    });
                }
            } else {
                res.json({
                    status: 301,
                    message: "No Customer found"
                });
            }
        }
    });

}


exports.acceptMoneyMenu = function (req, res) {
    var customers = new customer();
    console.log("in acceptMoneyMenu Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in addFriend: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {

                //    var prod = await  getproduct(result); 
                //    var offer = await getOffer(prod);  
                //    var branchInfo =await getbranchInfo(result[0].id);
                //    var review =await getbranchReview(result[0].id);
                var userObj = await customers.getCustomerByEmail(result);
                var menu = await customers.acceptMoneyMenu(req, userObj);
                res.json({
                    status: 200,
                    message: menu
                });
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}

exports.acceptMoney = function (req, res) {
    var customers = new customer();
    console.log("in acceptMoney Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getReceiveValidity(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in acceptMoney: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {
                var sta = 1;
                var r_status = 1;


                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                //fetching balance instance from DB of user
                var balanceObj = await customers.getCustomerBalance(req, userObj[0].id);
                //updating "update_balances" table
                var balanceUpObj = await customers.updateUBalance(req, userObj[0].id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj, sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccounts(req, userObj[0].id, balanceObj);
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
            } else {
                res.json({
                    status: 301,
                    message: "Balance Request Expired"
                });
            }
        }
    });

}



exports.rejectMoney = function (req, res) {
    var customers = new customer();
    console.log("in rejectMoney Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getReceiveValidity(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in rejectMoney: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {


                //fetched money receive request instance from DB
                var userObj = await customers.getReceivedObj(req);

                // var userObj = {
                //     user: {
                //         id: userObjRec[0].sender_id
                //     }
                // }

                console.log("checking id ----> ", userObj[0].sender_id);
                //fetching logged in user's instance by email
                //var userObj =await customers.getCustomerByEmail(result);
                var sta = 2;
                var r_status = 2;
                //fetching balance instance from DB of user
                var balanceObj = await customers.getCustomerBalance(req, userObj[0].sender_id);
                //updating "update_balances" table
                var balanceUpObj = await customers.updateUBalance(req, userObj[0].sender_id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj, sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccounts(req, userObj[0].sender_id, balanceObj);
                //updating "balances" table
                var updatedObj = await customers.updateBalanceSet(req, userObj[0].sender_id, balanceObj);
                //fetched money receive request instance from DB
                var reveivedObj = await customers.getReceivedObj(req);
                // updating the fetched receive request instance in DB
                var updateReceivedObj = await customers.updateReceiveSet(req, reveivedObj, r_status);


                // res.json({ status: 200, message: 'Money Send Successfully' });
                var string = encodeURIComponent(reveivedObj[0].sender_id);
                res.redirect('../users/pushNotification/?receiver_id=' + string);
            } else {
                res.json({
                    status: 301,
                    message: "Request has been expired"
                });
            }
        }
    });

}


exports.acceptMoneyPage = function (req, res) {
    var customers = new customer();
    console.log("in acceptMoney Controller");

    customers.acceptMoneyPage(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in acceptMoneyPage: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {

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
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}


exports.addMoney = function (req, res) {
    var customers = new customer();
    console.log("in acceptMoney Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in acceptMoneyPage: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {


                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                //fetching balance instance from DB of user
                var addMoneyObj = await customers.addMoney(req, userObj[0].id);
                res.json({
                    status: 200,
                    message: addMoneyObj
                });
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}


exports.editUser = function (req, res) {
    var customers = new customer();
    console.log("in editUser Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in editUser: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {


                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);

                var userBank = await customers.editUserBank(req);
                var userRaal = await customers.editUser(req);
                var userObj2 = await customers.getCustomerByEmail(req.body.email);
                res.json({
                    status: 200,
                    message: userObj2
                });
            } else {
                res.json({
                    status: 301,
                    message: "No user found"
                });
            }
        }
    });

}


exports.editPinCode = function (req, res) {
    var customers = new customer();
    console.log("in editPinCode Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in editPinCode: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {


                console.log("1");
                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                // console.log("1.5" , userObj[0]);
                if (userObj[0].secret_password == req.body.pin_code) {

                    // console.log("2");
                    var pinCode = await customers.editPinCode(req);
                    res.json({
                        status: 200,
                        message: "pin code edited successfully"
                    });
                } else {
                    // console.log("3");
                    res.json({
                        status: 201,
                        message: "Invalid pin-code"
                    });

                }
                // console.log("4");
            } else {
                res.json({
                    status: 301,
                    message: "No user found"
                });
            }
        }
    });

}


exports.editPassword = function (req, res) {
    var customers = new customer();
    var user = new User();
    var password = req.body.password;
    console.log("in editPassword Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in editPassword: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {


                console.log("1");
                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                if (userObj.length > 0) {
                    var finalNodeGeneratedHash = userObj[0].password.replace('$2y$', '$2a$');
                }
                if (!user.validPassword(password, finalNodeGeneratedHash)) {
                    console.log("password", password, "checking Password", finalNodeGeneratedHash)
                    console.log("Incorrect password entered");
                    res.json({
                        status: 201,
                        message: "Incorrect Password"
                    });
                }else{
                    var passwordSet = user.generatePasswordHash(req.body.new_password);
                    passwordSet = passwordSet.replace('$2a$', '$2y$');
        
                    var pass = await customers.editPassword(passwordSet,req);
                    var passBank = await customers.editPasswordBank(passwordSet,req);
                    res.json({
                        status: 200,
                        message: "password changed successfully"
                    });

                }

                // console.log("4");
            } else {
                res.json({
                    status: 301,
                    message: "No user found"
                });
            }
        }
    });

}


exports.addMoneyVerified = function (req, res) {
    var customers = new customer();
    console.log("in acceptMoney Controller");
    // var userObj =await customers.getCustomerByEmail(req.user.email);
    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in acceptMoney: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {
                var sta = 1;
                var r_status = 1;


                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                //fetching balance instance from DB of user
                var balanceObj = await customers.getCustomerBalance(req, userObj[0].id);
                //updating "update_balances" table
                var balanceUpObj = await customers.AddupdateUBalance(req, userObj[0].id, balanceObj);
                //updating "update_balance_requests" table
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj, sta);
                //updating "accounts" table
                var accountUpObj = await customers.updateAccounts(req, userObj[0].id, balanceObj);
                //updating "balances" table
                var updatedObj = await customers.updateBalanceSet(req, userObj[0].id, balanceObj);

                res.json({
                    status: 200,
                    message: "Money added to account Successfully"
                });
            } else {
                res.json({
                    status: 301,
                    message: "Error occured"
                });
            }
        }
    });

}


exports.verifyPinAddMoney = function (req, res) {
    var customers = new customer();
    console.log("in verifyPinAddMoney Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in verifyPinAddMoney: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {

                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                var pinObj = await customers.verifyPinAddMoney(req, userObj[0].id);
                //pinObj[0].pin = encrypt.decrypt(pinObj[0].pin);
                if (pinObj[0].pin == req.body.pin) {
                    res.json({ status: 200, message: 'Verified' });
                }
                else {
                    res.json({ status: 500, message: 'Incorrect Pin ' });
                }
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}

exports.accountDetails = function (req, res) {
    var customers = new customer();
    console.log("in accountDetails Controller");

    customers.getEmail(req, async function (result, err) {
        if (err) {
            res.json({
                status: 500,
                message: "error in accountDetails: " + err
            });
        } else {
            var sta = 1;
            if (result.length != 0) {

                var userObj = await customers.getCustomerByEmail(req.user.email);
                var balanceObj = await customers.getCustomerBalance(req, userObj[0].id);

                res.json({ status: 200, balance: balanceObj[0].balance, account_no: balanceObj[0].account_no });


            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}


exports.payTransaction = function (req, res) {
    var customers = new customer();
    console.log("in payTransaction Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in payTransaction: " + err
            });
        } else {
            var sta = 1;
            // console.log(result);
            if (result.length != 0) {

                //fetching logged in user's instance by email 
                var userObj = await customers.getCustomerByEmail(req.user.email);
                var pinObj = await customers.getPinVerification(userObj[0].id);
                console.log("pinObj",pinObj)
                console.log("userObj",userObj);
                console.log("req.body",req.body);
                if (pinObj[0].pin == req.body.pin) {
                    //fetching balance instance from DB of user
                    // console.log("pinObj ====" , pinObj[0].pin);
                    var balanceObj = await customers.getCustomerBalance(req, userObj[0].id);
                    console.log("balanceObj",balanceObj.length);
                    if(balanceObj.length!=0){
                    if (balanceObj[0].balance - req.body.amount < 0 || !balanceObj[0].balance) {
                        // console.log("balance diff ", balanceObj[0].balance - req.body.amount);
                        res.json({ status: 204, message: 'Transaction Failed, insufficient balance' });
                    } else {
                        //updating "update_balances" table
                        var balanceUpObj = await customers.transUpdateUBalance(req, userObj[0].id, balanceObj);
                        //updating "update_balance_requests" table
                        var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj, sta);
                        //updating "accounts" table
                        var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj, 2);
                        //updating "balances" table
                        var updatedObj = await customers.transUpdateBalanceSet(req, userObj[0].id, balanceObj);
                        //fetched money receive request instance from DB
                        var reveivedObj = await customers.getObjbyAccount(req);
                        // updating the fetched receive request instance in DB

                        //  console.log("Check Obj ====" , reveivedObj[0].customer_id);
                        var updateReceivedObj = await customers.transReceiveSet(req, reveivedObj[0].customer_id, userObj[0].id);
                        var string = encodeURIComponent(reveivedObj[0].customer_id);
                        res.redirect('../users/pushNotification/?receiver_id=' + string);
                    }
                }else{
                    res.json({ status: 204, message: 'Transaction Failed, No Account Found ' });
                   
                }
                }
                else {
                    res.json({ status: 500, message: 'Please enter valid pin..!' });
                }
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });
}
exports.sendMoneyPage = function (req, res) {
    var customers = new customer();
    console.log("in sendMoneyPage Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in sendMoneyPage: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {

                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                console.log("this is obj -> ", userObj[0]);
                var friendsObj = await customers.getFriendList(userObj[0].id);

                if (friendsObj.length != 0) {
                    res.json({ status: 200, message: friendsObj });
                }
                else {
                    res.json({ status: 500, message: 'No Friend Found' });
                }
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}

exports.shareMoneyPage = function (req, res) {
    var customers = new customer();
    console.log("in shareMoneyPage Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in shareMoneyPage: " + err
            });
        } else {
            // console.log(result);
            if (result.length != 0) {

                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                var friendsObj = await customers.getFriendListDetailed(userObj[0].id);
                if (friendsObj.length != 0) {
                    res.json({ status: 200, message: friendsObj });
                }
                else {
                    res.json({ status: 500, message: 'No Friend Found' });
                }
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}



exports.sendMoney = function (req, res) {
    var customers = new customer();
    console.log("in sendMoney Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in sendMoney: " + err
            });
        } else {
            var sta = 1;
            // console.log(result);
            if (result.length != 0) {

                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                var pinObj = await customers.getPinVerification(userObj[0].id);
                if (pinObj[0].pin == req.body.pin) {
                    //fetching balance instance from DB of user
                    var balanceObj = await customers.getCustomerBalance(req, userObj[0].id);
                    if (balanceObj[0].balance - req.body.amount < 0 || !balanceObj[0].balance) {

                        res.json({ status: 204, message: 'Transaction Failed, insufficient balance' });
                    } else {
                        //updating "update_balances" table
                        var balanceUpObj = await customers.sendUpdateUBalance(req, userObj[0].id, balanceObj);
                        //updating "update_balance_requests" table
                        var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj, sta);
                        //updating "accounts" table
                        var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj, 5);
                        //updating "balances" table
                        var updatedObj = await customers.transUpdateBalanceSet(req, userObj[0].id, balanceObj);
                        //fetched money receive request instance from DB
                        //var reveivedObj = await customers.getObjById(req, userObj[0].id);

                        //  console.log("Check Obj ====" , reveivedObj[0].customer_id);
                        var updateReceivedObj = await customers.sendMoneyRec(req, req.body.friend_id, userObj[0].id);


                        var string = encodeURIComponent(req.body.friend_id);
                        res.redirect('../users/pushNotification/?receiver_id=' + string);
                    }
                }
                else {
                    res.json({ status: 500, message: 'Please enter valid pin..!' });
                }
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}


exports.sendGift = function (req, res) {
    var customers = new customer();
    console.log("in sendGift Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in sendGift: " + err
            });
        } else {
            var sta = 1;
            // console.log(result);
            if (result.length != 0) {

                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                var pinObj = await customers.getPinVerification(userObj[0].id);
                console.log("pin Obj ====", pinObj);
                if (pinObj[0].pin == req.body.pin) {
                    //fetching balance instance from DB of user
                    var balanceObj = await customers.getCustomerBalance(req, userObj[0].id);
                    if (balanceObj[0].balance - req.body.amount < 0 || !balanceObj[0].balance) {

                        res.json({ status: 204, message: 'Transaction Failed, insufficient balance' });
                    } else {
                        //updating "update_balances" table
                        var balanceUpObj = await customers.giftUpdateUBalance(req, userObj[0].id, balanceObj);
                        //updating "update_balance_requests" table
                        var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj, sta);
                        //updating "accounts" table
                        var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj, 6);
                        //updating "balances" table
                        var updatedObj = await customers.transUpdateBalanceSet(req, userObj[0].id, balanceObj);
                        //fetched money receive request instance from DB
                        //var reveivedObj = await customers.getObjById(req, userObj[0].id);

                        //  console.log("Check Obj ====" , reveivedObj[0].customer_id);
                        var updateReceivedObj = await customers.giftMoneyRec(req, req.body.friend_id, userObj[0].id);


                        // res.json({ status: 200, message: 'Money Send Successfully' });
                        var string = encodeURIComponent(req.body.friend_id);
                        res.redirect('../users/pushNotification/?receiver_id=' + string);
                    }
                }
                else {
                    res.json({ status: 500, message: 'Please enter valid pin..!' });
                }
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}


exports.shareMoney = function (req, res) {
    var customers = new customer();
    console.log("in shareMoney Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in shareMoney: " + err
            });
        } else {
            var sta = 1;
            // console.log(result);
            if (result.length != 0) {

                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                var pinObj = await customers.getPinVerification(userObj[0].id);
                if (pinObj[0].pin == req.body.pin) {
                    //fetching balance instance from DB of user
                    var balanceObj = await customers.getCustomerBalance(req, userObj[0].id);
                    if (balanceObj[0].balance - req.body.amount < 0 || !balanceObj[0].balance) {

                        res.json({ status: 204, message: 'Transaction Failed, insufficient balance' });
                    } else {
                        //updating "update_balances" table
                        var balanceUpObj = await customers.shareUpdateUBalance(req, userObj[0].id, balanceObj);
                        //updating "update_balance_requests" table
                        var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj, sta);
                        //updating "accounts" table
                        var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj, 4);
                        //updating "balances" table
                        var updatedObj = await customers.transUpdateBalanceSet(req, userObj[0].id, balanceObj);
                        //fetched money receive request instance from DB
                        //var reveivedObj = await customers.getObjById(req, userObj[0].id);

                        //  console.log("Check Obj ====" , reveivedObj[0].customer_id);
                        var updateReceivedObj = await customers.sendMoneyRec(req, req.body.friend_id, userObj[0].id);


                        var string = encodeURIComponent(req.body.friend_id);
                        res.redirect('../users/pushNotification/?receiver_id=' + string);
                    }
                }
                else {
                    res.json({ status: 500, message: 'Please enter valid pin..!' });
                }
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}


exports.withDrawMoney = function (req, res) {
    var customers = new customer();
    console.log("in withDrawMoney Controller");

    customers.getEmail(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in withDrawMoney: " + err
            });
        } else {
            var sta = 0;
            // console.log(result);
            if (result.length != 0) {

                //fetching logged in user's instance by email
                var userObj = await customers.getCustomerByEmail(req.user.email);
                var pinObj = await customers.getPinVerification(userObj[0].id);
                if (pinObj[0].pin == req.body.pin) {
                    //fetching balance instance from DB of user
                    var balanceObj = await customers.getCustomerBalance(req, userObj[0].id);
                    if (balanceObj[0].balance - req.body.amount < 0 || !balanceObj[0].balance) {

                        res.json({ status: 204, message: 'Withdrawal Request Failed, insufficient balance' });
                    } else {
                        //updating "update_balances" table
                        var balanceUpObj = await customers.withdrawUpdateUBalance(req, userObj[0].id, balanceObj);
                        //updating "update_balance_requests" table
                        var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj, sta);
                        //updating "accounts" table
                        var accountUpObj = await customers.updateAccount(req, userObj[0].id, balanceObj, 3);
                        //updating "balances" table
                        var updatedObj = await customers.transUpdateBalanceSet(req, userObj[0].id, balanceObj);
                        //fetched money receive request instance from DB
                        //var reveivedObj = await customers.getObjById(req, userObj[0].id);

                        res.json({ status: 200, message: 'Withdrawal request send Successfully, you will be contacted shortly for withdrawal' });
                    }
                }
                else {
                    res.json({ status: 500, message: 'Please enter valid pin..!' });
                }
            } else {
                res.json({
                    status: 301,
                    message: "No request found"
                });
            }
        }
    });

}

exports.testController = function (req, res) {
    var customers = new customer();
    console.log("in testController Controller");

    // var userObj = await customers.encryptIt();
    customers.getEmailer(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in testController: " + err
            });
        } else {

            // console.log(result);
            //console.log(result);
            var userObj = await customers.decryptIt(req.body.text);
            res.json({
                status: 200,
                messages: userObj
            });

        }
    });


}

exports.testController2 = function (req, res) {
    var customers = new customer();
    console.log("in testController2 Controller");

    // var userObj = await customers.encryptIt();
    customers.getEmailer(req, async function (result, err) {
        //console.log("type",typeof(err))
        // console.log(err);
        if (err) {
            //console.log(err);
            res.json({
                status: 500,
                message: "error in testController: " + err
            });
        } else {

            // console.log(result);
            //console.log(result);
            var userObj = await customers.decryptIt(req.body.text);
            res.json({
                status: 200,
                messages: userObj
            });

        }
    });


}
