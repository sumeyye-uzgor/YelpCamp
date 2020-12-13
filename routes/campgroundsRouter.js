var express = require('express');
const { findByIdAndDelete } = require('../db/models/campgroundsModel');
const campgroundsModel = require('../db/models/campgroundsModel');
var router = express.Router();
const catchAsync = require('../utilities/catchAsync')

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

router.post('/', catchAsync(async (req, res, next) => {
  const { title, city, state, price, image, description } = req.body;
  const campground = new campgroundsModel({
    title: title,
    price: parseInt(price),
    location: `${city}, ${state}`,
    image: image,
    description: description
  })
  await campground.save()
  res.redirect('/campgrounds');
  // res.send(req.body);
}));

router.get('/:id/delete', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await campgroundsModel.findByIdAndDelete(id)
  res.redirect('/campgrounds');
}));

router.post('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await campgroundsModel.findById(id)
  const { title, city, state, price, description, image } = req.body;
  await campgroundsModel.findByIdAndUpdate(id, { title: title, location: `${city}, ${state}`, price: price, description: description, image: image }, { new: true })
  res.redirect(`/campgrounds/${id}`)
}));

module.exports = router;
