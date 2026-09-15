const express = require("express")
const busTypeRouter = express.Router()

const controller = require("../../controller/admin/busTypeController")
const { validation, updateValidation } = require("../../validation/admin/busTypeValidation")
const validate = require("../../middleware/validate")

busTypeRouter.post("/add", validate(validation), controller.addBusType)
busTypeRouter.get("/view/:id", controller.findBusType)
busTypeRouter.put("/update/:id", validate(updateValidation), controller.updateBusType)
busTypeRouter.put("/statusUpdate/:id", controller.updateBusTypeStatus)
busTypeRouter.delete("/delete/:id", controller.deleteBusType)
busTypeRouter.get("/viewAll", controller.findAllBusType)






module.exports = busTypeRouter