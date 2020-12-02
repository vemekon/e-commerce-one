const express = require("express");
const router = express.Router();
const { getUser, needSignin, needAdmin } = require("../constroller/user");
const { create } = require("../constroller/order");

router.get("/order/create/:userId", create);

router.param("userId", getUser);

module.exports = router;
