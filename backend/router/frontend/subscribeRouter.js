const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/subscribeController");

router.post("/add", controller.addSubscribe);

module.exports = router;