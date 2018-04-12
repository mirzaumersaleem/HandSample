var express = require('express');
var router = express.Router();

var cartController = require('../controllers/cartController');

router.get('/addtocart', function(req, res){
    cartController.addToCartController(req, res);
})

router.get('/shopping-cart', function(req, res){
    cartController.shoppingCartController(req, res);
});

router.get('/final-checkout', function(req, res){
    cartController.finalCheckoutController(req, res);
});

router.post('/final-checkout', function(req, res){
    cartController.finalCheckoutController(req, res);
});

module.exports = router;
