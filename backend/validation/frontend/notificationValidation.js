const Joi = require("joi");

const validation = Joi.object({

    userId: Joi.string().required(),

    tittle: Joi.string().required(),
    
    message: Joi.string().required()

})

module.exports = validation