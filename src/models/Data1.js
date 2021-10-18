const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Data1 = new Schema({
	task: String,
	index: Number,
	background: String,
	color: String,
	updateAt: String,
});

module.exports = mongoose.model("Data1", Data1);
