const express = require("express");
const router = express.Router();

const { signupValidate, signinValidate } = require("../helper/validate");

const {
	signup,
	signin,
	signout,
	see,
	getUser,
	updateProfile,
	needSignin,
} = require("../constroller/user");

router.post("/signup", signupValidate, signup);
router.put("/update/:userId", needSignin, updateProfile);

router.get("/signout", signout);

router.post("/signin", signinValidate, signin);
router.get("/see/:userId", needSignin, see);
router.param("userId", getUser);
module.exports = router;
