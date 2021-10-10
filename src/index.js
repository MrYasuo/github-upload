const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");
const Data = require("./models/Data");

const app = express();
const port = process.env.PORT || 8080;

mongoose
	.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test")
	.then(() => console.log("connect successfully"))
	.catch((err) => console.log(err));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.engine(
	"handlebars",
	exphbs({
		helpers: {
			hasIndex: function (datum, value, options) {
				return options.fn(
					datum.find((data) => {
						return data.index == value;
					})
				);
			},
		},
	})
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "resources/views"));

app.get("/", (req, res, next) => {
	Data.find({})
		.then((datum) => {
			datum = datum.map((datum) => datum.toObject());
			res.render("home", { datum });
		})
		.catch(next);
});

app.post("/", (req, res) => {
	Data.deleteMany({}).catch((err) => console.log(err));
	req.body.filter((data) => {
		let newData = new Data(data);
		newData.save();
	});
	res.send("");
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
