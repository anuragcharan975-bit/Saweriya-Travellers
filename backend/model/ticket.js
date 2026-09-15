const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({

    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking"
    },

    ticketNumber:String ,

    qrCode:String,

    ticketStatus: {
        type: String,
        enum: ["Active", "Cancelled"],
        default: "Active"
    }

}, {
    timestamps: true
})

const ticket = mongoose.model("ticket", ticketSchema);

module.exports = ticket