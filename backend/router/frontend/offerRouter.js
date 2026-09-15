const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/offerController");

router.get("/viewAll", controller.findActiveOffers);

module.exports = router;