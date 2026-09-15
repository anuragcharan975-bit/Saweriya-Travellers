const Booking = require("../../model/booking");
const Schedule = require("../../model/schedule");


// =====================================================
// CREATE BOOKING
// =====================================================

const createBooking = async (req, res) => {

    try {

        console.log("========== CREATE BOOKING ==========");
        console.log("USER:", req.user);
        console.log("BODY:", req.body);


        // =================================================
        // LOGIN CHECK
        // =================================================

        if (!req.user || !req.user.user_id) {

            return res.status(401).json({

                success: false,

                message: "Please login first"

            });

        }


        // =================================================
        // GET BODY
        // =================================================

        const {
            schedule_id,
            seat_number,
            total_amount
        } = req.body;


        // =================================================
        // SCHEDULE ID CHECK
        // =================================================

        if (!schedule_id) {

            return res.status(400).json({

                success: false,

                message: "Schedule is required"

            });

        }


        // =================================================
        // SEAT CHECK
        // =================================================

        if (
            !seat_number ||
            !Array.isArray(seat_number) ||
            seat_number.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message: "Please select at least one seat"

            });

        }


        // =================================================
        // REMOVE DUPLICATE SEATS
        // =================================================

        const selectedSeats = [
            ...new Set(
                seat_number.map(
                    seat => String(seat).trim()
                )
            )
        ];


        if (selectedSeats.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Please select at least one seat"

            });

        }


        // =================================================
        // AMOUNT CHECK
        // =================================================

        if (
            total_amount === undefined ||
            total_amount === null ||
            isNaN(Number(total_amount))
        ) {

            return res.status(400).json({

                success: false,

                message: "Valid total amount is required"

            });

        }


        // =================================================
        // CHECK SCHEDULE
        // =================================================

        const schedule =
            await Schedule.findById(
                schedule_id
            );


        if (!schedule) {

            return res.status(404).json({

                success: false,

                message: "Schedule not found"

            });

        }


        // =================================================
        // CHECK ALREADY BOOKED SEATS
        // =================================================

        const existingBookings =
            await Booking.find({

                schedule_id: schedule_id,

                booking_status: "Booked"

            });


        console.log(
            "EXISTING BOOKINGS:",
            existingBookings
        );


        // =================================================
        // GET ALL BOOKED SEATS
        // =================================================

        const bookedSeats = [];


        existingBookings.forEach(
            booking => {

                if (
                    Array.isArray(
                        booking.seat_number
                    )
                ) {

                    booking.seat_number.forEach(
                        seat => {

                            bookedSeats.push(
                                String(seat)
                            );

                        }
                    );

                }

            }
        );


        console.log(
            "ALREADY BOOKED SEATS:",
            bookedSeats
        );


        // =================================================
        // FIND CONFLICT
        // =================================================

        const alreadyBooked =
            selectedSeats.filter(
                seat =>
                    bookedSeats.includes(
                        String(seat)
                    )
            );


        if (
            alreadyBooked.length > 0
        ) {

            return res.status(409).json({

                success: false,

                message:
                    `Seat(s) ${alreadyBooked.join(", ")} already booked`,

                bookedSeats:
                    alreadyBooked

            });

        }


        // =================================================
        // CREATE BOOKING
        // =================================================

        const booking =
            await Booking.create({

                user_id:
                    req.user.user_id,

                schedule_id:
                    schedule_id,

                seat_number:
                    selectedSeats,

                total_amount:
                    Number(total_amount),

                booking_status:
                    "Booked"

            });


        console.log(
            "BOOKING CREATED:",
            booking
        );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Booking created successfully",

            data:
                booking

        });

    }
    catch (error) {

        console.log(
            "CREATE BOOKING ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Booking creation failed",

            error:
                error.message

        });

    }

};


// =====================================================
// BOOKING HISTORY
// =====================================================

const bookingHistory = async (req, res) => {

    try {

        // =================================================
        // LOGIN CHECK
        // =================================================

        if (
            !req.user ||
            !req.user.user_id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login first"

            });

        }


        // =================================================
        // FETCH BOOKINGS
        // =================================================

        const bookings =
            await Booking

                .find({

                    user_id:
                        req.user.user_id

                })

                .populate({

                    path:
                        "schedule_id",

                    populate: [

                        {
                            path: "bus"
                        },

                        {
                            path: "route"
                        }

                    ]

                })

                .sort({

                    createdAt:
                        -1

                });


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Booking history fetched successfully",

            data:
                bookings

        });

    }
    catch (error) {

        console.log(
            "BOOKING HISTORY ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch booking history",

            error:
                error.message

        });

    }

};


// =====================================================
// CANCEL BOOKING
// =====================================================

const cancelBooking = async (req, res) => {

    try {

        // =================================================
        // GET ID
        // =================================================

        const {
            id
        } = req.params;


        // =================================================
        // LOGIN CHECK
        // =================================================

        if (
            !req.user ||
            !req.user.user_id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login first"

            });

        }


        // =================================================
        // FIND USER BOOKING
        // =================================================

        const booking =
            await Booking.findOne({

                _id:
                    id,

                user_id:
                    req.user.user_id

            });


        if (!booking) {

            return res.status(404).json({

                success: false,

                message:
                    "Booking not found"

            });

        }


        // =================================================
        // ALREADY CANCELLED
        // =================================================

        if (
            booking.booking_status ===
            "Cancelled"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Booking is already cancelled"

            });

        }


        // =================================================
        // CANCEL
        // =================================================

        booking.booking_status =
            "Cancelled";


        await booking.save();


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Booking cancelled successfully",

            data:
                booking

        });

    }
    catch (error) {

        console.log(
            "CANCEL BOOKING ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Booking cancellation failed",

            error:
                error.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createBooking,

    bookingHistory,

    cancelBooking

};