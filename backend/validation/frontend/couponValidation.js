const Joi = require("joi");

const validation = Joi.object({

    couponCode: Joi.string().required(),

    discountType: Joi.string().valid("Percentage","Fixed").required(),
    
    discountValue: Joi.number().required(),

    minAmount: Joi.number().required(),

    expiryDate: Joi.date().required(),

    status: Joi.string().valid("Active", "Inactive")

})

module.exports = validation