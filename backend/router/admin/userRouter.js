const express = require("express")
const userRouter = express.Router();

const controller = require("../../controller/admin/userController")
const userValidation = require("../../validation/admin/userValidation")
const upload = require("../../middleware/upload")
const validate = require("../../middleware/validate")



userRouter.post("/add", upload.single("photo"), validate(userValidation), controller.addUser)

userRouter.get("/view/:id", controller.findUser)

userRouter.put("/update/:id", validate(userValidation), controller.updateUser)

userRouter.put("/statusUpdate/:id", controller.updateUserStatus)

userRouter.delete("/delete/:id", controller.deleteUser)

userRouter.get("/viewAll", controller.findallUser)

userRouter.post("/search", controller.searchUser)




















module.exports = userRouter