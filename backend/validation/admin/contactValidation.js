const Joi = require("joi");

const validation = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile_no: Joi.alternatives()
    .try(
      Joi.string().pattern(/^[0-9]{10}$/),
      Joi.number().integer().min(1000000000).max(9999999999)
    )
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits",
      "number.min": "Mobile number must be exactly 10 digits",
      "number.max": "Mobile number must be exactly 10 digits",
      "any.required": "Mobile number is required",
    }),
});

module.exports = validation;
