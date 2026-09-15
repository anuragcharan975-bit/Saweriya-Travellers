const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    seat_number: {
      type: String,
      required: true,
    },

    bus_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bustype",
      required: true,
    },

    fare: {
      type: Number,
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Seat", seatSchema);