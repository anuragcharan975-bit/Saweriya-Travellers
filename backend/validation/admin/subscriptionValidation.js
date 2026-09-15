const Joi = require("joi");

const validation = Joi.object({

    bus: Joi.string().required(),

    plan_name: Joi.string().required(),

    amount: Joi.number().required(),

    duration: Joi.string().required(),

    start_date: Joi.date().required(),

    end_date: Joi.date().required(),

});

const updateValidation = Joi.object({

    bus: Joi.string(),

    plan_name: Joi.string(),

    amount: Joi.number(),

    duration: Joi.string(),

    start_date: Joi.date(),

    end_date: Joi.date(),

});

module.exports = {
    validation,
    updateValidation
};