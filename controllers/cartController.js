var Product = require('../models/product');
var Cart = require('../models/cart');
var User = require('../models/user');
var Order = require('../models/order');

exports.addToCartController = function(req, res){
    console.log("Inside add to cart controller");
    var productId = req.params.id;
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

            cart.addProductToCart(prod, productId);
            req.session.cart = cart;
            
            console.log("Following items in session cart");
            console.log(req.session.cart);

            var backurl = req.header('Referer') || '/';
            res.redirect(backurl);
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