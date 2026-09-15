const Joi = require("joi");

const validation = Joi.object({

    role_id: Joi.number().required(),

    full_name: Joi.string().required(),

    gender: Joi.string().required(),

    email: Joi.string().email().required(),

    password: Joi.string().required(),

    mobile_number: Joi.number().required(),

    date_of_birth: Joi.date().required(),

    address: Joi.string().required(),

    city: Joi.string().required(),

    state: Joi.string().required(),

    pincode: Joi.number().required(),

    license_number: Joi.string().required(),

    joining_date: Joi.date().required(),

    experience: Joi.string().required(),

    salary: Joi.string().required(),

    bus: Joi.string(),

});

const updateValidation = Joi.object({

    role_id: Joi.number(),

    full_name: Joi.string(),

    gender: Joi.string(),

    email: Joi.string().email(),

    password: Joi.string(),

    mobile_number: Joi.number(),

    date_of_birth: Joi.date(),

    address: Joi.string(),

    city: Joi.string(),

    state: Joi.string(),

    pincode: Joi.number(),

    license_number: Joi.string(),

    joining_date: Joi.date(),

    experience: Joi.string(),

    salary: Joi.string(),

    bus: Joi.string()

});

module.exports = {
    validation,
    updateValidation
};