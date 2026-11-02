const express = require("express");
const routerAdmin = express.Router();

const busRouter = require("./busRouter");
const busTypeRouter = require("./busTypeRouter");
const routeRouter = require("./routeRouter");
const scheduleRouter = require("./scheduleRouter");
const seatRouter = require("./seatRouter");
const staffRouter = require("./staffRouter");
const adminRouter = require("./adminRouter");
const reportRouter = require("./reportRouter");
const settingsRouter = require("./settingsRouter");
const subscribeRouter = require("./subscribeRouter");
const userRouter = require("./userRouter");
const contactRouter = require("./contactRouter");
const faqRouter = require("./faqRouter");
const offerRouter = require("./offerRouter");
const bookingRouter = require("./bookingRouter");

routerAdmin.use("/bus", busRouter);
routerAdmin.use("/bustype", busTypeRouter);
routerAdmin.use("/route", routeRouter);
routerAdmin.use("/schedule", scheduleRouter);
routerAdmin.use("/seat", seatRouter);
routerAdmin.use("/staff", staffRouter);
routerAdmin.use("/admin", adminRouter);
routerAdmin.use("/report", reportRouter);
routerAdmin.use("/setting", settingsRouter);
routerAdmin.use("/subscribe", subscribeRouter);
routerAdmin.use("/user", userRouter);
routerAdmin.use("/contact", contactRouter);
routerAdmin.use("/faq", faqRouter);
routerAdmin.use("/offer", offerRouter);
routerAdmin.use("/booking", bookingRouter);

module.exports = routerAdmin;
