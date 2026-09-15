const Joi = require("joi");

const validation = Joi.object({

    bookingId: Joi.string().required()

})

module.exports = validation