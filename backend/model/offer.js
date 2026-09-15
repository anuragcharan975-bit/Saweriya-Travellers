const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({

    title: String,
    description: String,
    discount: String,
    status: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
    }
);

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer