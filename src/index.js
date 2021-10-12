const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");
const Data1 = require("./models/Data1");
const Data2 = require("./models/Data2");

const app = express();
const port = process.env.PORT || 8080;

mongoose
	.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
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

app.get("/", (req, res) => {
	res.redirect("/group1");
});

app.get("/group1", (req, res, next) => {
	Data1.find({})
		.then((datum) => {
			datum = datum.map((datum) => datum.toObject());
			res.render("group1", { datum });
		})
		.catch(next);
});

app.post("/group1", (req, res) => {
	Data1.deleteMany({}).catch((err) => console.log(err));
	req.body.filter((data) => {
		let newData = new Data1(data);
		newData.save();
	});
});

app.get("/group2", (req, res, next) => {
	Data2.find({})
		.then((datum) => {
			datum = datum.map((datum) => datum.toObject());
			res.render("group2", { datum });
		})
		.catch(next);
});

app.post("/group2", (req, res) => {
	Data2.deleteMany({}).catch((err) => console.log(err));
	req.body.filter((data) => {
		let newData = new Data2(data);
		newData.save();
	});
});

app.post("/change", (req, res) => {
	if (req.body.value == "1") res.redirect("/group1");
	else res.redirect("/group2");
});

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
