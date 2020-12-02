const express = require("express");
const router = express.Router();
const { getUser, needSignin, needAdmin } = require("../constroller/user");
const { generateToken, pay } = require("../constroller/braintree");

router.get("/braintree/getToken/:userId", generateToken);
router.post("/braintree/pay/:userId", pay);

router.param("userId", getUser);

module.exports = router;
