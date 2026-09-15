const Joi = require("joi");

const validation = Joi.object({

    bus: Joi.string().required(),

    seat_number: Joi.string().required(),

    bus_type: Joi.string() .required(),

    fare: Joi.number().required(),

})

const updateValidation = Joi.object({

    bus: Joi.string(),

    seat_number: Joi.string(),

    bus_type: Joi.string() ,

    fare: Joi.number(),

})


module.exports = {
    validation,updateValidation
}