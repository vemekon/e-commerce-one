const Product = require("../model/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.create = (req, res, next) => {
	const form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		//console.log(fields)
		if (err) {
			next(err);
			return;
		}
		let product = new Product(fields);
		if (files.photo) {
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
		}
		product.save((err, result) => {
			if (err) next(err);
			res.status(200).json(result);
		});
	});
};
exports.getProduct = (req, res, next, id) => {
	Product.findById(id)
		.populate("catagory")
		.exec((err, pro) => {
			if (err) {
				next(err);
				return;
			}
			req.product = pro;
			next();
		});
};

exports.read = (req, res, next) => {
	req.product.photo = undefined;
	return res.status(200).json({ msg: req.product });
};
exports.read1 = (req, res, next) => {
	req.product.photo = undefined;
	Product.find({ _id: req.product._id })
		.populate("catagory")
		.select("-photo")
		.exec((error, product) => {
			if (error) {
				next(error);
				return;
			}
			return res.status(200).send(product);
		});
};

exports.remove = (req, res, next) => {
	let product = req.product;
	product.remove((err, pro) => {
		if (err) {
			next(err);
			return;
		}
		return res.status(200).json({ msg: "product removed" });
	});
};

exports.update = (req, res, next) => {
	const form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if (err) {
			next(err);
			return;
		}
		let product = req.product;
		product = _.extend(product, fields);
		if (files.photo) {
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
		}
		product.save((err, result) => {
			if (err) next(err);
			res.status(200).json(result);
		});
	});
};
exports.listA = (req, res, next) => {
	Product.find({}, (err, product) => {
		if (err) {
			next(err);
			return;
		}
		product.photo = undefined;
		product.map((a, i) => (a.photo = undefined));
		//console.log(product);
		return res.status(200).json({ "product length": product.length, product });
	});
};
exports.list = (req, res, next) => {
	let order = req.query.order ? req.query.order : "asc";
	let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
	let limit = req.query.limit ? parseInt(req.query.limit) : 4;
	Product.find({})
		.select("-photo")
		.populate(" catagory ")
		//.sort([[sortBy, order]])
		.sort({ [sortBy]: order })
		.limit(limit)
		.exec((err, product) => {
			if (err) {
				next(err);
				return;
			}
			//console.log(product);
			res.status(200).json(product);
		});
};

exports.listRelated = (req, res, next) => {
	//req.product.photo = undefined;
	let product = req.product;
	Product.find({ _id: { $ne: req.product }, catagory: product.catagory })
		.populate("catagory")
		.select("-photo")
		.exec((err, product) => {
			if (err) {
				next(err);
				return;
			}
			//console.log(product);
			res.status(200).json(product);
		});
};

exports.listRelatedd = (req, res) => {
	Product.find({ _id: { $ne: req.product }, catagory: req.product.catagory })

		.select("-photo")
		// .limit(limit)
		.populate("catagory")
		.exec((error, product) => {
			if (err) {
				next(err);
				return;
			}
			//console.log(product);
			res.status(200).json(product);
		});
};

exports.listCatagories = (req, res) => {
	Product.distinct("catagory", {}, (error, catagory) => {
		if (error) {
			return res
				.status(400)
				.json({ error: "Unable to fetch all related products" });
		}
		res.status(200).json(catagory);
	});
};

exports.listBySearch = (req, res) => {
	let order = req.query.order ? req.query.order : "asc";
	let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
	let limit = req.body.limit ? parseInt(req.body.limit) : 8;
	let skip = parseInt(req.body.skip);
	let findArgs = {};

	for (let key in req.body.filters) {
		if (req.body.filters[key].length > 0) {
			if (key === "price") {
				findArgs[key] = {
					$gte: req.body.filters[key][0],
					$lte: req.body.filters[key][1],
				};
			} else {
				findArgs[key] = req.body.filters[key];
			}
		}
	}
	Product.find(findArgs)

		.select("-photo")
		.limit(limit)
		.populate("catagory")
		.sort([[sortBy, order]])
		.skip(skip)
		.exec((error, products) => {
			if (error) {
				return res
					.status(400)
					.json({ error: "Unable to fetch all related products" });
			}
			res.status(200).json({ size: products.length, products });
		});
};

exports.photo = (req, res) => {
	if (req.product.photo.data) {
		res.set("Content-Type", req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

exports.loadBySearch = (req, res) => {
	console.log("hello dude");
	const query = {};

	if (req.query.search) {
		query.name = { $regex: req.query.search, $options: "i" };
	}
	if (req.query.catagory && req.query.catagory !== "All") {
		query.catagory = req.query.catagory;
	}
	Product.find(query, (error, product) => {
		if (error) {
			return res
				.status(400)
				.json({ error: "Unable to fetch all related products" });
		}
		res.status(200).json(product);
	}).select("-photo");
};
exports.loadBySearchh = (req, res) => {
	console.log("hello dude");
};
exports.decreaseQuantity = (req, res, next) => {
	let bulkOps = req.body.products.map((item) => {
		return {
			updateOne: {
				filter: { _id: item._id },
				update: { $inc: { quantity: -item.count, sold: +item.count } },
			},
		};
	});
	Product.bulkWrite(bulkOps, {}, (err, products) => {
		if (err) res.status(400).json({ err: "could not update product" });
		next();
	});
};
