const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoute = require("./route/user");
const productRoute = require("./route/product");
const braintreeRoute = require("./route/braintree");

const catagoryRoute = require("./route/catagory");

const orderRoute = require("./route/order");

mongoose
	.connect(process.env.MONGODB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("You have successfully connected");
	})
	.catch((err) => {
		console.log(err);
	});

const PORT = process.env.PORT || 5002;

app.use(morgan("dev"));
app.use(bodyparser.json());

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use("/", userRoute);
app.use("/", productRoute);

app.use("/", catagoryRoute);
app.use("/", braintreeRoute);
app.use("/", orderRoute);

app.use((req, res) => {
	res.status(400).json({ msg: "No url found" });
});
app.use(function (error, req, res, next) {
	console.error(error);
	return res
		.status(error.status || 500)
		.json({ error: error.message || error.stack });
});

app.listen(PORT, () => {
	console.log(`App is listening on port ${PORT}`);
});
