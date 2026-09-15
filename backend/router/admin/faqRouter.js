const express = require("express");
const faqRouter = express.Router();

const controller = require("../../controller/admin/faqController");
const { faqValidation, updateValidation } = require("../../validation/admin/faqValidation");
const validate = require("../../middleware/validate");

faqRouter.post("/add", validate(faqValidation), controller.addFaq);
faqRouter.get("/viewAll", controller.findAllFaq);
faqRouter.get("/view/:id", controller.findFaq);
faqRouter.put("/update/:id", validate(updateValidation), controller.updateFaq);
faqRouter.delete("/delete/:id", controller.deleteFaq);
faqRouter.put("/statusUpdate/:id", controller.updateFaqStatus);

module.exports = faqRouter;