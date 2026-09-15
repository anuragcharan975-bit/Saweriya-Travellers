const Joi = require("joi");

const faqValidation = Joi.object({

    question: Joi.string().required().messages({
        "string.empty": "Question is required.",
    }),

    answer: Joi.string().required().messages({
        "string.empty": "Answer is required.",
    }),
});

const updateValidation = Joi.object({

    question: Joi.string(),

    answer: Joi.string()
});

module.exports = { faqValidation, updateValidation };