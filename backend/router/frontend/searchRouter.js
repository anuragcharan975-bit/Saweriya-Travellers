const express = require("express")
const searchRouter = express.Router();

const controller = require("../../controller/frontend/searchController")
const searchValidation = require("../../validation/frontend/searchValidation")
const upload = require("../../middleware/upload")
const validate = require("../../middleware/validate")



searchRouter.get("/search", controller.searchBus);

searchRouter.get("/date", controller.searchByDate);

searchRouter.get("/route", controller.searchByRoute);

searchRouter.get("/filter", controller.filterBus);

module.exports = searchRouter