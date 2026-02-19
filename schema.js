const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({    // listing required ho
        title: Joi.string().required(),   // title string type ka ho & required 
        description: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),    //to price ki min val 0 
        location: Joi.string().required(),
        image: Joi.string().allow("",null),
        category: Joi.string().required()   // to use category
    }).required()
})


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});