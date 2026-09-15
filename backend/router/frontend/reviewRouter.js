const express = require("express")
const reviewRouter = express.Router()

const controller = require("../../controller/frontend/reviewController")
const validation = require("../../validation/frontend/reviewValidation")
const validate = require("../../middleware/validate")



reviewRouter.post("/add",validate(validation),controller.addReview)

reviewRouter.get("/view/:id",controller.viewReview)

reviewRouter.get("/viewAll",controller.viewAllReview)

reviewRouter.put("/update/:id",controller.updateReview)

reviewRouter.delete("/delete/:id",controller.deleteReview)

module.exports = reviewRouter