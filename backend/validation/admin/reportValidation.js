const Joi = require("joi");

const validation = Joi.object({
  report_type: Joi.string()
    .valid(
      "Booking",
      "Revenue",
      "Bus",
      "Schedule",
      "Driver",
      "User"
    )
    .required(),

  from_date: Joi.date().required(),

  to_date: Joi.date().required(),

  bus: Joi.string().allow("", null),

  route: Joi.string().allow("", null),

  driver: Joi.string().allow("", null),

  booking_status: Joi.string()
    .valid(
      "Pending",
      "Confirmed",
      "Cancelled",
      "Completed"
    )
    .allow("", null),

  payment_status: Joi.string()
    .valid(
      "Pending",
      "Paid",
      "Failed",
      "Refunded"
    )
    .allow("", null),

  status: Joi.boolean(),
});

const updateValidation = validation;

module.exports = {
  validation,
  updateValidation,
};