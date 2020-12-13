const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejsMate = require('ejs-mate');
// const ejs = require('ejs ')

const expressError = require('./utilities/expressError')

const indexRouter = require('./routes/index');
const campgroundsRouter = require('./routes/campgroundsRouter');
// const campgroundsIdRouter = require('./routes/campgroundsIdRouter')

const app = express();

//Database connection
const db = require('./db/database');
const ExpressError = require('./utilities/expressError');
db.on('error', console.error.bind(console, 'Connection Error: '))
db.once('open', () => {
  console.log('Database connected...')
})

// view engine setup
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/campgrounds', campgroundsRouter);
// app.use('/campgrounds/:id', campgroundsIdRouter)

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = 'this is an emergancy error'
  res.status(status).render('error', { err })
})

module.exports = app;
