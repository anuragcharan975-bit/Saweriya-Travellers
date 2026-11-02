const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({

    route_name: String,
    source_city: String,
    distance_city: String,
    boarding_point: String,
    dropping_point: String,
    distance: String,
    duration: String,
    fare: Number,
    
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})


const Route = mongoose.model("Route", routeSchema);
module.exports = Route
