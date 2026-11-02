const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    full_name: {
      type: String,
      default: "Saweriya Admin",
    },
    mobile_no: {
      type: String,
      default: "",
    },
    profile_image: {
      type: String,
      default: "",
    },
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
