const express = require("express");

const router = express.Router();


const verifyToken =
    require("../../middleware/verifyToken");


const {

    createBooking,

    bookingHistory,

    cancelBooking

} = require("../../controller/frontend/bookingController");


// =====================================================
// CREATE BOOKING
// =====================================================

router.post(

    "/create",

    verifyToken,

    createBooking

);


// =====================================================
// BOOKING HISTORY
// =====================================================

router.get(

    "/history",

    verifyToken,

    bookingHistory

);


// =====================================================
// CANCEL BOOKING
// =====================================================

router.put(

    "/cancel/:id",

    verifyToken,

    cancelBooking

);


module.exports = router;