var mySql = require('../config/database');
var moment = require('moment');
var Cart = require('./cart');
class Order {
    constructor() {
        this.addOrderItems = function (cart, orderedId, callback) {
            var productsInCart = cart.generateArray();
            console.log(cart, 'productsInCart');
            var orderItemsArray = [];
            //Creating array of order items so that it can be added asynchronously
            for (var i = 0; i < productsInCart.length; i++) {
                if (productsInCart[i].item.id >= 200) {
                    productsInCart[i].item.id = productsInCart[i].item.id - 200;
                    var newItem = [orderedId,0, productsInCart[i].item.id, productsInCart[i].qty, productsInCart[i].price];
                    orderItemsArray.push(newItem);
                } else {
                    var newItem = [orderedId, productsInCart[i].item.id,0, productsInCart[i].qty, productsInCart[i].price];
                    orderItemsArray.push(newItem);
                }
            }

            var query = "INSERT INTO myraal_raal.order_items (order_id, product_id,offer_id, qty, unit_price) VALUES ?";
            mySql.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(query, [orderItemsArray], async function (err, rows) {
                    callback(err, rows); //Passing results to callback function
                });
            });
        }
    }
    addNewOrder(req, cart, userId, comments,sub_total, callback) {
        /*
            The generate array in Cart class would return
            all the products present in the cart.
        */
       //var cart = new Cart(req.session.cart);
        var productsInCart = cart.generateArray();
        console.log("Inside add New Order model","cart",cart.cityId,cart.branchId);
        var productsInCart = cart.generateArray();
        // addressRow = JSON.stringify(addressRow);
        var order_obj = {
            user_id: req.user.id,
            comment: comments,
            status: 0,
            sub_total: sub_total,
            total: sub_total,
            city_id:cart.cityId,
            branch_id:cart.branchId,
            order_type:cart.orderType,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        var newOrderQuery = `INSERT INTO myraal_raal.orders set ?`
        /*
        Insert a new order and get the id of the row inserted in order table
        The id would be used to add order items in order items table
        */
        console.log("address", newOrderQuery);
        var orderItemFunction = this.addOrderItems;

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(newOrderQuery, order_obj, function (err, result) {
                connection.release()
                if (err) {
                    callback(err);
                } else {
                    orderItemFunction(cart, result.insertId, (err) => {
                        if (err)
                            callback(err);
                        else
                            callback(null);
                    });
                }
            });
        });
    }
}

module.exports = Order;
