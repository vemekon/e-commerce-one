const express = require("express");
const router = express.Router();

const {
	signupValidate,
	signinValidate,
	createCatagoryValidate,
	productValidate,
} = require("../helper/validate");

const {
	create,
	listCatagories,
	photo,
	getProduct,
	read,
	update,
	remove,
	list,
	listRelated,
	listBySearch,
	loadBySearch,
} = require("../constroller/product");

const { getUser, needSignin, needAdmin } = require("../constroller/user");

router.post(
	"/product/create/:userId",
	needSignin,
	needAdmin,
	//productValidate,
	create
);

router.get("/product/:productId", read);

router.put(
	"/product/:productId/:userId",
	//needSignin, needAdmin,
	update
);
router.delete("/product/:productId/:userId", needSignin, needAdmin, remove);

router.get("/product", list);
router.get("/product/related/:productId", listRelated);
router.post("/product/by/search", listBySearch);
router.get("/products/search", loadBySearch);

router.get("/products/catagories", listCatagories);
router.get("/product/photo/:productId", photo);

router.param("productId", getProduct);

router.param("userId", getUser);

module.exports = router;
