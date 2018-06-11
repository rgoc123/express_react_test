var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));

app.set('view engine', 'html');

// API Service
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ReactReduxExpressMongo')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

var Streams = require('./models/StreamModel.js');

var router = express.Router();
// app.use('/api', router);

app.post('/api', function(req, res){
  res.json({message: "Message from /api"});
});

app.get('/api/streams', function(req, res) {
  Streams.find(function(err, streams) {
    if (err) {
      res.send(err);
    }
    res.json(streams);
  });
});

app.post('/api/streams', function(req, res) {
  var stream = new Streams();
  stream.image = req.param('image');
  stream.name = req.param('name');
  stream.viewers = req.param('viewers');
  stream.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Stream created. Check Robo 3T!' });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
