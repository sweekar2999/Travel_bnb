const Joi = require('joi');

// Define the schema for a review
module.exports.reviewSchema = Joi.object({
    review:Joi.object({  comment: Joi.string().min(3).max(500).required(),
        rating: Joi.number().min(1).max(5).required()}).required()

});