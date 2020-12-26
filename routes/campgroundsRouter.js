var express = require('express');
const { findByIdAndDelete } = require('../db/models/campgroundsModel');
const campgroundsModel = require('../db/models/campgroundsModel');
var router = express.Router();
const catchAsync = require('../utilities/catchAsync');
// const Joi = require('joi')
const ExpressError = require('../utilities/expressError');
const {campgroundSchema} = require('./schemas.js')


/* GET users listing. */
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

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

  const oldCampground = req.body.campground;
  const newCampground = new campgroundsModel({
    title: oldCampground.title,
    location: `${oldCampground.city}, ${oldCampground.state}`,
    price: oldCampground.price,
    description: oldCampground.description,
    image: oldCampground.image
  })
  await newCampground.save()
  res.redirect('/campgrounds');

}));

router.get('/:id/delete', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await campgroundsModel.findByIdAndDelete(id)
  res.redirect('/campgrounds');
}));

router.post('/:id', validateCampground, catchAsync(async (req, res, next) => {

  const { id } = req.params;
  const oldCampground = req.body.campground;
  await campgroundsModel.findByIdAndUpdate(id, { 
    title: oldCampground.title, 
    location: `${oldCampground.city}, ${oldCampground.state}`,
    price: oldCampground.price, 
    description: oldCampground.description, 
    image: oldCampground.image },
     { new: true, runValidators: true })
  res.redirect(`/campgrounds/${id}`)
}));

module.exports = router;
