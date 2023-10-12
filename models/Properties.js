const mongoose = require("mongoose");

// Define the Courses schema
const propertiesSchema = new mongoose.Schema({
	propertiesAddress: { type: String },
	propertiesDescription: { type: String },
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
	price: {
		type: Number,
	},
	thumbnail: {
		type: [String],
	},
	tag: {
		type: [String],
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
	
	instructions: {
		type: [String],
	},
	
	createdAt: {
		type:Date,
		default:Date.now,
	},
	options:{
		type: String,
		enum: [ "Rent", "Sell"],
		required: true,
	}
});

// Export the Courses model
module.exports = mongoose.model("Properties", propertiesSchema);