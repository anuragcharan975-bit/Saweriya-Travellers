const Joi = require("joi");

const userValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile_number: Joi.alternatives()
    .try(
      Joi.string().pattern(/^[0-9]{10}$/),
      Joi.number().integer().min(1000000000).max(9999999999)
    )
    .required()
    .messages({
      "any.required": "Mobile number is required",
      "string.pattern.base": "Mobile number must be exactly 10 digits",
      "number.min": "Mobile number must be exactly 10 digits",
      "number.max": "Mobile number must be exactly 10 digits",
    }),
  gender: Joi.string().required(),
  date_of_birth: Joi.date().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.number().required(),
  emergency_contact_name: Joi.string().required(),
  emergency_contact_number: Joi.alternatives()
    .try(
      Joi.string().pattern(/^[0-9]{10}$/),
      Joi.number().integer().min(1000000000).max(9999999999)
    )
    .required()
    .messages({
      "any.required": "Emergency contact number is required",
      "string.pattern.base": "Emergency contact number must be exactly 10 digits",
      "number.min": "Emergency contact number must be exactly 10 digits",
      "number.max": "Emergency contact number must be exactly 10 digits",
    }),
});

module.exports = userValidation;
