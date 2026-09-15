const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({

    role_id: Number,
    full_name: String,
    gender: String,
    email: String,
    password: String,
    mobile_number: Number,
    date_of_birth: Date,
    address: String,
    city: String,
    state: String,
    pincode: Number,
    license_number: String,
    joining_date: Date,
    experience: String,
    salary: String,
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus"
    },
    photo: String,
    status: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
)



const Staff = mongoose.model("Users", staffSchema);
module.exports = Staff