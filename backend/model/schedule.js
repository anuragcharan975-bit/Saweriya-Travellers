const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    
        bus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus"
        },

        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route"
        },

        departure_time: {
            type: String
        },

        arrival_time: {
            type: String
        },

        trip_date: {
            type: Date
        },

        status: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);


const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;