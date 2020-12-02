const { Order, CartItem } = require("../model/order");

exports.getOrder = (req, res, next, id) => {
	Order.findById(id)
		.populate("products.product", "name price")
		.exec((err, order) => {
			if (err || !order) res.status(400).json({ err: "error" });
			req.order = order;
			next();
		});
};

exports.create = (req, res) => {
	req.body.user = req.profile;
	//console.log(req.body.order);

	const order = new Order(req.body);
	order.save((error, data) => {
		if (error) {
			return res.status(500).json({ error: error });
		}
		res.status(200).json(data);
	});
};

exports.listOrders = (req, res) => {
	Order.find()
		.populate("user", "_id name")
		.sort("-created")
		.exec((err, orders) => {
			if (err) res.status(400).json({ err: err });
			res.json(orders);
		});
};
exports.listStatus = (req, res) => {
	res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
	Order.update(
		{ _id: req.body.orderId },
		{ $set: { status: req.body.status } },
		(err, order) => {
			if (err) res.status(400).json({ err: err });
			res.json(order);
		}
	);
};
