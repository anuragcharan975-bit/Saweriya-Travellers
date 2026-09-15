const mongoose = require("mongoose");

const busTypeSchema = new mongoose.Schema({

    bus_type: String,
    status: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

const Bustype = mongoose.model("Bustype", busTypeSchema);
module.exports = Bustype