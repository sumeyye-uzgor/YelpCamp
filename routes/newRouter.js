var express = require('express');
const campgroundsModel = require('../db/models/campgroundsModel');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
    // const campgrounds = await campgroundsModel.find({})
    res.render('campgrounds/new')
});

// router.get('/:id', async (req, res, next) => {
//     const { id } = req.params;
//     console.log(`id is ${id}`)
//     const campground = await campgroundsModel.findById(id)
//     // console.log(`title is ${campground}`)
//     console.log(`title is ${campground} and ${campground.title}`)
//     res.render('campgrounds/show', { campground })
// });

module.exports = router;
