require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

var volcanoRoutes = require('./routes/volcano');
var userRoutes = require('./routes/user');

const app = express();

const options = require('./knexfile');
const knex = require('knex')(options);
const cors = require('cors');

app.use((req, res, next) => {
  req.db = knex;
  next();
});

knex.schema.hasTable('users').then(exists => {
  if (!exists) {
    return knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('firstName');
      table.string('lastName');
      table.string('dob');
      table.string('address');
    });
  }
});

knex.schema.hasTable('comments').then(exists => {
  if (!exists) {
    return knex.schema.createTable('comments', table => {
      table.increments('id').primary();
      table.integer('volcanoId').notNullable().references('id').inTable('data');
      table.string('userEmail').notNullable().references('email').inTable('users');
      table.text('comment').notNullable();
      table.integer('rating').notNullable().checkBetween([1, 5]);
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

logger.token('res', (req, res) => {
  const headers = {}
  res.getHeaderNames().map(h => headers[h] = res.getHeader(h))
  return JSON.stringify(headers)
}) 


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/knex', function (req, res, next) {
  req.db.raw("SELECT VERSION()").then(
    (version) => console.log((version[0][0]))
  ).catch((err) => { console.log(err); throw err })
  res.send("Version Logged successfully");
});

app.get('/me', (req, res) => {
  res.json({
    name: 'Alif Papp',
    student_number: 'n11078804',
  });
});
app.use('/', volcanoRoutes);
app.use('/', userRoutes);
app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

