const express = require("express")
const notificationRouter = express.Router()

const controller = require("../../controller/frontend/notificationController")
const validation = require("../../validation/frontend/notificationValidation")
const validate = require("../../middleware/validate");



notificationRouter.post("/add",validate(validation),controller.createNotification)

notificationRouter.get("/view/:id",controller.viewNotification)

notificationRouter.get("/viewAll",controller.viewAllNotification)

notificationRouter.put("/read/:id",controller.markAsRead)

notificationRouter.delete("/delete/:id",controller.deleteNotification)

module.exports = notificationRouter