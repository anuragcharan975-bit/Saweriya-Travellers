const express = require("express");
const settingsrouter = express.Router();

const controller = require("../../controller/admin/settingsController");
const validate = require("../../middleware/validate");
const Validation = require("../../validation/admin/settingsValidation");


settingsrouter.post("/create", validate(Validation), controller.createSettings);
settingsrouter.get("/", controller.getSettings);
settingsrouter.put("/update", validate(Validation), controller.updateSettings);

module.exports = settingsrouter;