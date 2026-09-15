const Joi = require("joi");

const registerValidation = Joi.object({
  full_name: Joi.string().required(),

  email: Joi.string().email().required(),

  mobile_no: Joi.number().required()
    .messages({
      "number": "Mobile number must be exactly 10 digits",
      "any.required": "Mobile number is required",
    }),

  password: Joi.string().min(6).required(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const changePasswordValidation = Joi.object({

old_password:Joi.string().required(),

new_password:Joi.string().min(6).required()

});

const forgotPasswordValidation = Joi.object({

    email: Joi.string().email().required()

})

const verifyOtpValidation = Joi.object({

    email: Joi.string().email().required(),

    otp: Joi.string().required()

})

const resetPasswordValidation = Joi.object({

    email: Joi.string().email().required(),

    newPassword: Joi.string().min(6).required()

})

module.exports = {
  registerValidation,
  loginValidation,
      changePasswordValidation,
      forgotPasswordValidation,
      verifyOtpValidation,
      resetPasswordValidation
}