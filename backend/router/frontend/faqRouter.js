const express = require("express");
const faqRouter = express.Router();

const controller = require("../../controller/frontend/faqController");


faqRouter.get("/active", controller.findActiveFaq);

module.exports = faqRouter;