const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    report: {
      type: String,
      required: true,
    },

    from_date: {
      type: Date,
      required: true,
    },

    to_date: {
      type: Date,
      required: true,
    },

    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      default: null,
    },

    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    booking_status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Cancelled",
        "Completed"
      ],
      default: "Pending",
    },

    payment_status: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded"
      ],
      default: "Pending",
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


const Report=mongoose.model("Report", reportSchema);
module.exports =Report