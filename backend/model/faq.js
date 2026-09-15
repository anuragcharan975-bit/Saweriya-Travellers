const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
    {
        question: String,

        answer: String,

        status: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Faq = mongoose.model("Faq", faqSchema);
module.exports = Faq