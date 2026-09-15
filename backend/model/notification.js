const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "authentication"
    },

    tittle:String ,

    message:String,

   status : {
        type: String,
        enum: ["Unread", "Read"],
        default: "Unread"
    }

}, {
    timestamps: true
})

const notification = mongoose.model("notification", notificationSchema);

module.exports = notification