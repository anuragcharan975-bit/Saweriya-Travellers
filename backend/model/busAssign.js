const mongoose = require("mongoose");

const busAssignSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  assigned_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("BusAssign", busAssignSchema);