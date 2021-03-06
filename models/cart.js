class Cart {
	constructor(oldCart) {
		console.log("Inside cart constructor");
		/*
			items is an object that contain products
			and is referenced by the product id
		*/
		this.items = oldCart.items || {};
		this.totalQty = oldCart.totalQty || 0;
		this.totalPrice = oldCart.totalPrice || 0;
		this.cityId = oldCart.cityId || 0;
		this.branchId = oldCart.branchId || 0;
		this.orderType= oldCart.orderType || 0;
		console.log("Old Cart",oldCart);
	}
	addProductToCart(item, id, quantity, price, req) {
		var storedItem = this.items[id];
		var count = 0;
		//console.log("this.items", item);
		//Create a new item if its not present in items list
		if (!storedItem) {
			if (this.cityId == 0 && this.branchId == 0) {
				item.price = price;
				storedItem = this.items[id] = { item: item, qty: Number(quantity), price: Number(price * quantity), };
				this.cityId = req.query.city_id;
				this.branchId = req.query.branch_id;
				this.totalQty += Number(quantity);
				this.totalPrice += (price * quantity);
				throw 2;
			} else {
				if ((this.cityId == req.query.city_id) && (this.branchId == req.query.branch_id)) {
					item.price = price;
					storedItem = this.items[id] = { item: item, qty: Number(quantity), price: Number(price * quantity), };
					this.totalQty += Number(quantity);
					this.totalPrice += (price * quantity);
					throw 2;
				} else {
					throw 3;
				}
			}
		} else {
			throw 1;
		}
	}
	addOfferToCart(item, id, quantity, price, discount_price, req) {
		var  _id = Number(id + 200);
		var storedItem = this.items[_id];
		//console.log("this.items[id+200]", _id);
		//Create a new item if its not present in items list
		if (!storedItem) {
			if (this.cityId == 0 && this.branchId == 0) {
				item.price = Number(discount_price);
				item.id=_id;
				storedItem = this.items[_id] = { item: item, qty: Number(quantity), price: Number(discount_price * quantity), actual_price: price, type: "Offer" };
				this.cityId = req.query.city_id;
				this.branchId = req.query.branch_id;
				this.totalQty += Number(quantity);
				this.totalPrice += Number(discount_price) * quantity;
				throw 2;
			} else {
			//	console.log("city id there");
				if ((this.cityId == req.query.city_id) && (this.branchId == req.query.branch_id)) {
					item.price = Number(discount_price)
					item.id=_id;
					storedItem = this.items[_id] = { item: item, qty: Number(quantity), price: Number(discount_price * quantity), actual_price: price, type: "Offer" };
					this.totalQty += Number(quantity);
					this.totalPrice += Number(discount_price) * quantity;
					throw 2;
				} else {
					throw 3;
				}
			}
		} else {
			throw 1;
		}
		//Increment qty by 1 and set price to item price

	}
	//Object.assign([...this.state.editTarget], {[id]: {[target]: value}})
	deleteProductfromCart(id, price_1, cart) {
		var int_id = Number(id)
		var storedItem = this.items[id];
		console.log("in delete cart model cart.length", typeof (id), id);
		console.log(storedItem, "storedItem")
		if (storedItem) {
			this.totalQty -= Number(storedItem.qty);
			this.totalPrice -= storedItem.price;
			delete this.items[id];
		} else {
			console.log("in delete cart model cart data", cart);
		}
		console.log("Complete Cart", cart);
	}
	editProductfromCart(id, changeQty, cart) {
		var storedItem = this.items[id];
		var qty_decission = 0;
		//console.log("in edit cart model ", typeof (id), id);
		//console.log(storedItem, "storedItem")
		if (storedItem) {
			this.totalQty -= storedItem.qty;
			this.totalPrice -= storedItem.item.price * storedItem.qty;
			storedItem.qty = changeQty;
			storedItem.price = storedItem.item.price * storedItem.qty;
			this.totalQty += storedItem.qty;
			this.totalPrice += storedItem.item.price * storedItem.qty;
		} else {
		//	console.log("do nothig")
		}
		console.log("Complete Cart", cart);
	}
	
	// EditFoodType(type, callback) {
	//   this.orderType = type
    //   callback(this.orderType); //Passing results to callback function
	// }
	EditFoodType(orderType) {
		console.log("Log 1",this.orderType);
		this.orderType = orderType;
		console.log("Log 2",this.orderType);
		return 1;
	}
	generateArray() {
		console.log("cart",this.orderType)
		var arr = [];
		for (var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	}
}
module.exports = Cart;
