var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var webinfoRouter = require('./routes/webinfo');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/api/webinfo', webinfoRouter);

if (typeof process.env.PORT === 'undefined') {
    PORT = process.env.PORT;
} else {
    PORT = 3000;
}

app.listen(PORT)

module.exports = app;
