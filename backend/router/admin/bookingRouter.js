const express = require("express");
const bookingRouter = express.Router();
const controller = require("../../controller/admin/bookingController");

bookingRouter.get("/viewall", controller.viewAllBookings);
bookingRouter.put("/status/:id", controller.updateBookingStatus);

module.exports = bookingRouter;
