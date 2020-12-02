const express = require("express");
const router = express.Router();

const {
	signupValidate,
	signinValidate,
	createCatagoryValidate,
} = require("../helper/validate");

const {
	create,
	list,
	getCatagory,
	update,
	remove,
} = require("../constroller/catagory");

const { getUser, needSignin, needAdmin } = require("../constroller/user");
router.get("/catagory", list);

router.post(
	"/catagory/create/:userId",
	//needSignin,
	//needAdmin,
	//createCatagoryValidate,
	create
);
router.put("/catagory/:catagoryId", update);
router.delete("/catagory/:catagoryId", remove);

router.param("catagoryId", getCatagory);

router.param("userId", getUser);
module.exports = router;
