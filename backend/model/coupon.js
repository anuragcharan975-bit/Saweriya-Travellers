const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({

    couponCode: String,

    discountType: {
        type: String,
        enum: ["Percentage", "Fixed"]
    },

    discountValue: Number,

    minAmount: Number,

    expiryDate:Date,

      status : {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
}, {
    timestamps: true
})

const coupon = mongoose.model("coupon", couponSchema);

module.exports = coupon