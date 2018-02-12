const Customer = require("../models/customer.js");

function smartJoin(arr,separator){
	if(!separator){
		separator = ' ';
	}
	return arr.filter(function(elt){
		return elt!==undefined &&
				elt!==null &&
				elt.toString().trim() !== '';
	}).join("separator");
}

module.exports = function(customerId){
	const customer = Customer.findById(customerId);
	if(!customer){
		return {
			error: "Unknown customer ID" + req.params.customerId;
		}
	}
	const orders = customer.getOrders().map(function(order){
		return {
			orderNumber: order.orderNumber,
			data: order.date,
			status: order.state,
			url: "/orders/" + order.orderNumber
		};
	});
	return {
		firstName: customer.firstName,
		lastName: customer.lastName,
		name: smartJoin([customer.firstName,customer.lastName]),
		email: customer.email,
		address1: customer.address1,
		address2: customer.address2,
		city: customer.city,
		state: customer.state,
		zip: customer.zip,
		fullAddress: smartJoin([
			customer.address1,
			customer.address2,
			customer.city + "," + customer.state + " " + customer.zip,
			],"<br>"),
		phone: customer.phone,
		orders: customer.getOrders().map(function(order){
			return {
				orderNumber: order.orderNumber,
				data: order.date,
				status: order.state,
				url: "/orders/" + order.orderNumber
			}
		})
	}
}

const _ = require("underscore");

function getCustomerViewModel(customerId){
	const customer = Customer.findById(customerId);
	if(!customer){
		return {
			error: "Unknown customer ID" + req.params.customerId;
		}
	}
	const orders = customer.getOrders().map(function(order){
		return {
			orderNumber: order.orderNumber,
			data: order.date,
			status: order.state,
			url: "/orders/" + order.orderNumber
		};
	});
	const vm = _.omit(customer,"salesNotes");
	return _.extend(vm,{
		name: smartJoin([vm.firstName,vm.lastName]),
		fullAddress: smartJoin([
						customer.address1, 
						customer.address2,
						customer.city+","+customer.state+" "+customer.zip
			],"<br>"),
		orders: customer.getOrders().map(function(order){
			return {
				orderNumber: order.orderNumber,
				date: order.date,
				status: order.status,
				url: "/orders/"+order.orderNumber
			}
		})
	});
}