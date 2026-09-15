const Joi = require("joi");

const offerValidation = Joi.object({

    title:Joi.string().required().messages({
            "string.empty":"Offer title is required"
        }),

    description:Joi.string().required().messages({
            "string.empty":"Description is required"
        }),

    discount:Joi.string().required().messages({
            "string.empty":"Discount is required"
        }),

});

const updateValidation = Joi.object({

    title: Joi.string().messages({
        "string.empty": "Offer title is required"
    }),

    description: Joi.string().messages({
        "string.empty": "Description is required"
    }),

    discount: Joi.string().messages({
        "string.empty": "Discount is required"
    }),

});


module.exports = {offerValidation,updateValidation};