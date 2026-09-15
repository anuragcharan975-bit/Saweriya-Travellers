const Joi = require("joi");

const validation = Joi.object({

    userId: Joi.string().required(),

    transactionType: Joi.string().valid("Credit","Debit").required(),
    
    amount: Joi.number().required(),

    description: Joi.number().required()

})

module.exports = validation