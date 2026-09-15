const express = require("express")
const contactRouter = express.Router()

const controller = require("../../controller/admin/contactController")
const validation = require("../../validation/admin/contactValidation")
const validate = require("../../middleware/validate");

contactRouter.post("/add", validate(validation), controller.addContact)

contactRouter.get("/viewAll", controller.viewAllContact)

contactRouter.delete("/delete/:id", controller.deleteContact)

module.exports = contactRouter