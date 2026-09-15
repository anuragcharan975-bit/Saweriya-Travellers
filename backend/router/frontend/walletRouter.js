const express = require("express")
const walletRouter = express.Router()

const controller = require("../../controller/frontend/walletController")
const validation = require("../../validation/frontend/walletValidation")
const validate = require("../../middleware/validate");



walletRouter.post("/add-money",validate(validation),controller.addMoney)

walletRouter.get("/view/:id",controller.walletDetails)

walletRouter.get("/history/:userId",controller.walletHistory)

walletRouter.put("/update/:id",controller.updateWallet)

walletRouter.delete("/delete/:id",controller.deleteWallet)

module.exports = walletRouter