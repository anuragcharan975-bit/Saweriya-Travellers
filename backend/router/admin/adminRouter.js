const express = require("express");
const adminRouter = express.Router();

const controller = require("../../controller/admin/adminController");
const validate = require("../../middleware/validate");
const validation = require("../../validation/admin/adminValidation");
const verifyToken = require("../../middleware/verifyToken");
const upload = require("../../middleware/upload");

adminRouter.post("/login", validate(validation), controller.login);
adminRouter.get("/profile", verifyToken, controller.getProfile);
adminRouter.put("/profile", verifyToken, upload.single("profile_image"), controller.updateProfile);
adminRouter.put("/change-password", verifyToken, controller.changePassword);

module.exports = adminRouter;
