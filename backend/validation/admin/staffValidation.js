const Joi = require("joi");

const validation = Joi.object({
  role_id: Joi.number().required(),
  full_name: Joi.string().required(),
  gender: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
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
  date_of_birth: Joi.date().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.number().required(),
  license_number: Joi.string().required(),
  joining_date: Joi.date().required(),
  experience: Joi.string().required(),
  salary: Joi.string().required(),
  bus: Joi.string().allow("", null),
  photo: Joi.any(),
});

const updateValidation = Joi.object({
  role_id: Joi.number(),
  full_name: Joi.string(),
  gender: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6).messages({
    "string.min": "Password must be at least 6 characters",
  }),
  mobile_number: Joi.alternatives().try(
    Joi.string().pattern(/^[0-9]{10}$/),
    Joi.number().integer().min(1000000000).max(9999999999)
  ),
  date_of_birth: Joi.date(),
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  pincode: Joi.number(),
  license_number: Joi.string(),
  joining_date: Joi.date(),
  experience: Joi.string(),
  salary: Joi.string(),
  bus: Joi.string().allow("", null),
  photo: Joi.any(),
});

module.exports = {
  validation,
  updateValidation,
};
