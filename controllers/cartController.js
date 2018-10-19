var Product = require('../models/product');
var Cart = require('../models/cart');
var User = require('../models/user');
var Order = require('../models/order');

exports.addToCartController = function (req, res) {
    console.log("Inside add to cart controller");
    //req.assert("");
    var productId = req.query.id;
    var quantity = Number(req.query.quantity);
    var price = Number(req.query.price);
    if (!(/^[0-9]+$/.test(quantity))) {
        return res.json({
            status: 500,
            message: "Invalid quantity"
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

    product.findProductById(productId, function (err, prod) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            try {
                cart.addProductToCart(prod, productId, req.query.quantity, price, req);
            }
            catch (e) {
                if (e == 1) {
                    res.json({
                        status: 200,
                        message: "Product Already Exist, Kindly Check Your Cart",
                    })
                }
                if (e == 2) {
                    req.session.cart = cart;
                    console.log("Following items in session cart");
                    console.log(req.session.cart);
                    res.json({
                        status: 200,
                        message: "Product added ",
                        cartProducts: cart.generateArray(),
                    })
                }
                if (e == 3) {
                    res.json({
                        status: 300,
                        message: "Please Select Product/Offer from one Resturant at a time.",
                    })
                }
            }
        }
    })
}
exports.addOfferToCartController = function (req, res) {
    console.log("Inside add to cart controller");
    var productId = Number(req.query.id);
    var quantity = Number(req.query.quantity);
    var number = Number(req.query.price);
    if (!(/^[0-9]+$/.test(quantity))) {
        return res.json({
            status: 500,
            message: "Invalid quantity"
        })
    }
    /*
      If cart is already present in session then pass that old cart
      into the new Cart obj. Else create a new cart and pass it to 
      the new Cart 
    */
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = new Product();

    product.findOffertById(productId, function (err, prod) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            try {
                cart.addOfferToCart(prod, productId, req.query.quantity, req.query.price, req.query.discount_price, req);
            } catch (e) {
                console.log(e);
                if (e == 1) {
                    res.json({
                        status: 200,
                        message: "Product Already Exist, Kindly Check Your Cart",
                    })
                }
                if (e == 2) {
                    req.session.cart = cart;
                    console.log("Following items in session cart");
                    console.log(req.session.cart);
                    res.json({
                        status: 200,
                        message: "Offer added",
                        cartProducts: cart.generateArray(),
                    })
                }
                if (e == 3) {
                    res.json({
                        status: 300,
                        message: "Please Select Product/Offer from one Resturant at a time.",
                    })
                }
            }
        }
    })
}
exports.shoppingCartController = function (req, res) {
    console.log("inside cart controller");
    if (!req.session.cart) {
        res.json({
            status: 200,
            cartProducts: { products: null }
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
exports.finalCheckoutController = function (req, res) {
    // var addressId = req.body.billing_id;
    // var shippingId = req.body.shipping_id;
    var comments = req.body.comments;
    var user = new User();
    var order = new Order();
    if (req.session.cart == null) {
        return res.json({
            status: 500,
            message: "Cannot proceed with empty cart"
        });
    }
    var user = new User();
    var ID = req.body.shippingId;
    var cart = new Cart(req.session.cart);
    var sub_total = cart.totalPrice;
    user.getUserAddressById(req.user.id, async function (err, addressRow) {
        // console.log("address", addressRow);
        if (err) {
            res.json({
                status: 500,
                message: err 
            });
        }
        else {
            order.addNewOrder(req, cart, req.user.id, comments, sub_total, async function (err) {
                if (err) { 
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
        }
    });
}
exports.editShoppingCartController = async function (req, res) {
    console.log("Inside Edit to cart controller");
    //req.assert("");
    /*
      If cart is already present in session then pass that old cart
      into the new Cart obj. Else create a new cart and pass it to 
      the new Cart
    */
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = new Product();
    var productId = Number(req.query.productId);
    var qty = Number(req.query.quantity);
    // var price=Number(req.query.price)
    if (!(/^[1-9]+$/.test(qty))) {
        return res.json({
            status: 500,
            message: "Invalid quantity"
        })
    }
    product.findById(productId, async function (err, prod) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            req.session.cart = cart;
            cart.editProductfromCart(productId, qty, cart);
            console.log("Following items in session cart");
            console.log(req.session.cart);
            res.json({
                status: 200,
                message: "Product Edit successfully",
                data: req.session.cart,
            })
        }
    })
}
exports.deleteShoppingCartController = function (req, res) {
    console.log("Inside delete to cart controller");

    //req.assert("");
    /*
    
      If cart is already present in session then pass that old cart
      into the new Cart obj. Else create a new cart and pass it to 
      the new Cart

    */
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    var product = new Product();
    var productId = Number(req.query.productId);
    var price_1 = req.query.price_1;
    product.findById(productId, function (err, prod) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            req.session.cart = cart;
            cart.deleteProductfromCart(productId, price_1, req.session.cart);
            var size_of_cart=cart.generateArray();
            console.log("size_of_cart.length",size_of_cart.length);
            size_of_cart=size_of_cart.length;
            if (size_of_cart != 0) {
                res.json({
                    status: 200,
                    message: "Product deleted successfully",
                    data: req.session.cart,
                })
            } else {
                req.session.cart=null;
                res.json({
                    status: 200,
                    message: "Product deleted successfully",
                    data: req.session.cart,
                })
            } 

        }
    })
}
exports.deleteCompleteCart = function (req, res) {
    console.log("Inside delete to cart controller");

    //req.assert("");
    /*
    
      If cart is already present in session then pass that old cart
      into the new Cart obj. Else create a new cart and pass it to 
      the new Cart

    */
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    req.session.cart = null;
    console.log("req.session.cart", req.session.cart);
    res.json({
        status: 200,
        message: "Cart deleted successfully",
        data: req.session.cart,
    })


}
