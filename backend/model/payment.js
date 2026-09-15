const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking"
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "authentication"
    },

    amount: Number,

    paymentMethod: {
        type: String,
        enum: [
            "UPI",
            "Credit Card",
            "Debit Card",
            "Net Banking",
            "Wallet"
        ]
    },

    transactionId: String,

    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Success",
            "Failed",
            "Refunded"
        ],
        default: "Pending"
    }

}, {
    timestamps: true
})

const payment = mongoose.model("payment", paymentSchema);

module.exports = payment