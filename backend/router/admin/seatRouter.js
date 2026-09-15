const express = require("express");
const seatRouter = express.Router()

const controller = require("../../controller/admin/seatController")
const { validation, updateValidation } = require("../../validation/admin/seatValidation")
const validate = require("../../middleware/validate")


seatRouter.post("/add", validate(validation), controller.addSeat);
seatRouter.get("/view/:id", controller.findSeat);
seatRouter.put("/update/:id", validate(updateValidation), controller.updateSeat);
seatRouter.put("/updateStatus/:id", controller.updateSeatStatus);
seatRouter.delete("/delete/:id", controller.deleteSeat);
seatRouter.get("/viewAll", controller.findAllSeat);
seatRouter.get("/bus/:busId", controller.findSeatByBus);

module.exports = seatRouter;