const Joi = require("joi")

const userValidation = Joi.object({

    name: Joi.string().required(),

    email: Joi.string().email().required(),

    mobile_number: Joi.number().required(),

    gender: Joi.string().required(),

    date_of_birth: Joi.date().required(),

    address: Joi.string().required(),

    city: Joi.string().required(),

    state: Joi.string().required(),

    pincode: Joi.number().required(),

    emergency_contact_name: Joi.string().required(),

    emergency_contact_number: Joi.number().required()

})

module.exports = userValidation
