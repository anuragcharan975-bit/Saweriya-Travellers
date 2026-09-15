const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        appName: {
            type: String,
            required: true,
            default: "Bus Management System",
        },

        logo: {
            type: String,
            default: "",
        },

        supportEmail: {
            type: String,
            required: true,
        },

        supportPhone: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        currency: {
            type: String,
            default: "INR",
        },

        timezone: {
            type: String,
            default: "Asia/Kolkata",
        },

        maintenanceMode: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);