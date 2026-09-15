const Joi = require("joi")

const validation = Joi.object({

    route_name: Joi.string().required(),

    source_city: Joi.string().required(),

    distance_city: Joi.string().required(),

    boarding_point: Joi.string().required(),

    dropping_point: Joi.string().required(),

    distance: Joi.string().required(),

    duration: Joi.string().required(),

    fare: Joi.number().required()

})


const updateValidation = Joi.object({

    route_name: Joi.string(),

    source_city: Joi.string(),

    distance_city: Joi.string(),

    boarding_point: Joi.string(),

    dropping_point: Joi.string(),

    distance: Joi.string(),

    duration: Joi.string(),

    fare: Joi.number()

})

module.exports = { validation, updateValidation }