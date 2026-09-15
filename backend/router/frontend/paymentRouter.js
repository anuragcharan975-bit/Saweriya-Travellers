const express = require("express")
const paymentRouter = express.Router()

const controller = require("../../controller/frontend/paymentController")
const validation = require("../../validation/frontend/paymentValidation")
const validate = require("../../middleware/validate");



paymentRouter.post("/create",validate(validation),controller.createPayment)

paymentRouter.get("/view/:id",controller.viewPayment)

paymentRouter.get("/viewAll",controller.viewAllPayment)

paymentRouter.put("/verify/:id",controller.verifyPayment)

paymentRouter.put("/refund/:id",controller.refundPayment)

module.exports = paymentRouter