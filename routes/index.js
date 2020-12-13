var express = require('express');
const catchAsync = require('../utilities/catchAsync');
var router = express.Router();

/* GET home page. */
router.get('/', catchAsync(async (req, res, next) => {
  res.render('home', { title: 'YelpCamp' });
}));

module.exports = router;
