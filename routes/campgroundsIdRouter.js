var express = require('express');
const campgroundsModel = require('../db/models/campgroundsModel');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
    const { id } = req.params;
    console.log(`id is ${id}`)
    const campground = await campgroundsModel.find({ _id: id })
    res.render('campgrounds/show', { campground })
});

module.exports = router;
