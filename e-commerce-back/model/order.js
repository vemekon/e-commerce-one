const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CartItemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
		name: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		count: {
			Number,
		},
	},
	{
		timestamps: true,
	}
);
const CartItem = mongoose.model("CartItem", CartItemSchema);

const OrderSchema = new mongoose.Schema(
	{
		products: [CartItemSchema],
		transactionId: {},
		amount: { type: Number },
		address: String,
		status: {
			type: String,
			default: "Not processed",
			enum: [
				"Not processed",
				"Processing",
				"Shipped",
				"Delivered",
				"Cancelled",
			],
		},
		updated: Date,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);
const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, CartItem };
