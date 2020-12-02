const Catagory = require("../model/catagory");
/*
exports.sampleCreatee = async (req, res, next) => {
	try {
		console.log("name");
		let { name } = req.body;
		const newV = await Catagory.findOne({ name });
		if (newV) throw new Error("no name dublication");
		const catagory = new Catagory(req.body);
		catagory.save((error, catagory) => {
			//console.error(error);
			if (error) throw new Error("no catagory savedn");
			res.json({ msg: "new Catagory Added" });
		});
	} catch (error) {
		next(error);
	}
};
*/
exports.create = async (req, res, next) => {
	//console.log("name");
	let { name } = req.body;

	newCat = await Catagory.findOne({ name });
	if (newCat) {
		const error = new Error("Dublicate name not allowed");
		return next(error);
	}

	const catagory = new Catagory(req.body);
	console.log(" new functoin");

	catagory.save((error, catagory) => {
		if (error) {
			next(error);
			return;
		}
		console.log("save functoin");
		res.json({ msg: "new Catagory Added" });
	});
};
exports.listt = (req, res, next) => {
	Catagory.find({}, (err, catagory) => {
		if (err) {
			next(err);
			return;
		}
		res.status(200).json({ catagory });
	});
};
exports.list = (req, res, next) => {
	Catagory.find({}, (err, catagory) => {
		if (err) {
			next(err);
			return;
		}
		res.json({ catagory });
	});
};
exports.getCatagory = (req, res, next, id) => {
	//console.log(id);
	Catagory.findById(id).exec((err, catagory) => {
		if (err) {
			next(err);
			return;
		}
		req.catagory = catagory;
		next();
	});
};
exports.update = (req, res, next) => {
	const catagory = req.catagory;
	catagory.name = req.body.name;
	catagory.save((err, item) => {
		if (err) {
			next(err);
			return;
		}
		return res.status(200).json({ item });
	});
};

exports.remove = (req, res, next) => {
	const catagory = req.catagory;
	catagory.remove((err, item) => {
		if (err) {
			next(err);
			return;
		}
		res.json({ msg: "Item removed" });
	});
};
