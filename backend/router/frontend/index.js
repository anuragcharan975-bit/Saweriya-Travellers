const express = require("express")
const router = express.Router()

const authRouter = require("./authRouter")
const searchRouter = require("./searchRouter")
const bookingRouter = require("./bookingRouter")
const paymentRouter = require("./paymentRouter")
const ticketRouter = require("./ticketRouter")
const notificationRouter = require("./notificationRouter")
const couponRouter = require("./couponRouter")
const walletRouter = require("./walletRouter")
const reviewRouter = require("./reviewRouter")
const subscribeRouter = require("./subscribeRouter")
const faqRouter = require("./faqRouter")
const offerRouter = require("./offerRouter")





router.use("/auth", authRouter)
router.use("/search", searchRouter)
router.use("/booking", bookingRouter)
router.use("/payment", paymentRouter)
router.use("/ticket", ticketRouter)
router.use("/notification", notificationRouter)
router.use("/coupon", couponRouter)
router.use("/wallet", walletRouter)
router.use("/review", reviewRouter)
router.use("/subscribe", subscribeRouter)
router.use("/faq", faqRouter)
router.use("/offer", offerRouter)




module.exports = router