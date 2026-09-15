const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({

    full_name: String,
    email: String,
    mobile_no: Number,
    subject: String,
    message: String

}, {
    timestamps: true
})

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact