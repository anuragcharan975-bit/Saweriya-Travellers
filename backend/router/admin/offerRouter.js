const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/offerController");
const validate = require("../../middleware/validate");
const { offerValidation, updateValidation } = require("../../validation/admin/offerValidation");

router.post("/add", validate(offerValidation), controller.addOffer);
router.get("/viewAll", controller.findAllOffer);
router.get("/view/:id", controller.findOffer);
router.put("/update/:id", validate(updateValidation), controller.updateOffer);
router.delete("/delete/:id", controller.deleteOffer)
router.put("/statusUpdate/:id", controller.updateOfferStatus);


module.exports = router;