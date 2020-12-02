const braintree = require("braintree");
const User = require("../model/user");
require("dotenv").config();

var gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: process.env.MerchantId,
	publicKey: process.env.PublicKey,
	privateKey: process.env.PrivateKey,
});

exports.generateToken = (req, res, next) => {
	gateway.clientToken.generate({}, (error, response) => {
		if (error) {
			res.status(500).send(error);
		} else {
			res.status(200).send(response);
		}
	});
};
exports.pay = (req, res, next) => {
	const paymentNonce = req.body.paymentNonce;
	const amount = req.body.amount;

	const transaction = gateway.transaction.sale(
		{
			amount: amount,
			paymentMethodNonce: paymentNonce,
			options: {
				submitForSettlement: true,
			},
		},
		(error, result) => {
			if (error) {
				res.status(500).json(error);
			} else {
				res.json(result);
			}
		}
	);
};
