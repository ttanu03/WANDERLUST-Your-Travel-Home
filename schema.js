const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        listing: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.string().required().min(0),
        image: Joi.string().allow("", null),
    }).required(),
});

//Server side validation occur  making Schema for Review route & comment protection
//unauthories or empty data not to be send 
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
}); 
