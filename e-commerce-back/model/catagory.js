const mongoose = require("mongoose");

const CatagorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			minLength: 4,
			required: true,
			unique: true,
		},
	},
	{
		timestamps: true,
	}
);
module.exports = Catagory = mongoose.model("Catagory", CatagorySchema);
