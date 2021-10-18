const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Data2 = new Schema({
	task: String,
	index: Number,
	background: String,
	color: String,
	updateAt: { type: String, default: Date.now },
});

module.exports = mongoose.model("Data2", Data2);
