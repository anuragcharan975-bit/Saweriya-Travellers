const Joi = require("joi")

const validation = Joi.object({

    register_number: Joi.string().required(),

    bus_name: Joi.string().required(),

    bus_type: Joi.string().required(),

    model: Joi.string().required(),

    total_seats: Joi.number().required()
})

const updateValidation = Joi.object({

    register_number: Joi.string(),

    bus_name: Joi.string(),

    bus_type: Joi.string(),

    model: Joi.string(),

    total_seats: Joi.number()


})

module.exports = {
    validation,
    updateValidation
}
