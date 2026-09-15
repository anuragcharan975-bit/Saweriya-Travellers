const Joi = require("joi");

const validation = Joi.object({

    userId: Joi.string().required(),

    busId: Joi.string().required(),
    
    rating: Joi.number().min(1).max(5).required(),

    comment: Joi.number().required(),

    status:Joi.string().valid("Active", "Hidden")
})

module.exports = validation