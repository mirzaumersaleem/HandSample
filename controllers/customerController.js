var bank = require("../models/bank");
var user = require("../models/user");
var customer = require("../models/customer");

exports.friendSearch = function (req, res){
    var customers = new customer();
    console.log("in friendSearch Controller");
    customers.friendSearch(req,async function(result, err){
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
                
                //    var prod = await  getproduct(result); 
                //    var offer = await getOffer(prod);  
                //    var branchInfo =await getbranchInfo(result[0].id);
                //    var review =await getbranchReview(result[0].id);
             // var customer = await banks.getCustomer(result[0].email);
                   res.json({
                    status: 200,
                    Friends: result
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
                var friendStatus = await customers.addFriend(req,userObj);
                   res.json({
                    status: 200,
                    message: "Friend added Successfully"
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
    console.log("in acceptMoneyPage Controller");
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
                var userObj =await customers.getCustomerByEmail(result);
                var balanceObj = await customers.getCustomerBalance(req,userObj);
                var balanceUpObj = await customers.updateUBalance(req, userObj, balanceObj);
                var balanceReqObj = await customers.updateBalanceReq(req, balanceUpObj);
                var accountUpObj = await customers.updateAccount(req, userObj);
                var updatedObj = await customers.updateBalanceSet(req, userObj, balanceObj);
                var reveivedObj = await customers.getReceivedObj(req);
                var updateReceivedObj = await customers.updateReceiveSet(req, reveivedObj);


                   res.json({
                    status: 200,
                    message: "Balance added Successfully"
                });               
            }else{
                res.json({
                    status: 301,
                    message: "Balance update failed"
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