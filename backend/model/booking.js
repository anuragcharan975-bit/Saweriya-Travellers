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

        user_email: {
            type: String,
            default: ""
        },

        // ==========================================
        // SCHEDULE (Optional reference)
        // ==========================================
        schedule_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schedule",
            required: false
        },

        // ==========================================
        // SEATS
        // ==========================================
        seat_number: {
            type: [String],
            required: true
        },

        seat_types: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        // ==========================================
        // CATERING & TRAVEL ADDONS (450+ KM ROUTES)
        // ==========================================
        addons: {
            type: [
                {
                    id: String,
                    name: String,
                    count: Number,
                    price: Number,
                    total: Number
                }
            ],
            default: []
        },

        addons_amount: {
            type: Number,
            default: 0
        },

        distance: {
            type: String,
            default: ""
        },

        // ==========================================
        // DISCOUNTS & PROMOTIONAL OFFERS
        // ==========================================
        discount_type: {
            type: String,
            default: "NONE" // "COUPLE", "GROUP", "NONE"
        },

        discount_amount: {
            type: Number,
            default: 0
        },

        discount_percent: {
            type: Number,
            default: 0
        },

        female_verification_required: {
            type: Boolean,
            default: false
        },

        stand_verification_note: {
            type: String,
            default: ""
        },

        // ==========================================
        // TOTAL AMOUNT
        // ==========================================
        total_amount: {
            type: Number,
            required: true
        },

        // ==========================================
        // BUS & ROUTE SNAPSHOT (Guaranteed display)
        // ==========================================
        bus_name: {
            type: String,
            default: ""
        },

        register_number: {
            type: String,
            default: ""
        },

        bus_type: {
            type: String,
            default: ""
        },

        model: {
            type: String,
            default: ""
        },

        route: {
            type: String,
            default: ""
        },

        source_city: {
            type: String,
            default: ""
        },

        distance_city: {
            type: String,
            default: ""
        },

        departure: {
            type: String,
            default: ""
        },

        arrival: {
            type: String,
            default: ""
        },

        journey_date: {
            type: Date,
            default: null
        },

        // ==========================================
        // BOOKING STATUS
        // ==========================================
        booking_status: {
            type: String,
            enum: [
                "Booked",
                "Confirmed",
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
