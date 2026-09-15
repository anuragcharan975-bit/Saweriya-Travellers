const Joi = require("joi");

const settingsValidation = Joi.object({
    appName: Joi.string().min(3).max(100).required(),

    logo: Joi.string().allow("", null),

    supportEmail: Joi.string().email().required(),

    supportPhone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.pattern.base": "Enter valid 10-digit Indian phone number",
        }),

    address: Joi.string().min(5).max(200).required(),

    currency: Joi.string().valid("INR", "USD", "EUR").default("INR"),

    timezone: Joi.string().required(),

    maintenanceMode: Joi.boolean(),

    isActive: Joi.boolean(),
});

module.exports = settingsValidation;