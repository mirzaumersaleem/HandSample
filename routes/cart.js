var express = require('express');
var router = express.Router();

var cartController = require('../controllers/cartController');

router.get('/addtocart/:id', function(req, res){
    cartController.addToCartController(req, res);
})

router.get('/shopping-cart', function(req, res){
    cartController.shoppingCartController(req, res);
});

module.exports = router;