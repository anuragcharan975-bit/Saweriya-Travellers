const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    name: String,
    email: String,
    age: String,
    mobile_number: Number,
    photo: String,
    gender: String,
    date_of_birth: Date,
    address: String,
    city: String,
    state: String,
    pincode: Number,
    emergency_contact_name: String,
    emergency_contact_number: Number,
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema)
module.exports = User