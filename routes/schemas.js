// const Joi = require('joi')
// const campgroundSchema = Joi.object({
//     campground: Joi.object({
//         title: Joi.string().required(),
//         city: Joi.string().required(),
//         state: Joi.string().required(),
//         image: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         description: Joi.string().required()
//     }).required()
// })

// const validateCampground = (req, res, next) => {
//     try {
//         req.campgroundSchema = campgroundSchema
//         const { error } = campgroundSchema.validate(req.body);
//         if (error) {
//             console.log('valid error')
//             const msg = error.details.map(el => el.message).join(',')
//             throw new Error(msg, 400)
//         }
//         else {
//             next()
//         }
//     } catch {
//         console.log('heyyo')
//     }
// }

// module.exports = validateCampground
const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});