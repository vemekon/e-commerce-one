const express = require("express");
const router = express.Router();
const {
	getUser,
	needSignin,
	needAdmin,
	historyCreate,
} = require("../constroller/user");
const {
	create,
	listOrders,
	listStatus,
	updateStatus,
	getOrder,
} = require("../constroller/order");
const { decreaseQuantity } = require("../constroller/product");

router.post("/order/create/:userId", historyCreate, decreaseQuantity, create);
router.get("/order/list/:userId", listOrders);
router.get("/order/status/:userId", listStatus);
router.put("/order/:orderId/status/:userId", updateStatus);
router.param("userId", getUser);
router.param("orderId", getOrder);

module.exports = router;
