const mongoose = require("mongoose");


const bookingSchema = new mongoose.Schema(

    {

        // ==========================================
        // USER
        // ==========================================

        user_id: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "users",

            required: true

        },


        // ==========================================
        // SCHEDULE
        // ==========================================

        schedule_id: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Schedule",

            required: true

        },


        // ==========================================
        // SEATS
        // ==========================================

        seat_number: {

            type: [String],

            required: true

        },


        // ==========================================
        // TOTAL AMOUNT
        // ==========================================

        total_amount: {

            type: Number,

            required: true

        },


        // ==========================================
        // BOOKING STATUS
        // ==========================================

        booking_status: {

            type: String,

            enum: [

                "Booked",

                "Cancelled"

            ],

            default: "Booked"

        }

    },

    {

        timestamps: true

    }

);


const Booking = mongoose.model(
    "Booking",
    bookingSchema
);


module.exports = Booking;