const express = require("express");

const scheduleRouter = express.Router();

const controller = require("../../controller/admin/scheduleController");
const validate = require("../../middleware/validate");
const { validation, updateValidation } = require("../../validation/admin/scheduleValidation");

scheduleRouter.post("/add", validate(validation), controller.addSchedule);

scheduleRouter.get("/view/:id", controller.findSchedule);

scheduleRouter.get("/viewByRoute/:id", controller.viewScheduleByRoute);

scheduleRouter.put("/update/:id", validate(updateValidation), controller.updateSchedule);

scheduleRouter.put("/statusUpdate/:id", controller.updateScheduleStatus);

scheduleRouter.delete("/delete/:id", controller.deleteSchedule);

scheduleRouter.get("/viewAll", controller.findAllSchedule);

scheduleRouter.post("/search", controller.searchSchedule);

module.exports = scheduleRouter;