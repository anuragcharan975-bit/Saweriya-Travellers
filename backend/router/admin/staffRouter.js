const express = require("express");
const staffRouter = express.Router();

const controller = require("../../controller/admin/staffController");
const { validation, updateValidation } = require("../../validation/admin/staffValidation");
const validate = require("../../middleware/validate");
const upload = require("../../middleware/upload");

staffRouter.post("/add", upload.single("photo"), validate(validation), controller.addStaff);
staffRouter.get("/view/:id", controller.findStaff);
staffRouter.put("/update/:id", upload.single("photo"), validate(updateValidation), 
controller.updateStaff);
staffRouter.put("/statusUpdate/:id", controller.updateStaffStatus);
staffRouter.delete("/delete/:id", controller.deleteStaff);
staffRouter.get("/viewAll", controller.findAllStaff);


module.exports = staffRouter;