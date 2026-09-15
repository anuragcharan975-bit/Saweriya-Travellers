const Joi = require("joi");

const searchBusValidation = Joi.object({

    source: Joi.string().required(),

    destination: Joi.string().required()

})

const searchDateValidation = Joi.object({

    date: Joi.date().required()

})

const filterBusValidation = Joi.object({

    busType: Joi.string(),

    minFare: Joi.number(),

    maxFare: Joi.number()

})

module.exports = {

    searchBusValidation,
    searchDateValidation,
    filterBusValidation

}
