var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cloudinary = require('cloudinary');
var multer = require('multer');

var root = require('./routes/root.js');
var auth = require('./routes/auth.js');
var api = require('./routes/api.js');
var configDB = require('./config/database.js');

require('./config/passport')(passport);
mongoose.connect(configDB.url);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/src/')));

app.use(session({ secret : 'supersecretsession' , resave : false, saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.use('/', root);
app.use('/auth', auth);
app.use('/api', api);

module.exports = app;
