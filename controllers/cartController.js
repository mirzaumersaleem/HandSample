var Product = require('../models/product');
var Cart = require('../models/cart');
var User = require('../models/user');
var Order = require('../models/order');

exports.addToCartController = function(req, res){
    console.log("Inside add to cart controller");
    
    //req.assert("");
    
    var productId = req.query.id;
    var quantity = req.query.quantity;
    if( !(/^[0-9]+$/.test(quantity)) ){
        return res.json({
            status: 500,
            message:"Invalid quantity"
        })
    }
    console.log("The value of product id is" + productId);
    /*
      If cart is already present in session then pass that old cart
      into the new Cart obj. Else create a new cart and pass it to 
      the new Cart 
    */
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    var product = new Product();

    product.findById(productId, function(err, prod){
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else {
            


            if(req.query.quantity == null){
                cart.addProductToCart(prod, productId);
            } else {
                cart.addProductToCart(prod, productId, req.query.quantity);
            }
            req.session.cart = cart;
            
            console.log("Following items in session cart");
            console.log(req.session.cart);

            res.json({
                status: 200,
                message: "Product added successfully"
            })
        }
    })    
}

exports.shoppingCartController = function(req, res){
    console.log("inside cart controller");
    if(!req.session.cart){
        res.json({
            status: 200,
            cartProducts: {products: null}
       });
       return;
    }
    
    var cart = new Cart(req.session.cart);
    res.json({
        status: 200,
        cartProducts: cart.generateArray(),
        totalQty: cart.totalQty,
        totalPrice: cart.totalPrice
    });
    return;
}

exports.finalCheckoutController = function(req, res){
    //var addressId = req.body.addressId;
    var addressId = 0;
    var user = new User();    
    var order = new Order();
    var cart = req.session.cart;

    if(cart === null) {
        res.json({
            status: 500,
            message: "Cannot proceed with empty cart"
        })
    }

    user.getUserAddressById(addressId, function(err, addressRow){
        if(err)
            throw err;

        order.addNewOrder(cart, req.user.id, addressRow[0].address, function(err){
            if(err){
                res.json({
                    status: 500,
                    message: err
                })
            } else {
                res.json({
                    status: 200,
                    message: "order placed successfully"
                })
            }
                
        });
    });
}
