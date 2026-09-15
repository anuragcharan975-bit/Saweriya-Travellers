const Joi = require("joi");

const validation = Joi.object({

    bookingId: Joi.string().required(),

    userId: Joi.string().required(),

    amount: Joi.number().required(),

    paymentMethod: Joi.string().valid(
        "UPI",
        "Credit Card",
        "Debit Card",
        "Net Banking",
        "Wallet"
    ).required()

})

module.exports = validation