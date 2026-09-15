const express = require("express")
const ticketRouter = express.Router()

const controller = require("../../controller/frontend/ticketController")
const validation = require("../../validation/frontend/ticketValidation")
const validate = require("../../middleware/validate");



ticketRouter.post("/generate",validate(validation),controller.generateTicket)

ticketRouter.get("/view/:id",controller.viewTicket)

ticketRouter.get("/viewAll",controller.viewAllTicket)

ticketRouter.put("/cancel/:id",controller.cancelTicket)

module.exports = ticketRouter