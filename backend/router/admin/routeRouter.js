const express = require("express")
const routeRouter = express.Router()

const controller = require("../../controller/admin/routeController")
const { validation, updateValidation } = require("../../validation/admin/routeValidation")
const validate = require("../../middleware/validate")



routeRouter.post("/add", validate(validation), controller.addRoute)
routeRouter.get("/view/:id", controller.findRoute)
routeRouter.put("/update/:id", validate(updateValidation), controller.updateRoute)
routeRouter.put("/statusUpdate/:id", controller.updateRouteStatus)
routeRouter.delete("/delete/:id", controller.deleteRoute)
routeRouter.get("/viewAll", controller.findAllRoute)
routeRouter.get("/popularRoutes", controller.ViewPopularRoutes);
module.exports = routeRouter
