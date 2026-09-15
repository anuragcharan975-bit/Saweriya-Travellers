const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema(
    {

        // ==========================================
        // FULL NAME
        // ==========================================

        full_name: {
            type: String,
            required: true
        },


        // ==========================================
        // EMAIL
        // ==========================================

        email: {
            type: String,
            required: true
        },


        // ==========================================
        // MOBILE NUMBER
        // ==========================================

        mobile_no: {
            type: Number,
            required: true
        },


        // ==========================================
        // PASSWORD
        // ==========================================

        password: {
            type: String,
            required: true
        },


        // ==========================================
        // ROLE
        // ==========================================

        role_id: {
            type: Number,
            default: 4
        },


        // ==========================================
        // PROFILE IMAGE
        // ==========================================

        profile_image: {
            type: String,
            default: ""
        }

    },

    {
        timestamps: true
    }
);


// ==========================================
// MODEL
// ==========================================

const Authentication =
    mongoose.model(
        "users",
        registerSchema
    );


module.exports = Authentication;