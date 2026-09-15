const express = require("express")
const busRouter = express.Router()

const controller = require("../../controller/admin/busController")
const { validation, updateValidation } = require("../../validation/admin/busValidation")
const validate = require("../../middleware/validate")
const upload = require("../../middleware/upload")



busRouter.post("/add", upload.single("bus_image"), validate(validation), controller.addBus)
busRouter.get("/view/:id", controller.findBus)
busRouter.put("/update/:id", upload.single("bus_image"), validate(updateValidation), controller.updateBus)
busRouter.put("/statusUpdate/:id", controller.updateBusStatus)
busRouter.delete("/delete/:id", controller.deleteBus)
busRouter.get("/viewAll", controller.findAllBus)
busRouter.get("/viewAllStaff", controller.findAllStaff)
busRouter.post("/assign", controller.assignBus);
busRouter.post("/Seach", controller.SeachData)


module.exports = busRouter
