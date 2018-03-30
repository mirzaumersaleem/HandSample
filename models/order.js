var mySql = require('../config/database');

class Order{
    constructor(){ 
    }

    addOrderItems(cart, orderId, callback){
        var productsInCart = cart.generateArray();
        var orderItemsArray = [];
        
        //Creating array of order items so that it can be added asynchronously
        for(var i = 0; i < productsInCart.length; i++){
            var newItem = [orderId, productsInCart[i].item.id, productsInCart[i].qty, productsInCart[i].item.name, productsInCart[i].price, productsInCart[i].price];
            orderItemsArray.push(newItem);
        }

        var query = "INSERT INTO hiksaudi_js.gc_order_items (order_id, product_id, quantity, name,  price, total_price)\
                     VALUES ?";
        /* 
            Since we have to add multiple order items
            Therefore we have to take care of the transanctions in case if 
            any of the order item is not added we have to rollback the entire transaction
        */
        mySql.beginTransaction(function(err){
            if(err){
                callback(err);
            }
            mySql.query(query, [orderItemsArray], function(err, result){
                //If any item failed to be inserted transaction would be rolledback
                if(err){
                    mySql.rollback(function(){
                        callback(err);
                    });
                }
                //If all items are inserted transaction would be committed
                mySql.commit(function(err){
                    if(err){
                        mySql.rollback(function(){
                            callback(err);
                        })
                    }
                    mySql.end();
                });
            });
        })
    }

    addNewOrder(cart, userId, address, callback){
        /*
            The generate array in Cart class would return
            all the products present in the cart.
         */
        console.log("Inside add New Order model");
        var productsInCart = cart.generateArray();

        var newOrderQuery = "INSERT INTO hiksaudi_js.gc_orders (customer_id, status, total, subtotal, ordered_on, address)\
                             VALUES (" + userId + "," + "cart" + "," + cart.totalPrice + "," + cart.totalPrice + "," + "current_timestamp()" + "\"" + address + "\"" + ")";
        /*
            Insert a new order and get the id of the row inserted in order table
            The id would be used to add order items in order items table
         */

        mySql.query(newOrderQuery, function(err, result){
            mySql.end();
            if(err){
                callback(err);
            } else {
                addOrderItems(cart, result.insertId, function(err){
                    if(err)
                        callback(err);
                });
            }
        });
   }
}

module.exports = Order;