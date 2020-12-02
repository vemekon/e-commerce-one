const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUser = (req, res, next, id) => {
	User.findById(id).exec((error, user) => {
		if (error)
			return res.status(400).json({ error: "Error in finding a user " });
		if (!user) return res.status(400).json({ error: "Unable to find a user " });
		req.profile = user;
		next();
	});
};

exports.signup = async (req, res) => {
	const { name, email, password, role } = req.body;
	const emailExist = await User.findOne({ email });
	if (emailExist)
		return res.status(400).json({ error: "Email already exists" });

	const salt = await bcrypt.genSalt(10);
	const hashpassword = await bcrypt.hash(password, salt);
	const user = new User({
		name,
		email,
		password: hashpassword,
		role,
	});
	try {
		const newUSer = await user.save();
		res.status(200).json({ msg: newUSer });
	} catch (error) {
		console.log(error);
	}
};

exports.signin = async (req, res) => {
	let { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user)
		return res.status(400).json({ error: "No user with that email found" });

	const validPass = await bcrypt.compare(password, user.password);
	if (!validPass) return res.status(400).json({ error: "invalid password" });
	const token = jwt.sign({ _id: user._id }, process.env.JWT, {
		expiresIn: "1h",
	});
	res.cookie("t", token);
	let { id, name, role } = user;

	return res
		.header("auth-token", token)
		.status(200)
		.json({ token, user: { id, name, email, role } });
};

exports.signout = (req, res) => {
	res.clearCookie("t");
	//console.log("Cookies- ", req.cookies);

	res.status(200).json({ msg: "Signed out" });
};
exports.needSignin = (req, res, next) => {
	const token = req.headers["authorization"];
	//console.log(req.headers['authorization']);
	if (!token)
		return res
			.status(400)
			.json({ error: "access denied because you need to sign in" });
	try {
		const verified = jwt.verify(token, process.env.JWT);
		req.user = verified;
		console.log(verified, "from needsignin");
		next();
	} catch (error) {
		const verified = jwt.verify(token, process.env.TOKEN_SECRET);
		console.log(verified, "from error needsignin");
		res.status(400).json({ error: "not authorised token" });
	}
};

exports.see = (req, res) => {
	console.log(req.user);
	return res.status(200).json(req.profile);
};

exports.needAdmin = (req, res, next) => {
	if (req.profile.role !== 1) {
		return res.status(400).json({ error: "Admin material" });
	}
	next();
};

exports.updateProfile = (req, res, next) => {
	console.log(req.profile);
	User.findByIdAndUpdate(
		{ _id: req.user._id },
		{ $set: req.body },
		{ new: true },
		(error, user) => {
			if (error)
				return res.status(400).json({ error: "Unable to update profile" });
			res.status(200).json({ msg: user });
		}
	);
};

exports.historyCreate = (req, res, next) => {
	const history = [];
	req.body.products.forEach((item) => {
		history.push({
			_id: item._id,
			name: item.name,
			description: item.description,
			catagory: item.catagory,
			quantity: item.count,
			transaction_id: req.body.transactionId,
			amount: req.body.amount,
		});
	});
	User.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $push: { history: history } },
		{ new: true },
		(error, data) => {
			if (error) {
				return res.status(400).json({ error: "Could not update history" });
			}
			next();
		}
	);
};
