const Joi = require("joi");

const registerValidation = Joi.object({
  full_name: Joi.string().required().messages({
    "any.required": "Full name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required",
  }),

  mobile_no: Joi.alternatives()
    .try(
      Joi.string().pattern(/^[0-9]{10}$/).messages({
        "string.pattern.base": "Mobile number must be exactly 10 digits",
      }),
      Joi.number().integer().min(1000000000).max(9999999999).messages({
        "number.min": "Mobile number must be exactly 10 digits",
        "number.max": "Mobile number must be exactly 10 digits",
        "number.base": "Mobile number must be exactly 10 digits",
      })
    )
    .required()
    .messages({
      "any.required": "Mobile number is required",
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

const changePasswordValidation = Joi.object({
  old_password: Joi.string().min(6).required().messages({
    "string.min": "Old password must be at least 6 characters",
    "any.required": "Old password is required",
  }),
  new_password: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters",
    "any.required": "New password is required",
  }),
});

const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required",
  }),
});

const verifyOtpValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required",
  }),
  otp: Joi.alternatives().try(Joi.string(), Joi.number()).required().messages({
    "any.required": "OTP is required",
  }),
});

const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "New password is required",
  }),
});

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  verifyOtpValidation,
  resetPasswordValidation,
};
