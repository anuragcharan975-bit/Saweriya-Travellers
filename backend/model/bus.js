const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({

    register_number: String,
    bus_name: String,
    bus_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bustype"
  },
    bus_image: String,
    model: String,
    total_seats: Number,
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Bus = mongoose.model("Bus", busSchema);
module.exports = Bus