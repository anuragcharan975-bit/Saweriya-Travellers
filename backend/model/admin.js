const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    role_id: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("user", adminSchema);

module.exports = Admin;