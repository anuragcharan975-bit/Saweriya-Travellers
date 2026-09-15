const express = require("express");
const adminRouter = express.Router();

const controller = require("../../controller/admin/adminController");
const validate = require("../../middleware/validate");
const validation = require("../../validation/admin/adminValidation");

adminRouter.post("/login", validate(validation), controller.login);

module.exports = adminRouter;