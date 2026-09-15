const Joi = require("joi");

const validation = Joi.object({

    bus: Joi.string()
        .required(),

    route: Joi.string()
        .required(),

    departure_time: Joi.string()
        .required(),

    arrival_time: Joi.string()
        .required(),

    trip_date: Joi.date()
        .required()

});


const updateValidation = Joi.object({

    bus: Joi.string(),

    route: Joi.string(),

    departure_time: Joi.string(),

    arrival_time: Joi.string(),

    trip_date: Joi.date()

});


module.exports = {
    validation,
    updateValidation
};