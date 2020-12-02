const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			minLength: 4,
			required: true,
		},
		review: {
			type: String,
		},
		price: {
			type: Number,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		sold: {
			type: Number,
			default: 0,
		},
		description: {
			type: String,
			required: true,
		},

		photo: {
			data: Buffer,
			contentType: String,
		},
		count: {
			type: Number,
		},
		catagory: {
			type: mongoose.Schema.Types.ObjectId,
			//type: mongoose.SchemaTypes.ObjectId,
			ref: "Catagory",
		},
	},
	{
		timestamps: true,
	}
);
module.exports = Product = mongoose.model("Product", ProductSchema);
