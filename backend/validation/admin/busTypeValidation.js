const Joi = require("joi")

const validation = Joi.object({

    bus_type: Joi.string().required()

})

const updateValidation = Joi.object({

    bus_type: Joi.string()

})

module.exports = {
    validation,
    updateValidation
}
