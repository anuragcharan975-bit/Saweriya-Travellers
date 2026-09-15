const express = require("express");
const reportRouter = express.Router();
const validate = require("../../middleware/validate")
const validation = require("../../validation/admin/reportValidation")
const controller = require("../../controller/admin/reportController")


reportRouter.post("/add", validate(validation), controller.addReport);
reportRouter.get("/view/:id", controller.findReport);
reportRouter.put("/update/:id", validate(validation), controller.updateReport);
reportRouter.put("/statusUpdate/:id", controller.updateReportStatus)
reportRouter.delete("/delete/:id", controller.deleteReport);
reportRouter.get("/viewall", controller.findAllReport);


module.exports = reportRouter;