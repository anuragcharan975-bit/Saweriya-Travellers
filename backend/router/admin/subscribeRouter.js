const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/subscribeController");

router.get("/viewAll", controller.viewAllSubscribe);

module.exports = router;