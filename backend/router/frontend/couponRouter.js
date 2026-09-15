const express = require("express")
const couponRouter = express.Router()

const controller = require("../../controller/frontend/couponController")
const validation = require("../../validation/frontend/couponValidation")
const validate = require("../../middleware/validate");



couponRouter.post("/add",validate(validation),controller.addCoupon)

couponRouter.get("/view/:id",controller.viewCoupon)

couponRouter.get("/viewAll",controller.viewAllCoupon)

couponRouter.put("/update/:id",controller.updateCoupon)

couponRouter.delete("/delete/:id",controller.deleteCoupon)

module.exports = couponRouter