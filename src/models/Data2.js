const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Data2 = new Schema({
	task: String,
	index: Number,
});

module.exports = mongoose.model("Data2", Data2);
