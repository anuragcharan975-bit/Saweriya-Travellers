const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "authentication"
        },

  balance  : {
        type: Number,
        default: 0
    },

    transactionType: {
        type: String,
        enum: ["Credit", "Debit"]
    },

    amount: Number,

    description:String

}, {
    timestamps: true
})

const wallet = mongoose.model("wallet", walletSchema);

module.exports = wallet