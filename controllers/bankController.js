var mySql = require("../config/database");

var bank = require("../models/bank");
var user = require("../models/user");

exports.getAllCustomers = function(req, res){
    var banks = new bank();
    console.log("in getAllCustomers controller");
    banks.getCustomers(req,async function(err, result){
        console.log("type",typeof(err))
       // console.log(err);
        if(result){
            //console.log(err);
            res.json({
                status: 500,
                message: "error in getCustomers: "+err
            });
        } else{
           // console.log(result);
            if(err.length!=0){
                console.log("andr nai aya ")
                //    var prod = await  getproduct(result); 
                //    var offer = await getOffer(prod);  
                //    var branchInfo =await getbranchInfo(result[0].id);
                //    var review =await getbranchReview(result[0].id);
                console.log("result[0].email",err[0].email);
              var customer = await banks.getCustomer(err[0].email);
                   res.json({
                    status: 200,
                    Customer:customer
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
