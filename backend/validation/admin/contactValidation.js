const Joi = require("joi");

const validation = Joi.object({

  full_name: Joi.string().required(),

  email: Joi.string().email().required(),

  mobile_no: Joi.number().required()
    .messages({
      "number": "Mobile number must be exactly 10 digits",
      "any.required": "Mobile number is required",
    }),

  subject: Joi.string().required(),

  message: Joi.string().required(),
},
  {
    timestamps: true,
  }
);

module.exports = validation