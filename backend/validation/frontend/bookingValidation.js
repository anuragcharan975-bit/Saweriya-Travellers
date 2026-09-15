const Joi = require("joi");

const validation = Joi.object({

    bus_id: Joi.string()
        .required()
        .messages({
            "string.empty": "Bus ID is required",
            "any.required": "Bus ID is required"
        }),

    schedule_id: Joi.string()
        .required()
        .messages({
            "string.empty": "Schedule ID is required",
            "any.required": "Schedule ID is required"
        }),

    seat_number: Joi.array()
        .items(Joi.string().trim().required())
        .min(1)
        .required()
        .messages({
            "array.base": "Seat number must be an array",
            "array.min": "At least one seat must be selected",
            "any.required": "Seat number is required"
        }),

    trip_date: Joi.date()
        .required()
        .messages({
            "date.base": "Invalid trip date",
            "any.required": "Trip date is required"
        }),

    total_amount: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Total amount must be a number",
            "number.positive": "Total amount must be greater than 0",
            "any.required": "Total amount is required"
        })

});

module.exports = validation;