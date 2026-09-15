const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "authentication"
    },

    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bus"
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    comment: String,

    status: {
        type: String,
        enum: ["Active", "Hidden"],
        default: "Active"
    }

}, {
    timestamps: true
})

const review = mongoose.model("review", reviewSchema);

module.exports = review