class Cart{
	constructor(oldCart){
		console.log("Inside cart constructor");
		/*
			items is an object that contain products
			and is referenced by the product id
		*/
		this.items = oldCart.items || {}; 
		this.totalQty = oldCart.totalQty || 0;
		this.totalPrice = oldCart.totalPrice || 0;
	}
	
	addProductToCart(item, id){
		var storedItem = this.items[id];
		
		//Create a new item if its not present in items list
		if(!storedItem){
			storedItem = this.items[id] = {item: item, qty: 0, price: 0};
		}
		
		//Increment qty by 1 and set price to item price
		storedItem.qty++;
		storedItem.price = item.price_1 * storedItem.qty;
		
		this.totalQty++;
		this.totalPrice += storedItem.item.price_1;
		
	}
	
	addProductToCart(item, id, quantity){
		var storedItem = this.items[id];
		
		//Create a new item if its not present in items list
		if(!storedItem){
			storedItem = this.items[id] = {item: item, qty: 0, price: 0};
		}
		
		//Increment qty by 1 and set price to item price
		storedItem.qty += quantity;
		storedItem.price = item.price_1 * storedItem.qty;
		
		this.totalQty += quantity;
		this.totalPrice += storedItem.item.price_1;
		
	}

	generateArray(){
		var arr = [];
		
		for(var id in this.items){
			arr.push(this.items[id]);
		}
		
		return arr;
	}
}

module.exports = Cart;
