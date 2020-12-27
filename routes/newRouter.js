var express = require('express');
const { findByIdAndDelete } = require('../db/models/campgroundsModel');
const campgroundsModel = require('../db/models/campgroundsModel');
var router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Joi = require('joi')
const ExpressError = require('../utilities/expressError');
const validateCampground = require('./schemas')


/* GET users listing. */


router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await campgroundsModel.find({})
    res.render('campgrounds/index', { campgrounds })
}));

router.get('/new', catchAsync(async (req, res, next) => {
    res.render('campgrounds/new')
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    // const { id } = req.params;
    const campground = await campgroundsModel.findById(req.params.id)
    res.render('campgrounds/show', { campground })
}));

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    // console.log('hello inside edit')
    const { id } = req.params;
    // console.log(id)
    const campground = await campgroundsModel.findById(id)
    const title = campground.title
    let [city, state] = campground.location.split(',')
    city = city.trim()
    state = state.trim()
    const image = campground.image
    const description = campground.description
    const price = campground.price
    res.render('campgrounds/edit', { title, city, state, image, description, price, id })
}));

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // const campgroundSchema = req.campgroundSchema
    // console.log(campgroundSchema)
    // const {campgroundData} = campgroundSchema.campground
    const { title, city, state, price, description, image } = req.body
    const newCampground = new campgroundsModel({
        title: title,
        location: `${city}, ${state}`,
        price: price,
        description: description,
        image: image
    })
    await newCampground.save()
    res.redirect('/campgrounds');

}));

router.get('/:id/delete', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await campgroundsModel.findByIdAndDelete(id)
    res.redirect('/campgrounds');
}));

router.post('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // const oldCampground = await campgroundsModel.findById(id)
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            image: Joi.string().required(),
            price: Joi.number().required().min(0),
            description: Joi.string().required()
        }).required()
    })
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    console.log(error)
    await campgroundsModel.findByIdAndUpdate(id, {
        title: campground.title,
        location: `${campground.city}, ${campground.state}`,
        price: campground.price,
        description: campground.description,
        image: campground.image
    },
        { new: true, runValidators: true })
    res.redirect(`/campgrounds/${id}`)
}));

// router.all('*', (req, res, next) => {
//   next(new ExpressError('Page Not Found', 404))
// })
// router.use((err, req, res, next) => {
//   const { status = 500 } = err;
//   if (!err.message) err.message = 'this is an emergancy error'
//   res.status(status).render('error', { err })
// })
module.exports = router;
