const express = require("express");
const router = express.Router();

const optionalToken = require("../../middleware/optionalToken");

const {
    createBooking,
    bookingHistory,
    cancelBooking,
    getBookedSeats
} = require("../../controller/frontend/bookingController");

// =====================================================
// CREATE BOOKING (Support both /create and /add)
// =====================================================

router.post("/create", optionalToken, createBooking);
router.post("/add", optionalToken, createBooking);

// =====================================================
// BOOKING HISTORY
// =====================================================

router.get("/history", optionalToken, bookingHistory);

// =====================================================
// BOOKED SEATS (Auto-freed when trip finishes)
// =====================================================

router.get("/booked-seats/:schedule_id", optionalToken, getBookedSeats);
router.get("/booked-seats", optionalToken, getBookedSeats);

// =====================================================
// CANCEL BOOKING
// =====================================================

router.put("/cancel/:id", optionalToken, cancelBooking);

module.exports = router;
