const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Data = new Schema({
	task: String,
	index: Number,
});

module.exports = mongoose.model("Data", Data);
